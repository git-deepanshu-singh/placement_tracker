import Drive from '../models/Drive.js';
import User from '../models/User.js';
import { createAndDispatchNotification } from './notificationService.js';

export const scheduleDeadlineReminders = () => {
  setInterval(async () => {
    const upcoming = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const now = new Date();

    const drives = await Drive.find({
      registrationEnabled: true,
      registrationDeadline: { $gte: now, $lte: upcoming },
    });

    if (!drives.length) {
      return;
    }

    const admin = await User.findOne({ role: 'admin' });

    await Promise.all(
      drives.map((drive) =>
        createAndDispatchNotification({
          title: `Deadline approaching: ${drive.companyName}`,
          message: `Registration for ${drive.companyName} (${drive.role}) closes on ${new Date(drive.registrationDeadline).toLocaleString()}.`,
          audience: 'student',
          createdBy: admin?._id,
          type: 'deadline',
          emailSubject: `Reminder: ${drive.companyName} registration closes soon`,
        }),
      ),
    );
  }, 60 * 60 * 1000);
};
