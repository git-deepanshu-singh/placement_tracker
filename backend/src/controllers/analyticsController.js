import { StatusCodes } from 'http-status-codes';

import Application from '../models/Application.js';
import Drive from '../models/Drive.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOverviewAnalytics = asyncHandler(async (_req, res) => {
  const [totalStudents, totalFaculty, totalDrives, totalPlaced] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'faculty' }),
    Drive.countDocuments(),
    Application.countDocuments({ status: 'selected' }),
  ]);

  const companyWise = await Application.aggregate([
    { $match: { status: 'selected' } },
    {
      $lookup: {
        from: 'drives',
        localField: 'drive',
        foreignField: '_id',
        as: 'drive',
      },
    },
    { $unwind: '$drive' },
    {
      $group: {
        _id: '$drive.companyName',
        selected: { $sum: 1 },
      },
    },
    { $sort: { selected: -1 } },
  ]);

  const yearly = await Drive.aggregate([
    {
      $group: {
        _id: { $year: '$driveDate' },
        totalDrives: { $sum: 1 },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      summary: { totalStudents, totalFaculty, totalDrives, totalPlaced },
      companyWise,
      yearly,
    },
  });
});

export const getStudentAnalytics = asyncHandler(async (req, res) => {
  const applications = await Application.find({ student: req.user._id }).populate('drive');

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      readinessScore: req.user.placementReadinessScore,
      strengths: req.user.strengths,
      weaknesses: req.user.weaknesses,
      applications: applications.map((application) => ({
        companyName: application.drive.companyName,
        role: application.drive.role,
        status: application.status,
        packageLpa: application.drive.packageLpa,
      })),
    },
  });
});

export const getHistoricalAnalytics = asyncHandler(async (_req, res) => {
  const yearly = await Application.aggregate([
    {
      $lookup: {
        from: 'drives',
        localField: 'drive',
        foreignField: '_id',
        as: 'drive',
      },
    },
    { $unwind: '$drive' },
    {
      $group: {
        _id: { $year: '$drive.driveDate' },
        total_placed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'selected'] }, 1, 0],
          },
        },
        highest_package: { $max: '$drive.packageLpa' },
        average_package: { $avg: '$drive.packageLpa' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const totalStudents = await User.countDocuments({ role: 'student' });
  const rows = yearly.map((item) => ({
    year_label: String(item._id),
    total_students: totalStudents,
    total_placed: item.total_placed,
    highest_package: Number(item.highest_package || 0),
    average_package: Number((item.average_package || 0).toFixed(2)),
  }));

  res.status(StatusCodes.OK).json({
    success: true,
    data: rows,
  });
});
