import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'selected', 'rejected'],
      default: 'applied',
    },
    googleFormResponseId: String,
    formPayload: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

applicationSchema.index({ drive: 1, student: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
