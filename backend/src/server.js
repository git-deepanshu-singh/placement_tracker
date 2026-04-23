import http from 'http';
import dotenv from 'dotenv';

import app from './app.js';
import { connectMongo } from './config/mongo.js';
import { initializeSocket } from './config/socket.js';
import { seedAdmin } from './utils/seedAdmin.js';
import { scheduleDeadlineReminders } from './utils/scheduler.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initializeSocket(server);

const startServer = async () => {
  await connectMongo();
  await seedAdmin();
  scheduleDeadlineReminders();

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
