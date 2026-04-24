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
  try {
    console.log("🚀 Starting server...");

    console.log("🔌 Connecting Mongo...");
    await connectMongo();

    console.log("👤 Seeding admin...");
    await seedAdmin();

    console.log("⏰ Starting scheduler...");
    scheduleDeadlineReminders();

    server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});