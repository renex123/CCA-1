import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { campusStore, UserRecord } from '../data/campusStore';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Sign JWT helper
const generateToken = (user: UserRecord): string => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      facultyId: user.facultyId,
      department: user.department,
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

// 1. POST /api/auth/login
router.post('/login', (req, res: Response) => {
  const { email, password, role } = req.body;

  if (!email) {
    res.status(400).json({ success: false, error: 'Email address is required.' });
    return;
  }

  // Lookup user by email (or match role for demo accounts)
  let user = campusStore.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user && role) {
    user = campusStore.users.find((u) => u.role === role);
  }

  if (!user) {
    // Auto-create a guest student account for smooth testing
    user = {
      id: `usr-student-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: (role === 'faculty' ? 'faculty' : 'student'),
      department: 'Computer Science & Engineering',
      studentId: `23CSE${Math.floor(100 + Math.random() * 900)}`,
    };
    campusStore.users.push(user);
  }

  const token = generateToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      facultyId: user.facultyId,
      department: user.department,
      semester: user.semester,
    },
  });
});

// 2. POST /api/auth/register
router.post('/register', (req, res: Response) => {
  const { name, email, role, department, studentId, facultyId } = req.body;

  if (!name || !email) {
    res.status(400).json({ success: false, error: 'Name and email are required.' });
    return;
  }

  // Enforce security rule from master prompt: Public registration must never allow self-assigned admin
  if (role === 'admin') {
    res.status(403).json({
      success: false,
      error: 'Security Policy Violation: Administrator accounts cannot be self-registered through the public portal.',
    });
    return;
  }

  const existing = campusStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ success: false, error: 'An account with this institutional email already exists.' });
    return;
  }

  const newUser: UserRecord = {
    id: `usr-${role || 'student'}-${Date.now()}`,
    name,
    email,
    role: role === 'faculty' ? 'faculty' : 'student',
    department: department || 'Engineering & Technology',
    studentId: role === 'faculty' ? undefined : (studentId || `23ENG${Math.floor(100 + Math.random() * 900)}`),
    facultyId: role === 'faculty' ? (facultyId || `FAC-${Math.floor(100 + Math.random() * 900)}`) : undefined,
  };

  campusStore.users.push(newUser);
  const token = generateToken(newUser);

  res.status(201).json({
    success: true,
    token,
    user: newUser,
  });
});

// 3. GET /api/auth/me
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// 4. POST /api/auth/demo-switch (Hackathon Judge instant persona switcher)
router.post('/demo-switch', (req, res: Response) => {
  const { role } = req.body;
  if (!['student', 'faculty', 'admin'].includes(role)) {
    res.status(400).json({ success: false, error: 'Valid role must be student, faculty, or admin.' });
    return;
  }

  const demoUser = campusStore.users.find((u) => u.role === role) || campusStore.users[0];
  const token = generateToken(demoUser);

  res.json({
    success: true,
    token,
    user: demoUser,
  });
});

export default router;
