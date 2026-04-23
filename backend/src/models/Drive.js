import mongoose from 'mongoose';

const driveSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    packageLpa: { type: Number, required: true },
    role: { type: String, required: true },
    eligibility: {
      departments: [{ type: String }],
      minTenthPercentage: { type: Number, default: 0 },
      minTwelfthPercentage: { type: Number, default: 0 },
      minCgpa: { type: Number, default: 0 },
      allowedBatches: [{ type: String }],
    },
    termsAndConditions: { type: String, required: true },
    jobDescription: { type: String, required: true },
    registrationDeadline: { type: Date, required: true },
    driveDate: { type: Date, required: true },
    venue: { type: String, required: true },
    registrationEnabled: { type: Boolean, default: true },
    googleForm: {
      formId: String,
      responderUri: String,
      editUri: String,
      fields: [{ type: String }],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

driveSchema.virtual('isClosed').get(function isClosed() {
  return !this.registrationEnabled || new Date(this.registrationDeadline) < new Date();
});

const Drive = mongoose.model('Drive', driveSchema);

export default Drive;
