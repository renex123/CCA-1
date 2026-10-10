import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import { AttendanceSession, TimetableEntry, Subject, Classroom } from '../types';
import { Link } from 'react-router-dom';
import {
  Users,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Play,
  StopCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { QRCodeSVG } from 'qrcode.react';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [, setTick] = useState(0);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-cs601');
  const [selectedClassroomId, setSelectedClassroomId] = useState('room-lh-204');
  const [duration, setDuration] = useState('15');

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  if (!user) return null;

  const subjects: Subject[] = db.getSubjects().filter((s) => s.faculty_id === user.id || s.faculty_name?.includes('Priya'));
  const classrooms: Classroom[] = db.getClassrooms();
  const timetable: TimetableEntry[] = db.getTimetable().filter((t) => t.faculty_id === user.id || t.faculty_name?.includes('Priya'));
  const sessions: AttendanceSession[] = db.getAttendanceSessions().filter((s) => s.faculty_id === user.id);
  const activeSession = sessions.find((s) => s.is_active);

  const handleCreateSession = () => {
    db.createAttendanceSession(
      user,
      selectedSubjectId,
      selectedClassroomId,
      parseInt(duration, 10),
      'A',
      6
    );
    setIsLaunchModalOpen(false);
  };

  const handleEndSession = (id: string) => {
    db.closeAttendanceSession(id, user);
  };

  return (
    <div className="space-y-6">
      {/* Faculty Profile Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Department of {user.department_name}
            </span>
            <span className="text-[10px] font-semibold text-slate-500">
              Associate Professor & Head of Examination Cell
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[10px] font-mono text-slate-500">
              Faculty Code: <strong className="text-slate-900 dark:text-slate-100">{user.faculty_id || 'FAC-CSE-04'}</strong>
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {user.full_name}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Teaching Allocation: 2 Active Lecture Courses, 1 Laboratory Section • 3 Sessions Scheduled Today
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsLaunchModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            Launch QR Attendance Session
          </button>
          <Link to="/announcements">
            <button className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer">
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              Publish Circular
            </button>
          </Link>
        </div>
      </div>

      {/* Active Session Live Alert Card (if any) */}
      {activeSession && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-indigo-950/40 dark:to-emerald-950/40 border-2 border-indigo-400 dark:border-indigo-600 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200">
              <QRCodeSVG value={activeSession.qr_token} size={84} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase animate-pulse">
                  ● Live Session Active
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  PIN: {activeSession.session_code}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                {activeSession.subject_name} ({activeSession.subject_code})
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Classroom: {activeSession.room_number} • Section {activeSession.section}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {activeSession.marked_count} / {activeSession.total_enrolled}
              </span>
              <p className="text-[10px] uppercase font-bold text-slate-400">Students Checked In</p>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleEndSession(activeSession.id)}
              leftIcon={<StopCircle className="w-4 h-4" />}
            >
              End Session
            </Button>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Teaching Load"
          value={`${subjects.length} Courses`}
          subtitle="CSE Semester 6 (Sections A & B)"
          icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
        />

        <StatCard
          title="Today's Classes"
          value={`${timetable.length} Lectures`}
          subtitle="LH-204 & CS-LAB-302"
          icon={<Clock className="w-5 h-5 text-sky-600" />}
        />

        <StatCard
          title="Attendance Sessions"
          value={sessions.length}
          subtitle={`${sessions.filter((s) => s.is_active).length} currently active`}
          icon={<QrCode className="w-5 h-5 text-emerald-600" />}
        />

        <StatCard
          title="Average Turnout"
          value="91.4%"
          change="+3.2% vs last week"
          isPositive={true}
          icon={<CheckCircle2 className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Two Column Layout: Assigned Courses + Today's Teaching Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Assigned Subjects & Class Rosters</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Curriculum assigned by Academic Board</p>
              </div>
              <Link to="/attendance">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                  Attendance Logs
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {subjects.map((subj) => (
                <div
                  key={subj.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {subj.code}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold uppercase">
                        {subj.type}
                      </span>
                      <span className="text-xs text-slate-400">{subj.credits} Credits</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {subj.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Semester {subj.semester} • 60 Enrolled Students
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedSubjectId(subj.id);
                      setIsLaunchModalOpen(true);
                    }}
                    leftIcon={<QrCode className="w-3.5 h-3.5" />}
                  >
                    Start Session
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Today's Lectures</CardTitle>
              <Link to="/timetable">
                <Button variant="ghost" size="sm">Schedule</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {timetable.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                    <span>{entry.start_time} - {entry.end_time}</span>
                    <Badge variant="primary" size="sm">{entry.room_number}</Badge>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {entry.subject_name}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Section {entry.section} • {entry.building}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal to launch QR Session */}
      <Modal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        title="Generate Smart Attendance QR Session"
        description="Creates a time-limited dynamic session token and PIN for students to check in."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsLaunchModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateSession} leftIcon={<Play className="w-4 h-4" />}>
              Launch Session Now
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Select Subject"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </Select>

          <Select
            label="Classroom Location"
            value={selectedClassroomId}
            onChange={(e) => setSelectedClassroomId(e.target.value)}
          >
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.room_number} - {c.building} (Capacity: {c.capacity})
              </option>
            ))}
          </Select>

          <Select
            label="Session Expiration Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="5">5 Minutes (Strict check-in)</option>
            <option value="10">10 Minutes</option>
            <option value="15">15 Minutes (Standard lecture)</option>
            <option value="30">30 Minutes</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};
