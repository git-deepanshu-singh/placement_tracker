const DEFAULT_LOCAL_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

const splitEnvList = (value) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const getAllowedOrigins = () => {
  const configuredOrigins = splitEnvList(process.env.CLIENT_URL);
  return configuredOrigins.length ? configuredOrigins : DEFAULT_LOCAL_ORIGINS;
};

export const getPrimaryFrontendUrl = () => {
  const [primaryOrigin] = getAllowedOrigins();
  return process.env.FRONTEND_URL?.trim() || primaryOrigin;
};

export const isSmtpConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
