import User from '../models/User.js';

export const seedAdmin = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return;
  }

  const adminPayload = {
    role: 'admin',
    fullName: process.env.ADMIN_NAME || 'Placement Admin',
    email: process.env.ADMIN_EMAIL,
    mobile: process.env.ADMIN_PHONE || '9999999999',
    password: process.env.ADMIN_PASSWORD,
    employeeId: process.env.ADMIN_EMPLOYEE_ID || 'ADMIN001',
    status: 'active',
  };

  const existingAdmin = await User.findOne({
    $or: [{ email: process.env.ADMIN_EMAIL }, { role: 'admin' }],
  }).select('+password');

  if (!existingAdmin) {
    await User.create(adminPayload);
    console.log('Default admin seeded');
    return;
  }

  existingAdmin.role = 'admin';
  existingAdmin.fullName = adminPayload.fullName;
  existingAdmin.email = adminPayload.email;
  existingAdmin.mobile = adminPayload.mobile;
  existingAdmin.employeeId = adminPayload.employeeId;
  existingAdmin.status = 'active';
  existingAdmin.password = adminPayload.password;
  await existingAdmin.save();

  console.log('Default admin synced');
};
