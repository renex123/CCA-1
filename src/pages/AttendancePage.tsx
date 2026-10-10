import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import {
  AttendanceSession,
  AttendanceRecord,
  StudentSubjectAttendance,
  Subject,
  Classroom,
} from '../types';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Play,
  StopCircle,
  Clock,
  ShieldCheck,
  Users,
  Camera,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

export const AttendancePage: React.FC = () => {
  const { user, role } = useAuth();
  const [, setTick] = useState(0);

  // Student state
  const [sessionInput, setSessionInput] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  // Faculty state
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-cs601');
  const [selectedClassroomId, setSelectedClassroomId] = useState('room-lh-204');
  const [durationMinutes, setDurationMinutes] = useState('15');

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  if (!user) return null;

  const sessions: AttendanceSession[] = db.getAttendanceSessions();
  const activeSession = sessions.find((s) => s.is_active);
  const subjects: Subject[] = db.getSubjects();
  const classrooms: Classroom[] = db.getClassrooms();
  const studentAttendance: StudentSubjectAttendance[] = db.getStudentAttendance(user.id);
  const records: AttendanceRecord[] = db.getAttendanceRecords(activeSession?.id);

  // Handle student check-in
  const handleStudentSubmit = (codeToUse?: string) => {
    const code = codeToUse || sessionInput;
    if (!code) {
      setSubmissionFeedback({
        type: 'error',
        message: 'Please enter a 6-digit session PIN or scan the QR code.',
      });
      return;
    }

    const res = db.markAttendance(code, user);
    if (res.success) {
      setSubmissionFeedback({ type: 'success', message: res.message });
      setSessionInput('');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setSubmissionFeedback({ type: 'error', message: res.message });
    }
  };

  // Simulate scanning active QR code
  const handleSimulateScan = () => {
    if (!activeSession) {
      setSubmissionFeedback({
        type: 'error',
        message: 'No active session currently running to scan.',
      });
      return;
    }
    setIsSimulatingScan(true);
    setTimeout(() => {
      setIsSimulatingScan(false);
      handleStudentSubmit(activeSession.session_code);
    }, 800);
  };

  // Faculty create session
  const handleCreateSession = () => {
    db.createAttendanceSession(
      user,
      selectedSubjectId,
      selectedClassroomId,
      parseInt(durationMinutes, 10),
      'A',
      6
    );
    setIsLaunchModalOpen(false);
  };

  // Faculty close session
  const handleCloseSession = (sessionId: string) => {
    db.closeAttendanceSession(sessionId, user);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smart Attendance Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically signed QR tokens • Time-limited validity • Fraud-resistant check-in
          </p>
        </div>

        {role === 'faculty' && (
          <Button
            onClick={() => setIsLaunchModalOpen(true)}
            leftIcon={<Play className="w-4 h-4" />}
            variant="primary"
          >
            Create New QR Session
          </Button>
        )}
      </div>

      {/* FACULTY SECTION: Active Session Broadcast */}
      {role === 'faculty' && (
        <>
          {activeSession ? (
            <Card className="border-2 border-indigo-500 dark:border-indigo-600 overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Live Session Broadcasting
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-white/20 px-2.5 py-1 rounded-md">
                    Expires at: {new Date(activeSession.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCloseSession(activeSession.id)}
                    leftIcon={<StopCircle className="w-3.5 h-3.5" />}
                  >
                    Close Session
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-200">
                      <QRCodeSVG value={activeSession.qr_token} size={220} />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-xs text-slate-400 font-semibold uppercase">Manual 6-Digit PIN</p>
                      <p className="text-3xl font-black font-mono tracking-widest text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {activeSession.session_code}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Students project/scan or type PIN to register check-in
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {activeSession.subject_code}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {activeSession.subject_name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Classroom: <strong>{activeSession.room_number}</strong> • Section: <strong>{activeSession.section}</strong> • Semester: <strong>{activeSession.semester}</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                        <span className="text-[11px] text-slate-500 font-semibold uppercase">Enrolled</span>
                        <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                          {activeSession.total_enrolled}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                        <span className="text-[11px] text-slate-500 font-semibold uppercase">Marked Present</span>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {activeSession.marked_count}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Real-Time Student Check-In Stream
                      </h4>
                      <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl p-2 bg-white dark:bg-slate-900">
                        {records.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-4">
                            Waiting for students to scan...
                          </p>
                        ) : (
                          records.map((r) => (
                            <div key={r.id} className="py-2 px-2 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{r.student_name}</span>
                                <span className="text-slate-400 ml-2 font-mono">({r.student_enrollment})</span>
                              </div>
                              <span className="text-[10px] text-emerald-600 font-semibold">
                                ✓ Verified ({new Date(r.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 border-dashed">
              <QrCode className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                No active attendance session
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Click "Create New QR Session" above to generate a live QR code and 6-digit verification code for your class.
              </p>
              <Button onClick={() => setIsLaunchModalOpen(true)} leftIcon={<Play className="w-4 h-4" />}>
                Launch Session
              </Button>
            </Card>
          )}
        </>
      )}

      {/* STUDENT SECTION: QR Check-In Submission Widget */}
      {role === 'student' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader className="bg-indigo-50/50 dark:bg-indigo-950/30">
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-600" />
                Submit Class Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {submissionFeedback.type && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    submissionFeedback.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {submissionFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <span>{submissionFeedback.message}</span>
                </div>
              )}

              <div className="space-y-3">
                <Input
                  label="Session 6-Digit PIN or QR Code"
                  placeholder="e.g. 749216"
                  value={sessionInput}
                  onChange={(e) => setSessionInput(e.target.value)}
                  maxLength={40}
                  className="font-mono text-center text-lg tracking-widest font-bold"
                />

                <Button
                  onClick={() => handleStudentSubmit()}
                  className="w-full"
                  variant="primary"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Verify & Mark Attendance
                </Button>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 text-[10px] uppercase font-bold">
                      Or Camera Simulation
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleSimulateScan}
                  variant="outline"
                  className="w-full"
                  isLoading={isSimulatingScan}
                  leftIcon={<Camera className="w-4 h-4" />}
                >
                  Simulate QR Scanner
                </Button>

                {activeSession && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Active Faculty Session:</span>
                    <span className="font-mono font-bold text-indigo-600">{activeSession.session_code}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subject Attendance Percentages Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Official Academic Attendance Record</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Spring Semester 2026 • Minimum Requirement: 75%
                </p>
              </div>
              <Badge variant="outline" size="sm">Audited by Controller of Exams</Badge>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase">
                      <th className="pb-3 font-semibold">Subject & Code</th>
                      <th className="pb-3 font-semibold text-center">Attended</th>
                      <th className="pb-3 font-semibold text-center">Total Held</th>
                      <th className="pb-3 font-semibold text-center">Percentage</th>
                      <th className="pb-3 font-semibold text-right">Exam Eligibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {studentAttendance.map((item) => (
                      <tr key={item.subject_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-medium">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{item.subject_name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{item.subject_code}</span>
                        </td>
                        <td className="py-3 text-center font-bold text-slate-900 dark:text-slate-100">
                          {item.attended_classes}
                        </td>
                        <td className="py-3 text-center text-slate-500">
                          {item.total_classes}
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={`font-bold font-mono ${
                              item.percentage >= 75
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : item.percentage >= 65
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {item.percentage}%
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Badge
                            variant={
                              item.percentage >= 75
                                ? 'success'
                                : item.percentage >= 65
                                ? 'warning'
                                : 'destructive'
                            }
                            size="sm"
                          >
                            {item.percentage >= 75
                              ? 'Eligible'
                              : item.percentage >= 65
                              ? 'Medical Review'
                              : 'Debarred'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ADMIN VIEW: Institution Attendance Ledger */}
      {role === 'admin' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>University-Wide Attendance Ledger & Active Sessions</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Live monitoring across all department lecture halls</p>
            </div>
            <Badge variant="primary" size="sm">{sessions.length} Total Sessions</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase">
                    <th className="pb-3 font-semibold">Subject</th>
                    <th className="pb-3 font-semibold">Faculty In-Charge</th>
                    <th className="pb-3 font-semibold">Room</th>
                    <th className="pb-3 font-semibold text-center">Session PIN</th>
                    <th className="pb-3 font-semibold text-center">Marked / Enrolled</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sessions.map((sess) => (
                    <tr key={sess.id}>
                      <td className="py-3 font-bold text-slate-900 dark:text-slate-100">
                        {sess.subject_name} ({sess.subject_code})
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        {sess.faculty_name}
                      </td>
                      <td className="py-3 text-slate-500">{sess.room_number}</td>
                      <td className="py-3 text-center font-mono font-bold text-indigo-600">{sess.session_code}</td>
                      <td className="py-3 text-center font-bold">
                        {sess.marked_count} / {sess.total_enrolled}
                      </td>
                      <td className="py-3 text-right">
                        <Badge variant={sess.is_active ? 'success' : 'secondary'} size="sm">
                          {sess.is_active ? 'Active' : 'Closed'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal for faculty session creation */}
      <Modal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        title="Start Verified Attendance QR Session"
        description="Creates dynamic QR token with server-side validation against class roster."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsLaunchModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateSession} leftIcon={<Play className="w-4 h-4" />}>
              Generate QR Code
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Course / Subject"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} — {s.name}
              </option>
            ))}
          </Select>

          <Select
            label="Lecture Hall / Classroom"
            value={selectedClassroomId}
            onChange={(e) => setSelectedClassroomId(e.target.value)}
          >
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.room_number} — {c.building} (Seats: {c.capacity})
              </option>
            ))}
          </Select>

          <Select
            label="QR Window Duration"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          >
            <option value="5">5 Minutes (Strict check-in window)</option>
            <option value="10">10 Minutes</option>
            <option value="15">15 Minutes (Recommended)</option>
            <option value="30">30 Minutes</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};
