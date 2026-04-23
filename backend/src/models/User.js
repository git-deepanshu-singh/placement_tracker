import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    rollNo: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    employeeId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    department: {
      type: String,
      trim: true,
    },
    batch: {
      type: String,
      trim: true,
    },
    academics: {
      tenthPercentage: { type: Number, default: 0 },
      twelfthPercentage: { type: Number, default: 0 },
      cgpa: { type: Number, default: 0 },
      semester: { type: Number, min: 1, max: 12 },
    },
    skills: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    placementReadinessScore: {
      type: Number,
      default: 0,
    },
    preferences: {
      notificationsEnabled: { type: Boolean, default: true },
      theme: { type: String, default: 'miet-light' },
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
