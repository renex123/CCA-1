import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import attendanceRoutes from './routes/attendance.routes';
import timetableRoutes from './routes/timetable.routes';
import complaintsRoutes from './routes/complaints.routes';
import servicesRoutes from './routes/services.routes';
import eventsRoutes from './routes/events.routes';
import analyticsRoutes from './routes/analytics.routes';
import aiRoutes from './routes/ai.routes';
import { campusStore } from './data/campusStore';

const app = express();

// Middlewares
app.use(cors({
  origin: true, // Allow frontend origin
  credentials: true,
}));
app.use(express.json());

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'CampusOne Smart Campus Backend Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      registeredUsers: campusStore.users.length,
      activeAttendanceSessions: campusStore.sessions.filter((s) => s.status === 'active').length,
      scheduledClasses: campusStore.timetables.length,
      activeComplaints: campusStore.complaints.length,
      serviceRequests: campusStore.serviceRequests.length,
      campusEvents: campusStore.events.length,
    },
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api', eventsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER ERROR]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start Server
app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🚀 CampusOne REST API Server running on port ${config.port}`);
  console.log(`📡 Local Health Check: http://localhost:${config.port}/api/health`);
  console.log(`⚡ Connected to In-Memory & Persistent Campus Store`);
  console.log(`====================================================`);
});

export default app;
