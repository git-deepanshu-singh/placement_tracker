import { google } from 'googleapis';

const getAuthClient = () => {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return null;
  }

  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/forms.body',
      'https://www.googleapis.com/auth/forms.responses.readonly',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
};

export const createDriveForm = async ({ drive, fields }) => {
  const auth = getAuthClient();

  if (!auth) {
    return {
      formId: `local-form-${drive._id}`,
      responderUri: `${process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173'}/drives/${drive._id}/apply`,
      editUri: null,
      fields,
    };
  }

  const forms = google.forms({ version: 'v1', auth });
  const created = await forms.forms.create({
    requestBody: {
      info: {
        title: `${drive.companyName} - ${drive.role}`,
        documentTitle: `Placement Form - ${drive.companyName}`,
      },
    },
  });

  const requests = [
    {
      updateFormInfo: {
        info: {
          description: `Drive for ${drive.companyName}. Deadline: ${new Date(drive.registrationDeadline).toLocaleString()}`,
        },
        updateMask: 'description',
      },
    },
    ...fields.map((field, index) => ({
      createItem: {
        item: {
          title: field,
          questionItem: {
            question: {
              required: true,
              textQuestion: {},
            },
          },
        },
        location: {
          index: index,
        },
      },
    })),
  ];

  await forms.forms.batchUpdate({
    formId: created.data.formId,
    requestBody: { requests },
  });

  return {
    formId: created.data.formId,
    responderUri: created.data.responderUri,
    editUri: created.data.linkedSheetId || null,
    fields,
  };
};
