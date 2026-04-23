import { StatusCodes } from 'http-status-codes';

import Application from '../models/Application.js';
import Drive from '../models/Drive.js';
import FormResponse from '../models/FormResponse.js';
import { AppError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildApplicationsWorkbook } from '../utils/exporter.js';
import { createDriveForm } from '../utils/googleForms.js';
import { createAndDispatchNotification } from '../utils/notificationService.js';

const isEligible = (student, drive) => {
  const departments = drive.eligibility.departments || [];
  const allowedBatches = drive.eligibility.allowedBatches || [];

  if (departments.length && !departments.includes(student.department)) return false;
  if (allowedBatches.length && !allowedBatches.includes(student.batch)) return false;
  if ((student.academics?.tenthPercentage || 0) < drive.eligibility.minTenthPercentage) return false;
  if ((student.academics?.twelfthPercentage || 0) < drive.eligibility.minTwelfthPercentage) return false;
  if ((student.academics?.cgpa || 0) < drive.eligibility.minCgpa) return false;

  return true;
};

export const createDrive = asyncHandler(async (req, res) => {
  const drive = await Drive.create({
    ...req.body,
    createdBy: req.user._id,
  });

  const form = await createDriveForm({
    drive,
    fields: [
      'Full Name',
      'Roll Number',
      'Email',
      'Mobile Number',
      '10th Percentage',
      '12th Percentage',
      'CGPA',
      ...req.body.googleFormFields,
    ],
  });

  drive.googleForm = form;
  await drive.save();

  await createAndDispatchNotification({
    title: `New placement drive: ${drive.companyName}`,
    message: `${drive.companyName} is hiring for ${drive.role}. Registration closes on ${new Date(drive.registrationDeadline).toLocaleString()}.`,
    audience: 'student',
    createdBy: req.user._id,
    type: 'drive',
    emailSubject: `New drive posted: ${drive.companyName}`,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Drive published successfully',
    data: drive,
  });
});

export const getDrives = asyncHandler(async (req, res) => {
  const now = new Date();
  const baseQuery = {};

  if (req.user.role === 'student') {
    baseQuery.registrationDeadline = { $gte: now };
    baseQuery.registrationEnabled = true;
  }

  const drives = await Drive.find(baseQuery).sort({ driveDate: 1 }).populate('createdBy', 'fullName role');

  const data =
    req.user.role === 'student'
      ? drives.map((drive) => ({
          ...drive.toObject(),
          eligible: isEligible(req.user, drive),
        }))
      : drives;

  res.status(StatusCodes.OK).json({
    success: true,
    data,
  });
});

export const getDriveById = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id).populate('createdBy', 'fullName');

  if (!drive) {
    throw new AppError('Drive not found', StatusCodes.NOT_FOUND);
  }

  const application =
    req.user.role === 'student'
      ? await Application.findOne({ drive: drive._id, student: req.user._id })
      : null;

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      drive,
      application,
      eligible: req.user.role === 'student' ? isEligible(req.user, drive) : true,
    },
  });
});

export const applyToDrive = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    throw new AppError('Drive not found', StatusCodes.NOT_FOUND);
  }

  if (drive.registrationDeadline < new Date() || !drive.registrationEnabled) {
    throw new AppError('Registration is closed for this drive');
  }

  if (!isEligible(req.user, drive)) {
    throw new AppError('You do not meet the eligibility criteria', StatusCodes.FORBIDDEN);
  }

  const application = await Application.create({
    drive: drive._id,
    student: req.user._id,
    formPayload: req.body.formPayload,
  });

  await FormResponse.create({
    drive: drive._id,
    application: application._id,
    googleFormId: drive.googleForm?.formId,
    responseData: req.body.formPayload,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Drive application submitted successfully',
    data: application,
  });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.applicationId).populate('student drive');

  if (!application) {
    throw new AppError('Application not found', StatusCodes.NOT_FOUND);
  }

  application.status = req.body.status;
  await application.save();

  await createAndDispatchNotification({
    title: `Application update: ${application.drive.companyName}`,
    message: `Your application status for ${application.drive.companyName} has been updated to ${req.body.status}.`,
    audience: 'custom',
    recipientIds: [application.student._id],
    createdBy: req.user._id,
    type: 'announcement',
    emailSubject: `Placement application update for ${application.drive.companyName}`,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Application status updated successfully',
    data: application,
  });
});

export const getDriveApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ drive: req.params.id })
    .populate('student', 'fullName rollNo email mobile department academics')
    .sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    data: applications,
  });
});

export const exportDriveApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ drive: req.params.id }).populate(
    'student',
    'fullName rollNo email mobile department academics',
  );

  const buffer = await buildApplicationsWorkbook(applications);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=registered-students.xlsx');
  res.send(buffer);
});

export const toggleRegistration = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    throw new AppError('Drive not found', StatusCodes.NOT_FOUND);
  }

  drive.registrationEnabled = req.body.registrationEnabled;
  await drive.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Drive registration ${drive.registrationEnabled ? 'enabled' : 'disabled'} successfully`,
    data: drive,
  });
});

export const updateDrive = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    throw new AppError('Drive not found', StatusCodes.NOT_FOUND);
  }

  Object.assign(drive, req.body);

  if (Array.isArray(req.body.googleFormFields)) {
    drive.googleForm = {
      ...drive.googleForm,
      fields: req.body.googleFormFields,
    };
  }

  await drive.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Drive updated successfully',
    data: drive,
  });
});

export const deleteDrive = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    throw new AppError('Drive not found', StatusCodes.NOT_FOUND);
  }

  await Promise.all([
    Application.deleteMany({ drive: drive._id }),
    FormResponse.deleteMany({ drive: drive._id }),
    Drive.findByIdAndDelete(drive._id),
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Drive deleted successfully',
    data: drive,
  });
});
