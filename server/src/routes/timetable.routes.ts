import { Router, Response } from 'express';
import { campusStore, TimetableClass } from '../data/campusStore';
import { ConflictEngine } from '../services/conflictEngine';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// 1. GET /api/timetable — Fetch schedule
router.get('/', (req, res: Response) => {
  const { day, department, semester, facultyId } = req.query;

  let list = campusStore.timetables;

  if (day) {
    list = list.filter((t) => t.day.toLowerCase() === (day as string).toLowerCase());
  }
  if (department) {
    list = list.filter((t) => t.department.toLowerCase().includes((department as string).toLowerCase()));
  }
  if (semester) {
    list = list.filter((t) => t.semester === parseInt(semester as string, 10));
  }
  if (facultyId) {
    list = list.filter((t) => t.facultyId === facultyId);
  }

  res.json({
    success: true,
    count: list.length,
    timetable: list,
  });
});

// 2. POST /api/timetable/check-conflict — Pre-commit conflict check
router.post('/check-conflict', (req, res: Response) => {
  const { id, day, startTime, endTime, classroom, facultyId, facultyName } = req.body;

  if (!day || !startTime || !endTime || !classroom) {
    res.status(400).json({ success: false, error: 'Day, startTime, endTime, and classroom are required.' });
    return;
  }

  const result = ConflictEngine.checkConflicts({
    id,
    day,
    startTime,
    endTime,
    classroom,
    facultyId: facultyId || 'usr-faculty-01',
    facultyName: facultyName || 'Assigned Faculty',
  });

  res.json({
    success: true,
    ...result,
  });
});

// 3. POST /api/timetable/reschedule — Reschedule class with conflict validation
router.post('/reschedule', authenticateToken, requireRole('faculty', 'admin'), (req, res: Response) => {
  const { id, newDay, newStartTime, newEndTime, newClassroom } = req.body;

  const targetClass = campusStore.timetables.find((t) => t.id === id);
  if (!targetClass) {
    res.status(404).json({ success: false, error: 'Timetable class not found.' });
    return;
  }

  // Conflict evaluation
  const conflictReport = ConflictEngine.checkConflicts({
    id: targetClass.id,
    day: newDay || targetClass.day,
    startTime: newStartTime || targetClass.startTime,
    endTime: newEndTime || targetClass.endTime,
    classroom: newClassroom || targetClass.classroom,
    facultyId: targetClass.facultyId,
    facultyName: targetClass.facultyName,
  });

  if (conflictReport.hasConflict) {
    res.status(409).json({
      success: false,
      error: 'Conflict detected! Cannot reschedule due to overlapping room or faculty schedule.',
      conflicts: conflictReport.conflicts,
    });
    return;
  }

  // Commit reschedule
  if (newDay) targetClass.day = newDay;
  if (newStartTime) targetClass.startTime = newStartTime;
  if (newEndTime) targetClass.endTime = newEndTime;
  if (newClassroom) targetClass.classroom = newClassroom;

  res.json({
    success: true,
    message: `Class for ${targetClass.subjectName} rescheduled to ${targetClass.day} ${targetClass.startTime}–${targetClass.endTime} in ${targetClass.classroom}.`,
    updatedClass: targetClass,
  });
});

// 4. POST /api/timetable — Add new class
router.post('/', authenticateToken, requireRole('admin'), (req, res: Response) => {
  const { day, startTime, endTime, subjectCode, subjectName, facultyId, facultyName, classroom, department, semester } = req.body;

  const conflictReport = ConflictEngine.checkConflicts({
    day,
    startTime,
    endTime,
    classroom,
    facultyId: facultyId || 'usr-faculty-01',
    facultyName: facultyName || 'Faculty',
  });

  if (conflictReport.hasConflict) {
    res.status(409).json({
      success: false,
      error: 'Conflict detected with existing schedule.',
      conflicts: conflictReport.conflicts,
    });
    return;
  }

  const newClass: TimetableClass = {
    id: `tt-${Date.now()}`,
    day,
    startTime,
    endTime,
    subjectCode,
    subjectName,
    facultyId: facultyId || 'usr-faculty-01',
    facultyName: facultyName || 'Faculty',
    classroom,
    department: department || 'Computer Science & Engineering',
    semester: semester || 6,
  };

  campusStore.timetables.push(newClass);

  res.status(201).json({
    success: true,
    message: 'New lecture timetable added successfully.',
    timetableClass: newClass,
  });
});

export default router;
