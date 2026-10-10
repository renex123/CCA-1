import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import { TimetableEntry, Subject, Classroom, UserProfile } from '../types';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Plus,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export const TimetablePage: React.FC = () => {
  const { user, role } = useAuth();
  const [, setTick] = useState(0);

  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday default
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  // Form states for reschedule
  const [formDay, setFormDay] = useState<number>(1);
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('10:00');
  const [formSubjectId, setFormSubjectId] = useState('sub-cs601');
  const [formClassroomId, setFormClassroomId] = useState('room-lh-204');
  const [formFacultyId, setFormFacultyId] = useState('u-fac-1');
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  if (!user) return null;

  const timetable = db.getTimetable();
  const subjects = db.getSubjects();
  const classrooms = db.getClassrooms();
  const facultyUsers = db.getUsers().filter((u) => u.role === 'faculty');

  const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
  ];

  // Filter entries for selected day
  const dayEntries = timetable
    .filter((t) => t.day_of_week === selectedDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const handleOpenEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormDay(entry.day_of_week);
    setFormStartTime(entry.start_time);
    setFormEndTime(entry.end_time);
    setFormSubjectId(entry.subject_id);
    setFormClassroomId(entry.classroom_id);
    setFormFacultyId(entry.faculty_id);
    setConflictMessage(null);
    setIsRescheduleModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingEntry(null);
    setFormDay(selectedDay);
    setFormStartTime('11:00');
    setFormEndTime('12:00');
    setFormSubjectId(subjects[0]?.id || 'sub-cs601');
    setFormClassroomId(classrooms[0]?.id || 'room-lh-204');
    setFormFacultyId(facultyUsers[0]?.id || 'u-fac-1');
    setConflictMessage(null);
    setIsRescheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    // Validate conflict
    const conflictCheck = db.checkTimetableConflict(
      formDay,
      formStartTime,
      formEndTime,
      formClassroomId,
      formFacultyId,
      editingEntry?.id
    );

    if (conflictCheck.hasConflict) {
      setConflictMessage(conflictCheck.reason || 'Conflict detected!');
      return;
    }

    const subject = subjects.find((s) => s.id === formSubjectId) || subjects[0];
    const classroom = classrooms.find((c) => c.id === formClassroomId) || classrooms[0];
    const faculty = facultyUsers.find((f) => f.id === formFacultyId) || facultyUsers[0];
    const dayObj = days.find((d) => d.id === formDay) || days[0];

    const entryToSave: TimetableEntry = {
      id: editingEntry ? editingEntry.id : `tt-${Date.now()}`,
      day_of_week: formDay as 1 | 2 | 3 | 4 | 5 | 6,
      day_name: dayObj.name,
      start_time: formStartTime,
      end_time: formEndTime,
      subject_id: subject.id,
      subject_name: subject.name,
      subject_code: subject.code,
      faculty_id: faculty.id,
      faculty_name: faculty.full_name,
      classroom_id: classroom.id,
      room_number: classroom.room_number,
      building: classroom.building,
      semester: 6,
      section: 'A',
      status: editingEntry ? 'rescheduled' : 'scheduled',
    };

    db.updateTimetableEntry(entryToSave, user);
    setIsRescheduleModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Class Schedule & Timetable
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated conflict engine • Room allocation • Live notifications on change
          </p>
        </div>

        {role === 'admin' && (
          <Button onClick={handleOpenNew} leftIcon={<Plus className="w-4 h-4" />}>
            Schedule / Reschedule Class
          </Button>
        )}
      </div>

      {/* Day Selector Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((day) => {
          const isSelected = selectedDay === day.id;
          const count = timetable.filter((t) => t.day_of_week === day.id).length;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{day.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timetable Class Schedule Grid */}
      <div className="space-y-4">
        {dayEntries.length === 0 ? (
          <Card className="p-12 text-center bg-slate-50 dark:bg-slate-900/40 border-dashed">
            <CalendarDays className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No classes scheduled for {days.find((d) => d.id === selectedDay)?.name}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Check other days of the week or contact the academic timetable coordinator.
            </p>
          </Card>
        ) : (
          dayEntries.map((entry) => (
            <Card
              key={entry.id}
              className={`transition-all hover:border-indigo-400 dark:hover:border-indigo-600 ${
                entry.status === 'rescheduled'
                  ? 'border-l-4 border-l-amber-500'
                  : entry.status === 'cancelled'
                  ? 'border-l-4 border-l-rose-500 opacity-60'
                  : 'border-l-4 border-l-indigo-600'
              }`}
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-center shrink-0 min-w-[90px]">
                    <span className="text-xs font-mono font-bold block">{entry.start_time}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">to {entry.end_time}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {entry.subject_code}
                      </span>
                      {entry.status === 'rescheduled' && (
                        <Badge variant="warning" size="sm">Rescheduled Room</Badge>
                      )}
                      {entry.status === 'cancelled' && (
                        <Badge variant="destructive" size="sm">Cancelled</Badge>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {entry.subject_name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <span className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {entry.faculty_name}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        {entry.room_number} • {entry.building}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Semester {entry.semester} (Sec {entry.section})
                      </span>
                    </div>
                  </div>
                </div>

                {role === 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(entry)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    Reschedule
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Admin Reschedule Modal with Conflict Checker */}
      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        title={editingEntry ? `Reschedule: ${editingEntry.subject_name}` : 'Schedule New Class Session'}
        description="Select room and faculty. The system will automatically check for double-booking conflicts."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsRescheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveSchedule} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Save & Notify Students
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {conflictMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in shake">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong>Scheduling Conflict Detected:</strong>
                <p className="mt-0.5">{conflictMessage}</p>
              </div>
            </div>
          )}

          <Select
            label="Day of Week"
            value={formDay}
            onChange={(e) => setFormDay(Number(e.target.value))}
          >
            {days.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time (24h)"
              value={formStartTime}
              onChange={(e) => setFormStartTime(e.target.value)}
              placeholder="09:00"
            />
            <Input
              label="End Time (24h)"
              value={formEndTime}
              onChange={(e) => setFormEndTime(e.target.value)}
              placeholder="10:00"
            />
          </div>

          <Select
            label="Course / Subject"
            value={formSubjectId}
            onChange={(e) => setFormSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </Select>

          <Select
            label="Classroom Allocation"
            value={formClassroomId}
            onChange={(e) => setFormClassroomId(e.target.value)}
          >
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.room_number} — {c.building} (Seats: {c.capacity})
              </option>
            ))}
          </Select>

          <Select
            label="Assigned Faculty"
            value={formFacultyId}
            onChange={(e) => setFormFacultyId(e.target.value)}
          >
            {facultyUsers.map((f) => (
              <option key={f.id} value={f.id}>
                {f.full_name} ({f.email})
              </option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};
