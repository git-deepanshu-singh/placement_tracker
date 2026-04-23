import Joi from 'joi';

export const createDriveSchema = Joi.object({
  companyName: Joi.string().required(),
  packageLpa: Joi.number().min(0).required(),
  role: Joi.string().required(),
  eligibility: Joi.object({
    departments: Joi.array().items(Joi.string()).default([]),
    minTenthPercentage: Joi.number().min(0).max(100).default(0),
    minTwelfthPercentage: Joi.number().min(0).max(100).default(0),
    minCgpa: Joi.number().min(0).max(10).default(0),
    allowedBatches: Joi.array().items(Joi.string()).default([]),
  }).required(),
  termsAndConditions: Joi.string().required(),
  jobDescription: Joi.string().required(),
  registrationDeadline: Joi.date().iso().required(),
  driveDate: Joi.date().iso().required(),
  venue: Joi.string().required(),
  registrationEnabled: Joi.boolean().default(true),
  googleFormFields: Joi.array().items(Joi.string()).default([]),
});

export const applyDriveSchema = Joi.object({
  formPayload: Joi.object().required(),
});

export const notificationSchema = Joi.object({
  title: Joi.string().required(),
  message: Joi.string().required(),
  audience: Joi.string().valid('all', 'admin', 'faculty', 'student', 'custom').required(),
  recipientIds: Joi.array().items(Joi.string()).default([]),
  type: Joi.string().valid('system', 'drive', 'deadline', 'announcement').default('system'),
});
