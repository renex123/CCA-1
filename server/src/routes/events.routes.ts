import { Router, Response } from 'express';
import { campusStore } from '../data/campusStore';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// 1. GET /api/events — List campus events & hackathons
router.get('/events', (req, res: Response) => {
  res.json({
    success: true,
    count: campusStore.events.length,
    events: campusStore.events,
  });
});

// 2. POST /api/events/:id/register — Register student for event
router.post('/events/:id/register', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const event = campusStore.events.find((e) => e.id === id);

  if (!event) {
    res.status(404).json({ success: false, error: 'Campus event not found.' });
    return;
  }

  const studentId = req.user?.id || 'usr-student-01';

  if (event.registeredStudents.includes(studentId)) {
    res.status(400).json({ success: false, error: 'You are already registered for this event.' });
    return;
  }

  event.registeredStudents.push(studentId);

  res.json({
    success: true,
    message: `Successfully registered for "${event.title}"! Entry confirmation has been logged.`,
    event,
  });
});

// 3. GET /api/facilities — Facility & Campus Directory
router.get('/facilities', (req, res: Response) => {
  const { category } = req.query;

  let list = campusStore.facilities;
  if (category) {
    list = list.filter((f) => f.category.toLowerCase() === (category as string).toLowerCase());
  }

  res.json({
    success: true,
    count: list.length,
    facilities: list,
  });
});

export default router;
