import { StatusCodes } from 'http-status-codes';

import FormResponse from '../models/FormResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getFormResponses = asyncHandler(async (req, res) => {
  const responses = await FormResponse.find({ drive: req.params.driveId }).sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    data: responses,
  });
});
