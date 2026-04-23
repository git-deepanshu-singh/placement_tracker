import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getIo } from '../config/socket.js';
import { sendEmail } from './mailer.js';

export const createAndDispatchNotification = async ({
  title,
  message,
  audience,
  recipientIds = [],
  createdBy,
  type = 'system',
  emailSubject,
}) => {
  const notification = await Notification.create({
    title,
    message,
    audience,
    recipientIds,
    createdBy,
    type,
  });

  const io = getIo();
  const recipients =
    audience === 'custom'
      ? await User.find({ _id: { $in: recipientIds }, 'preferences.notificationsEnabled': true })
      : await User.find({ role: audience === 'all' ? { $in: ['admin', 'faculty', 'student'] } : audience, 'preferences.notificationsEnabled': true });

  recipients.forEach((user) => {
    io.to(`user:${user._id}`).emit('notification:new', notification);
  });

  await Promise.all(
    recipients.map((user) =>
      sendEmail({
        to: user.email,
        subject: emailSubject || title,
        html: `<p>${message}</p>`,
      }),
    ),
  );

  return notification;
};
