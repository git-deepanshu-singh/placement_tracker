import { AppError } from './errorHandler.js';

export const validate = (schema, property = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next(new AppError(error.details.map((detail) => detail.message).join(', ')));
  }

  req[property] = value;
  next();
};
