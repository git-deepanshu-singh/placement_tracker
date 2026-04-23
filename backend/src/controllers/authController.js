import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';

import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/mailer.js';
import { calculateReadiness } from '../utils/readiness.js';
import { signToken } from '../utils/token.js';
import { AppError } from '../middleware/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });

  if (existing) {
    throw new AppError('User already exists');
  }

  const payload = { ...req.body };

  // ✅ ROLE-BASED FIELD CONTROL

  if (payload.role === 'student') {
    // Student should NOT have employeeId
    payload.employeeId = undefined;

    // Ensure required student fields
    if (!payload.rollNo || !payload.department || !payload.batch) {
      throw new AppError('Missing student required fields');
    }

  } else if (payload.role === 'faculty' || payload.role === 'admin') {
    // Faculty/Admin should NOT have student fields
    payload.rollNo = undefined;
    payload.department = undefined;
    payload.batch = undefined;
    payload.academics = undefined;

    // Require employeeId
    if (!payload.employeeId) {
      throw new AppError('Employee ID is required');
    }
  }

  // ❌ REMOVE REJECTION LOGIC (IMPORTANT)
  // (No CGPA/backlog restriction)

  const user = await User.create(payload);

  // ✅ Only calculate readiness for students
  if (user.role === 'student') {
    user.placementReadinessScore = calculateReadiness(user);
    await user.save();
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: {
      token: signToken(user),
      user,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');

  if (!user) {
    throw new AppError('No account found with this email address.', StatusCodes.UNAUTHORIZED);
  }

  if (user.status === 'inactive') {
    throw new AppError('Your account is deactivated by admin. Please contact the placement cell.', StatusCodes.FORBIDDEN);
  }

  if (user.status === 'blocked') {
    throw new AppError('Your account is blocked by admin. Please contact the placement cell.', StatusCodes.FORBIDDEN);
  }

  if (!(await user.comparePassword(req.body.password))) {
    throw new AppError('Wrong password. Please try again.', StatusCodes.UNAUTHORIZED);
  }

  const token = signToken(user);
  user.password = undefined;

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      token,
      user,
    },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new AppError('No account found with this email address.', StatusCodes.NOT_FOUND);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const frontendBaseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${frontendBaseUrl}/login?resetToken=${resetToken}&email=${encodeURIComponent(user.email)}`;

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: 'Reset your placement tracker password',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #12343B;">
        <h2 style="margin-bottom: 12px;">Password reset request</h2>
        <p>We received a request to reset your password for the placement tracker account.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 18px; background: #0F766E; color: white; text-decoration: none; border-radius: 10px;">
            Reset password
          </a>
        </p>
        <p>This link will expire in 30 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Password reset link sent successfully. Please check your email.',
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+password');

  if (!user) {
    throw new AppError('This reset link is invalid or has expired.', StatusCodes.BAD_REQUEST);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Password reset successfully. You can now log in with your new password.',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: req.user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  Object.assign(user, req.body);

  // ✅ Only recalculate for students
  if (user.role === 'student') {
    user.placementReadinessScore = calculateReadiness(user);
  }

  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
  });
});
