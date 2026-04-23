import ExcelJS from 'exceljs';

export const buildApplicationsWorkbook = async (applications) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Registered Students');

  worksheet.columns = [
    { header: 'Student Name', key: 'fullName', width: 28 },
    { header: 'Roll No', key: 'rollNo', width: 18 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Mobile', key: 'mobile', width: 18 },
    { header: 'Department', key: 'department', width: 18 },
    { header: 'CGPA', key: 'cgpa', width: 12 },
    { header: 'Status', key: 'status', width: 16 },
  ];

  applications.forEach((application) => {
    worksheet.addRow({
      fullName: application.student.fullName,
      rollNo: application.student.rollNo,
      email: application.student.email,
      mobile: application.student.mobile,
      department: application.student.department,
      cgpa: application.student.academics?.cgpa || 0,
      status: application.status,
    });
  });

  return workbook.xlsx.writeBuffer();
};
