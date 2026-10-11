import { Router, Response } from 'express';
import crypto from 'crypto';
import { campusStore, ServiceRequest } from '../data/campusStore';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// 1. GET /api/services/requests — List certificate applications
router.get('/requests', (req, res: Response) => {
  const { studentId, status } = req.query;

  let list = campusStore.serviceRequests;

  if (studentId) {
    list = list.filter((r) => r.studentId === studentId);
  }
  if (status) {
    list = list.filter((r) => r.status.toLowerCase() === (status as string).toLowerCase());
  }

  res.json({
    success: true,
    requests: list,
  });
});

// 2. POST /api/services/apply — Apply for official certificate
router.post('/apply', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { type, remarks } = req.body;

  if (!type) {
    res.status(400).json({ success: false, error: 'Certificate type is required.' });
    return;
  }

  const id = `REQ-2026-${Math.floor(100 + Math.random() * 900)}`;
  const newRequest: ServiceRequest = {
    id,
    type,
    studentId: req.user?.id || 'usr-student-01',
    studentName: req.user?.name || 'Aarav Sharma',
    rollNumber: req.user?.studentId || '23CSE104',
    department: req.user?.department || 'Computer Science & Engineering',
    status: 'Pending',
    appliedDate: new Date().toISOString().split('T')[0],
    remarks: remarks || 'Applied for official verification through student portal.',
  };

  campusStore.serviceRequests.unshift(newRequest);

  res.status(201).json({
    success: true,
    message: `Application submitted for ${type}. Assigned reference ID #${id}.`,
    request: newRequest,
  });
});

// 3. PATCH /api/services/requests/:id/approve — Admin approves with cryptographic QR verification
router.patch('/requests/:id/approve', authenticateToken, requireRole('admin'), (req, res: Response) => {
  const { id } = req.params;
  const request = campusStore.serviceRequests.find((r) => r.id === id);

  if (!request) {
    res.status(404).json({ success: false, error: 'Service request not found.' });
    return;
  }

  const certNumber = `BPUT-AUT-2026-BF-${Math.floor(10000 + Math.random() * 90000)}`;
  const hash = crypto.createHash('sha256').update(`${certNumber}:${request.rollNumber}`).digest('hex').substring(0, 16);
  const qrVerificationStamp = `https://campusone.edu/verify/${certNumber}?hash=${hash}`;

  request.status = 'Approved';
  request.certificateNumber = certNumber;
  request.qrVerificationStamp = qrVerificationStamp;
  request.approvedDate = new Date().toISOString().split('T')[0];

  res.json({
    success: true,
    message: `Certificate #${certNumber} generated and signed with cryptographic QR seal.`,
    request,
  });
});

// 4. GET /api/services/verify/:certNumber — Public verification endpoint
router.get('/verify/:certNumber', (req, res: Response) => {
  const { certNumber } = req.params;
  const found = campusStore.serviceRequests.find(
    (r) => r.certificateNumber?.toLowerCase() === certNumber.toLowerCase()
  );

  if (!found) {
    res.status(404).json({
      valid: false,
      message: 'Certificate not found in university central registry.',
    });
    return;
  }

  res.json({
    valid: true,
    status: 'AUTHENTIC_VERIFIED',
    certificateNumber: found.certificateNumber,
    studentName: found.studentName,
    rollNumber: found.rollNumber,
    department: found.department,
    certificateType: found.type,
    issuedDate: found.approvedDate,
    issuingAuthority: 'Dean Academic Affairs • BPUT Affiliated Autonomous Colleges',
  });
});

export default router;
