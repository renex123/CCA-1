import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
  studentId?: string;
  facultyId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Also support demo/mock fallback header for convenience during hackathon judging
  const demoRole = req.headers['x-demo-role'] as string | undefined;

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(403).json({ success: false, error: 'Invalid or expired authentication token.' });
        return;
      }
      req.user = decoded as AuthUser;
      next();
    });
    return;
  }

  if (demoRole && ['student', 'faculty', 'admin'].includes(demoRole)) {
    // Generate default judge persona
    if (demoRole === 'student') {
      req.user = { id: 'usr-student-01', name: 'Aarav Sharma', email: 'aarav.sharma@campusone.edu', role: 'student', studentId: '23CSE104', department: 'Computer Science' };
    } else if (demoRole === 'faculty') {
      req.user = { id: 'usr-faculty-01', name: 'Dr. Priya Sengupta', email: 'priya.sengupta@campusone.edu', role: 'faculty', facultyId: 'FAC-CS-042', department: 'Computer Science' };
    } else {
      req.user = { id: 'usr-admin-01', name: 'Dr. Rajesh Verma', email: 'dean.admin@campusone.edu', role: 'admin', department: 'Dean Academic Affairs' };
    }
    next();
    return;
  }

  res.status(401).json({ success: false, error: 'Access token required. Please sign in.' });
};

export const requireRole = (...allowedRoles: ('student' | 'faculty' | 'admin')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Unauthorized. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
};
