import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getAllowedOrigins } from '../utils/env.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Unauthorized'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(socket.user.role);
    socket.join(`user:${socket.user.id}`);
  });
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }

  return io;
};
