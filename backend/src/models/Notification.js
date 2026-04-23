import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: {
      type: String,
      enum: ['all', 'admin', 'faculty', 'student', 'custom'],
      default: 'all',
    },
    recipientIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    type: {
      type: String,
      enum: ['system', 'drive', 'deadline', 'announcement'],
      default: 'system',
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
