import { Router, Response } from 'express';
import { campusStore, AttendanceSession } from '../data/campusStore';
import { QREngine } from '../services/qrEngine';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// 1. POST /api/attendance/sessions — Faculty initiates live attendance session
router.post('/sessions', authenticateToken, requireRole('faculty', 'admin'), (req: AuthenticatedRequest, res: Response) => {
  const { subjectCode, subjectName, classroom, durationMinutes = 15 } = req.body;

  if (!subjectCode || !classroom) {
    res.status(400).json({ success: false, error: 'Subject code and classroom are required.' });
    return;
  }

  const sessionId = `sess-${Date.now()}`;
  const pin = QREngine.generateSessionPin();
  const expiryMs = (durationMinutes || 15) * 60 * 1000;
  const token = QREngine.generateQRToken(sessionId, subjectCode, expiryMs);
  const expiresAt = new Date(Date.now() + expiryMs).toISOString();

  const newSession: AttendanceSession = {
    id: sessionId,
    subjectCode,
    subjectName: subjectName || 'Design & Analysis of Algorithms',
    facultyId: req.user?.id || 'usr-faculty-01',
    facultyName: req.user?.name || 'Dr. Priya Sengupta',
    classroom,
    pin,
    token,
    expiresAt,
    status: 'active',
    createdAt: new Date().toISOString(),
    attendanceCount: 0,
  };

  campusStore.sessions.unshift(newSession);

  res.status(201).json({
    success: true,
    message: `Attendance session opened for ${classroom}. Active for ${durationMinutes} minutes.`,
    session: newSession,
    qrPayload: token,
  });
});

// 2. GET /api/attendance/sessions/active — List active sessions
router.get('/sessions/active', (req, res: Response) => {
  const now = Date.now();
  // Filter active and non-expired sessions
  const active = campusStore.sessions.filter(
    (s) => s.status === 'active' && new Date(s.expiresAt).getTime() > now
  );

  res.json({
    success: true,
    sessions: active,
  });
});

// 3. POST /api/attendance/check-in — Student checks in via QR token or PIN
router.post('/check-in', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { token, pin, method = 'qr_scan' } = req.body;

  const tokenOrPin = method === 'pin_entry' ? pin : (token || pin);

  if (!tokenOrPin) {
    res.status(400).json({ success: false, error: 'Session QR token or 6-digit PIN is required.' });
    return;
  }

  const studentId = req.user?.id || 'usr-student-01';
  const studentName = req.user?.name || 'Aarav Sharma';

  const result = QREngine.verifyAndCheckIn({
    tokenOrPin,
    studentId,
    studentName,
    method: method === 'pin_entry' ? 'pin_entry' : 'qr_scan',
  });

  if (!result.success) {
    res.status(400).json(result);
    return;
  }

  res.json(result);
});

// 4. GET /api/attendance/student/:studentId — Subject-wise attendance calculation
router.get('/student/:studentId', (req, res: Response) => {
  const { studentId } = req.params;

  const studentRecords = campusStore.attendanceRecords.filter(
    (r) => r.studentId === studentId || studentId === 'me'
  );

  // Calculate subject-wise percentages
  const subjects = [
    { code: 'CS601', name: 'Design & Analysis of Algorithms', totalClasses: 36, attended: 32 },
    { code: 'CS602', name: 'Compiler Design', totalClasses: 34, attended: 29 },
    { code: 'CS603', name: 'Cloud Computing & Distributed Systems', totalClasses: 30, attended: 27 },
    { code: 'CS604', name: 'Machine Learning Foundations', totalClasses: 28, attended: 26 },
  ];

  const subjectStats = subjects.map((sub) => {
    // Add real session records from current run
    const sessionAttended = studentRecords.filter((r) => r.subjectCode === sub.code).length;
    const currentAttended = Math.min(sub.totalClasses, sub.attended + sessionAttended);
    const percentage = Math.round((currentAttended / sub.totalClasses) * 100);

    return {
      ...sub,
      attended: currentAttended,
      percentage,
      isLowAttendance: percentage < 75,
    };
  });

  const totalClasses = subjectStats.reduce((acc, s) => acc + s.totalClasses, 0);
  const totalAttended = subjectStats.reduce((acc, s) => acc + s.attended, 0);
  const overallPercentage = Math.round((totalAttended / totalClasses) * 100);

  res.json({
    success: true,
    overallPercentage,
    minimumRequired: 75,
    isEligibleForExams: overallPercentage >= 75,
    subjectStats,
    recentCheckIns: studentRecords.slice(-5).reverse(),
  });
});

// 5. GET /api/attendance/roster/:sessionId — Faculty views students checked in
router.get('/roster/:sessionId', authenticateToken, (req, res: Response) => {
  const { sessionId } = req.params;
  const records = campusStore.attendanceRecords.filter((r) => r.sessionId === sessionId);

  res.json({
    success: true,
    sessionId,
    totalCheckedIn: records.length,
    students: records,
  });
});

// 6. PATCH /api/attendance/sessions/:sessionId/close — Faculty closes session
router.patch('/sessions/:sessionId/close', authenticateToken, requireRole('faculty', 'admin'), (req, res: Response) => {
  const { sessionId } = req.params;
  const session = campusStore.sessions.find((s) => s.id === sessionId);

  if (!session) {
    res.status(404).json({ success: false, error: 'Session not found.' });
    return;
  }

  session.status = 'closed';

  res.json({
    success: true,
    message: `Attendance session for ${session.classroom} has been closed.`,
    session,
  });
});

export default router;
