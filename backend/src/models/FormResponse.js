import mongoose from 'mongoose';

const formResponseSchema = new mongoose.Schema(
  {
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    googleFormId: String,
    responseData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    exportedAt: Date,
  },
  { timestamps: true },
);

const FormResponse = mongoose.model('FormResponse', formResponseSchema);

export default FormResponse;
