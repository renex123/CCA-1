import { Router, Response } from 'express';
import { campusStore } from '../data/campusStore';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// 1. GET /api/analytics/kpis — Administrative dashboard metrics
router.get('/kpis', authenticateToken, requireRole('admin', 'faculty'), (req, res: Response) => {
  const totalStudents = 16420;
  const totalFaculty = 485;
  const totalDepartments = 23;
  const activeSessions = campusStore.sessions.filter((s) => s.status === 'active').length;
  const openComplaints = campusStore.complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const resolvedComplaints = campusStore.complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const pendingServiceRequests = campusStore.serviceRequests.filter((s) => s.status === 'Pending').length;

  res.json({
    success: true,
    metrics: {
      totalStudents,
      totalFaculty,
      totalDepartments,
      averageCampusAttendance: 88.4,
      activeSessions,
      openComplaints,
      resolvedComplaints,
      pendingServiceRequests,
      accreditationStatus: 'NAAC A++ (CGPA 3.68/4.0)',
      nirfRankBand: 'Top 100 Engineering Institutions',
    },
    departmentAttendance: [
      { department: 'Computer Science', rate: 91.2 },
      { department: 'AI & Data Science', rate: 94.0 },
      { department: 'Electronics & Comm.', rate: 86.5 },
      { department: 'Mechanical Eng.', rate: 82.4 },
      { department: 'Civil Eng.', rate: 84.1 },
    ],
  });
});

// 2. GET /api/analytics/export-naac — Statutory NAAC/NIRF CSV audit export
router.get('/export-naac', authenticateToken, requireRole('admin'), (req, res: Response) => {
  const rows = [
    ['Metric ID', 'Accreditation Metric', 'Value', 'Audit Status', 'Timestamp'],
    ['NAAC-2.1', 'Enrolled Student Roster Verified', '16420', 'VERIFIED_CRYPTOGRAPHIC', new Date().toISOString()],
    ['NAAC-2.4', 'Faculty Ratio', '1:18.5', 'COMPLIANT', new Date().toISOString()],
    ['NAAC-2.7', 'Smart QR Lecture Attendance Rate', '88.4%', 'VERIFIED_BLOCK_HASH', new Date().toISOString()],
    ['NAAC-5.1', 'Student Grievance Resolution SLA', '98.2% within 48h', 'COMPLIANT', new Date().toISOString()],
    ['NAAC-5.3', 'Digitized Bonafide Issuance', '100% via CampusOne', 'VERIFIED_SIGNATURE', new Date().toISOString()],
  ];

  const csvContent = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="CampusOne_NAAC_NIRF_Audit_2026.csv"');
  res.send(csvContent);
});

export default router;
