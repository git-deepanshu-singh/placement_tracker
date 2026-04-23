import Joi from 'joi';

export const registerSchema = Joi.object({
  role: Joi.string().valid('student', 'faculty').required(),
  fullName: Joi.string().min(3).required(),
  rollNo: Joi.string().allow('', null),
  employeeId: Joi.string().allow('', null),
  email: Joi.string().email().required(),
  mobile: Joi.string().min(10).max(15).required(),
  password: Joi.string().min(8).required(),
  department: Joi.string().allow('', null),
  batch: Joi.string().allow('', null),
  academics: Joi.object({
    tenthPercentage: Joi.number().min(0).max(100).default(0),
    twelfthPercentage: Joi.number().min(0).max(100).default(0),
    cgpa: Joi.number().min(0).max(10).default(0),
    semester: Joi.number().integer().min(1).max(12).allow(null),
  }).default({}),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(3),
  mobile: Joi.string().min(10).max(15),
  department: Joi.string().allow('', null),
  batch: Joi.string().allow('', null),
  skills: Joi.array().items(Joi.string()),
  strengths: Joi.array().items(Joi.string()),
  weaknesses: Joi.array().items(Joi.string()),
  preferences: Joi.object({
    notificationsEnabled: Joi.boolean(),
    theme: Joi.string(),
  }),
  academics: Joi.object({
    tenthPercentage: Joi.number().min(0).max(100),
    twelfthPercentage: Joi.number().min(0).max(100),
    cgpa: Joi.number().min(0).max(10),
    semester: Joi.number().integer().min(1).max(12).allow(null),
  }),
});
