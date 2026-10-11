import { Router, Response } from 'express';
import { campusStore, ComplaintRecord } from '../data/campusStore';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// 1. GET /api/complaints — Fetch grievances
router.get('/', (req, res: Response) => {
  const { status, urgency, category, studentId } = req.query;

  let list = campusStore.complaints;

  if (status) {
    list = list.filter((c) => c.status.toLowerCase() === (status as string).toLowerCase());
  }
  if (urgency) {
    list = list.filter((c) => c.urgency.toLowerCase() === (urgency as string).toLowerCase());
  }
  if (category) {
    list = list.filter((c) => c.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (studentId) {
    list = list.filter((c) => c.studentId === studentId);
  }

  res.json({
    success: true,
    count: list.length,
    complaints: list,
  });
});

// 2. POST /api/complaints — Student lodges grievance
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { title, category, location, description, urgency } = req.body;

  if (!title || !description || !location) {
    res.status(400).json({ success: false, error: 'Title, location, and description are required.' });
    return;
  }

  const id = `CMP-2026-${Math.floor(100 + Math.random() * 900)}`;
  const newComplaint: ComplaintRecord = {
    id,
    title,
    category: category || 'Classroom',
    location,
    description,
    status: 'Pending',
    urgency: urgency || 'Medium',
    studentId: req.user?.id || 'usr-student-01',
    studentName: req.user?.name || 'Aarav Sharma',
    slaDeadline: urgency === 'Emergency' ? 'Within 2 Hours' : urgency === 'High' ? 'Within 24 Hours' : 'Within 48 Hours',
    createdAt: new Date().toISOString(),
  };

  campusStore.complaints.unshift(newComplaint);

  res.status(201).json({
    success: true,
    message: `Grievance ticket #${id} registered. Dispatched to campus facilities SLA queue.`,
    complaint: newComplaint,
  });
});

// 3. PATCH /api/complaints/:id/assign — Assign technician and SLA
router.patch('/:id/assign', authenticateToken, requireRole('admin'), (req, res: Response) => {
  const { id } = req.params;
  const { technician, slaDeadline } = req.body;

  const complaint = campusStore.complaints.find((c) => c.id === id);
  if (!complaint) {
    res.status(404).json({ success: false, error: 'Complaint ticket not found.' });
    return;
  }

  complaint.assignedTechnician = technician || 'Campus Infrastructure Team';
  if (slaDeadline) complaint.slaDeadline = slaDeadline;
  complaint.status = 'In Progress';

  res.json({
    success: true,
    message: `Ticket #${id} assigned to ${complaint.assignedTechnician}.`,
    complaint,
  });
});

// 4. PATCH /api/complaints/:id/status — Update ticket status
router.patch('/:id/status', authenticateToken, requireRole('admin', 'faculty'), (req, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Pending', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
    res.status(400).json({ success: false, error: 'Invalid status value.' });
    return;
  }

  const complaint = campusStore.complaints.find((c) => c.id === id);
  if (!complaint) {
    res.status(404).json({ success: false, error: 'Complaint ticket not found.' });
    return;
  }

  complaint.status = status;
  if (status === 'Resolved' || status === 'Closed') {
    complaint.resolvedAt = new Date().toISOString();
  }

  res.json({
    success: true,
    message: `Ticket #${id} updated to ${status}.`,
    complaint,
  });
});

export default router;
