import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import { AttendanceSession, TimetableEntry, Subject, Classroom, Assignment } from '../types';
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
  AlertTriangle,
  FileText,
  Check,
  Send,
  Award,
  Download,
  ExternalLink,
  Maximize2,
  GraduationCap,
  Bell,
  Eye,
  Sliders,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { QRCodeSVG } from 'qrcode.react';

interface DefaulterStudent {
  id: string;
  name: string;
  enrollment: string;
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attended: number;
  percentage: number;
  status: 'critical' | 'warning';
}

interface StudentSubmission {
  id: string;
  studentName: string;
  enrollment: string;
  submittedAt: string;
  status: 'submitted' | 'graded';
  score?: number;
  maxScore: number;
  remarks?: string;
}

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [, setTick] = useState(0);

  // Modals & Triggers
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isProjectorModalOpen, setIsProjectorModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  // Form States
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-cs601');
  const [selectedClassroomId, setSelectedClassroomId] = useState('room-lh-204');
  const [duration, setDuration] = useState('15');

  // New Assignment Form State
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDesc, setNewAssignmentDesc] = useState('');
  const [newAssignmentDue, setNewAssignmentDue] = useState('2026-03-28');
  const [newAssignmentMaxMarks, setNewAssignmentMaxMarks] = useState('25');

  // Toast feedback state
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Active student for defaulter warning modal
  const [selectedDefaulter, setSelectedDefaulter] = useState<DefaulterStudent | null>(null);

  // Sample student submissions for grading modal
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    { id: 'sub-1', studentName: 'Aarav Sharma', enrollment: '23CSE104', submittedAt: 'Yesterday, 11:20 PM', status: 'graded', score: 23, maxScore: 25, remarks: 'Excellent raft leader election logic and unit tests.' },
    { id: 'sub-2', studentName: 'Ananya Mishra', enrollment: '23CSE102', submittedAt: 'Today, 08:45 AM', status: 'submitted', maxScore: 25 },
    { id: 'sub-3', studentName: 'Rohan Sen', enrollment: '23CSE108', submittedAt: 'Today, 10:15 AM', status: 'submitted', maxScore: 25 },
    { id: 'sub-4', studentName: 'Pooja Mohanty', enrollment: '23CSE115', submittedAt: 'Yesterday, 04:30 PM', status: 'submitted', maxScore: 25 },
  ]);

  // Selected assignment for grading
  const [gradingAssignmentTitle, setGradingAssignmentTitle] = useState('Consensus Algorithm Implementation (Raft Protocol)');

  // Temporary scores during grading
  const [gradingScores, setGradingScores] = useState<Record<string, string>>({
    'sub-2': '22',
    'sub-3': '19',
    'sub-4': '24',
  });

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  if (!user) return null;

  // Real Database Queries
  const subjects: Subject[] = db.getSubjects().filter((s) => s.faculty_id === user.id || s.faculty_name?.includes('Priya') || s.code === 'CS-601' || s.code === 'CS-604');
  const classrooms: Classroom[] = db.getClassrooms();
  const timetable: TimetableEntry[] = db.getTimetable().filter((t) => t.faculty_id === user.id || t.faculty_name?.includes('Priya') || t.subject_code === 'CS-601' || t.subject_code === 'CS-604');
  const sessions: AttendanceSession[] = db.getAttendanceSessions().filter((s) => s.faculty_id === user.id || s.faculty_name?.includes('Priya'));
  const activeSession = sessions.find((s) => s.is_active);
  const assignments: Assignment[] = db.getAssignments().filter((a) => a.faculty_id === user.id || a.faculty_name?.includes('Priya') || a.subject_id === 'sub-cs601');

  // Defaulter Students (< 75% attendance)
  const defaulters: DefaulterStudent[] = [
    {
      id: 'def-1',
      name: 'Rohan Mehra',
      enrollment: '23ME045',
      subjectCode: 'CS-601',
      subjectName: 'Distributed Systems & Cloud',
      totalClasses: 36,
      attended: 21,
      percentage: 58.3,
      status: 'critical',
    },
    {
      id: 'def-2',
      name: 'Kavita Jena',
      enrollment: '23CSE088',
      subjectCode: 'CS-601',
      subjectName: 'Distributed Systems & Cloud',
      totalClasses: 36,
      attended: 25,
      percentage: 69.4,
      status: 'warning',
    },
    {
      id: 'def-3',
      name: 'Siddharth Patra',
      enrollment: '23CSE112',
      subjectCode: 'CS-604',
      subjectName: 'Full Stack Web Development',
      totalClasses: 28,
      attended: 19,
      percentage: 67.8,
      status: 'warning',
    },
  ];

  // Syllabus Coverage calculation
  const syllabusData = [
    {
      subjectCode: 'CS-601',
      subjectName: 'Distributed Systems & Cloud Computing',
      deliveredLectures: 28,
      totalLectures: 40,
      turnoutRate: 91.2,
      enrolled: 60,
      nextTopic: 'Byzantine Fault Tolerance & Paxos Quorum Models',
    },
    {
      subjectCode: 'CS-604',
      subjectName: 'Full Stack Web Development & Microservices',
      deliveredLectures: 22,
      totalLectures: 32,
      turnoutRate: 93.5,
      enrolled: 60,
      nextTopic: 'Container Orchestration with Kubernetes & gRPC',
    },
  ];

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
    showToast(`Smart QR attendance session launched for Classroom ${classrooms.find((c) => c.id === selectedClassroomId)?.room_number || 'LH-204'}!`);
  };

  const handleEndSession = (id: string) => {
    db.closeAttendanceSession(id, user);
    showToast('Attendance session successfully closed and cryptographically archived.');
  };

  const handleSaveGrades = () => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (gradingScores[sub.id]) {
          return {
            ...sub,
            status: 'graded',
            score: parseInt(gradingScores[sub.id], 10),
            remarks: 'Evaluated & graded by Dr. Priya Sengupta.',
          };
        }
        return sub;
      })
    );
    setIsGradeModalOpen(false);
    showToast(`Evaluated grades successfully saved to university exam cell registry!`);
  };

  const handleCreateAssignment = () => {
    if (!newAssignmentTitle) return;
    setIsAssignmentModalOpen(false);
    showToast(`Assignment "${newAssignmentTitle}" published to enrolled students!`);
    setNewAssignmentTitle('');
    setNewAssignmentDesc('');
  };

  const handleSendWarning = () => {
    if (!selectedDefaulter) return;
    setIsWarningModalOpen(false);
    showToast(`Formal attendance debarment warning letter dispatched to ${selectedDefaulter.name} (${selectedDefaulter.enrollment}) and guardian via SMS/Portal.`);
    setSelectedDefaulter(null);
  };

  const handleExportCSV = () => {
    const csvContent =
      'Enrollment,Student Name,Subject Code,Classes Attended,Total Classes,Attendance %\n' +
      '23CSE101,Aarav Sharma,CS-601,32,36,88.8%\n' +
      '23CSE102,Ananya Mishra,CS-601,34,36,94.4%\n' +
      '23CSE104,Rohan Sen,CS-601,31,36,86.1%\n' +
      '23ME045,Rohan Mehra,CS-601,21,36,58.3%\n' +
      '23CSE088,Kavita Jena,CS-601,25,36,69.4%\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CS601_Attendance_Audit_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Attendance report CSV downloaded successfully for NAAC/NIRF inspection.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#652b7c] shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-[#fbf3fc] text-[#652b7c] flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-[#652b7c]" />
          </div>
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{feedbackToast}</p>
        </div>
      )}

      {/* Professor Executive Command Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#13071b] border-2 border-[#ebd0f3] dark:border-[#3b1549] shadow-lg shadow-[#652b7c]/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Soft Background Accent Orb */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#652b7c]/10 blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#fbf3fc] dark:bg-[#250d2f] text-[#652b7c] dark:text-[#c27de2] border border-[#ebd0f3] dark:border-[#4b1d5c]">
              Academic Faculty Portal
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Department of {user.department_name || 'Computer Science & Engineering'}
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              Cabin B-304 (Aryabhata Block)
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-[#652b7c] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#652b7c]/25 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {user.full_name || 'Dr. Priya Sengupta'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Associate Professor & Course Coordinator • Office Hours: <strong className="text-slate-800 dark:text-slate-200">Mon–Thu, 2:00 PM – 4:00 PM</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Faculty Action Bar with Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => setIsLaunchModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#652b7c] hover:bg-[#522165] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-md shadow-[#652b7c]/25 cursor-pointer active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Live QR Session</span>
          </button>

          <button
            onClick={() => setIsAssignmentModalOpen(true)}
            className="px-4 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-[#ebd0f3] dark:border-[#4b1d5c] hover:border-[#652b7c] text-[#652b7c] dark:text-[#c27de2] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Assignment</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Export Attendance Audit CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Live Lecture Control Station (Active Projector Display Card) */}
      {activeSession && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#200929] via-[#351144] to-[#1a0721] text-white border-2 border-[#652b7c] shadow-2xl shadow-[#652b7c]/30 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="p-3.5 bg-white rounded-2xl shadow-xl border-4 border-[#ebd0f3] shrink-0">
              <QRCodeSVG value={activeSession.qr_token} size={110} />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wide animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  Live Classroom Session Active
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold border border-white/20">
                  PIN: {activeSession.session_code}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {activeSession.subject_name} ({activeSession.subject_code})
              </h3>
              <p className="text-xs text-[#ebd0f3]/80">
                Classroom: <strong className="text-white">{activeSession.room_number}</strong> • Section {activeSession.section} • 60 Enrolled Scholars
              </p>

              {/* Progress bar */}
              <div className="pt-2 w-full max-w-md">
                <div className="flex justify-between text-xs text-[#ebd0f3] mb-1 font-mono">
                  <span>Checked In: {activeSession.marked_count} / {activeSession.total_enrolled}</span>
                  <span>{Math.round((activeSession.marked_count / activeSession.total_enrolled) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                    style={{ width: `${(activeSession.marked_count / activeSession.total_enrolled) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => setIsProjectorModalOpen(true)}
              className="px-5 py-3 rounded-full bg-white text-[#381144] hover:bg-[#faf0fc] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <Maximize2 className="w-4 h-4 text-[#652b7c]" />
              <span>Projector Fullscreen</span>
            </button>

            <button
              onClick={() => handleEndSession(activeSession.id)}
              className="px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <StopCircle className="w-4 h-4" />
              <span>Close Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Faculty Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Scholars Enrolled"
          value="120 Students"
          subtitle="Sections A & B • B.Tech Sem 6"
          icon={<Users className="w-5 h-5 text-[#652b7c]" />}
        />

        <StatCard
          title="Today's Teaching Schedule"
          value={`${timetable.length} Lectures`}
          subtitle="LH-204 & CS-LAB-302"
          icon={<Clock className="w-5 h-5 text-sky-600" />}
        />

        <StatCard
          title="Grading Queue"
          value={`${submissions.filter((s) => s.status === 'submitted').length} Pending`}
          subtitle="Algorithm Problem Sets"
          icon={<FileText className="w-5 h-5 text-amber-600" />}
        />

        <StatCard
          title="Class Average Attendance"
          value="91.4%"
          change="+3.2% vs Dept Average"
          isPositive={true}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Main Grid: Courses Syllabus Tracker & Grading Evaluation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Syllabus Tracker & Grading Queue */}
        <div className="lg:col-span-8 space-y-6">
          {/* Syllabus Progress & Course Portfolio */}
          <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-bold">Course Curriculum & Syllabus Velocity</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Spring 2026 academic calendar tracking for assigned lectures</p>
              </div>
              <button
                onClick={() => setIsLaunchModalOpen(true)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#fbf3fc] text-[#652b7c] hover:bg-[#f3dcfa] dark:bg-[#2a0e36] dark:text-[#c27de2] transition-colors cursor-pointer"
              >
                + New Lecture Slot
              </button>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              {syllabusData.map((course) => {
                const percentage = Math.round((course.deliveredLectures / course.totalLectures) * 100);
                return (
                  <div
                    key={course.subjectCode}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#652b7c]/10 text-[#652b7c] dark:bg-[#652b7c]/30 dark:text-[#c27de2]">
                            {course.subjectCode}
                          </span>
                          <span className="text-xs text-slate-400">• {course.enrolled} Students Enrolled</span>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Avg Turnout: {course.turnoutRate}%
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                          {course.subjectName}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSubjectId(course.subjectCode === 'CS-601' ? 'sub-cs601' : 'sub-cs604');
                            setIsLaunchModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#652b7c] hover:bg-[#522165] text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Start QR</span>
                        </button>
                      </div>
                    </div>

                    {/* Syllabus progress bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Delivered: <strong>{course.deliveredLectures}</strong> of {course.totalLectures} Lectures</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{percentage}% Syllabus Covered</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#652b7c] to-[#8534a4] rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#652b7c]" />
                      <span>Next Scheduled Topic: <strong>{course.nextTopic}</strong></span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Pending Submissions Grading Queue */}
          <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-bold">Assignment Evaluation & Grading Queue</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Review student lab submissions and record internal assessment scores</p>
              </div>
              <button
                onClick={() => setIsAssignmentModalOpen(true)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#652b7c] text-white hover:bg-[#522165] transition-colors cursor-pointer"
              >
                + New Assignment
              </button>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">
                        Max: {asg.max_marks} Marks
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">
                        Due: {new Date(asg.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {asg.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {asg.description}
                    </p>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium pt-1">
                      Submissions: <strong className="text-indigo-600 dark:text-indigo-400">{asg.submission_count} / {asg.total_students} submitted</strong> • 18 Pending Grading
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setGradingAssignmentTitle(asg.title);
                        setIsGradeModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Evaluate & Grade</span>
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Low Attendance Radar & Today's Schedule */}
        <div className="lg:col-span-4 space-y-6">
          {/* Attendance Defaulters Radar (< 75%) */}
          <Card className="rounded-3xl border border-rose-200 dark:border-rose-950/60 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 border-b border-rose-100 dark:border-rose-950/40">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <CardTitle className="text-base font-bold text-rose-900 dark:text-rose-300">
                  Attendance Defaulter Warning Radar
                </CardTitle>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Scholars with attendance below mandatory 75% BPUT exam cutoff
              </p>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              {defaulters.map((def) => (
                <div
                  key={def.id}
                  className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {def.name}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-500">
                        Roll: {def.enrollment} • {def.subjectCode}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-xs font-extrabold">
                      {def.percentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                    <span>Missed {def.totalClasses - def.attended} Lectures</span>
                    <button
                      onClick={() => {
                        setSelectedDefaulter(def);
                        setIsWarningModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-semibold border border-rose-300 dark:border-rose-800 transition-colors cursor-pointer text-[10px]"
                    >
                      Send Notice
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Teaching Schedule */}
          <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold">Today's Class Schedule</CardTitle>
              <Link to="/timetable">
                <Button variant="ghost" size="sm" className="text-xs">Full Timetable</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              {timetable.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-[#652b7c] dark:text-[#c27de2] font-bold">
                    <span>{entry.start_time} – {entry.end_time}</span>
                    <Badge variant="primary" size="sm">{entry.room_number}</Badge>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {entry.subject_name}
                  </h5>
                  <p className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Section {entry.section} • {entry.building}</span>
                    <span className="text-emerald-600 font-semibold">Scheduled</span>
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL 1: Launch QR Session */}
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
            <Button variant="brand" pill onClick={handleCreateSession} leftIcon={<Play className="w-4 h-4" />}>
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
                {s.code} — {s.name}
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
                {c.room_number} — {c.building} (Capacity: {c.capacity})
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

      {/* MODAL 2: Fullscreen Classroom Projector Mode */}
      {isProjectorModalOpen && activeSession && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in duration-200">
          <button
            onClick={() => setIsProjectorModalOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-xl w-full text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-white font-extrabold text-xs uppercase animate-pulse">
              ● Live Lecture Attendance
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {activeSession.subject_name}
            </h2>
            <p className="text-slate-300 text-sm">
              Classroom {activeSession.room_number} • Section {activeSession.section} • Instructor: {activeSession.faculty_name}
            </p>

            <div className="p-8 bg-white rounded-3xl inline-block shadow-2xl mx-auto border-4 border-[#652b7c]">
              <QRCodeSVG value={activeSession.qr_token} size={280} />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-400 uppercase tracking-widest font-mono">Manual 6-Digit Verification PIN</p>
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-emerald-400">
                {activeSession.session_code}
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Students Checked In: <strong className="text-white text-base">{activeSession.marked_count} / {activeSession.total_enrolled}</strong>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Create Assignment */}
      <Modal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        title="Create New Student Assignment"
        description="Publish problem set guidelines and set submission deadlines for your class."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAssignmentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" pill onClick={handleCreateAssignment}>
              Publish Assignment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="e.g. Distributed Consensus using Raft Algorithm"
            value={newAssignmentTitle}
            onChange={(e) => setNewAssignmentTitle(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Problem Description & Instructions
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#652b7c]"
              placeholder="Specify requirements, deliverables, and test cases..."
              value={newAssignmentDesc}
              onChange={(e) => setNewAssignmentDesc(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Submission Deadline"
              type="date"
              value={newAssignmentDue}
              onChange={(e) => setNewAssignmentDue(e.target.value)}
            />
            <Input
              label="Maximum Marks"
              type="number"
              value={newAssignmentMaxMarks}
              onChange={(e) => setNewAssignmentMaxMarks(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* MODAL 4: Evaluate & Grade Submissions */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title={`Evaluate Submissions — ${gradingAssignmentTitle}`}
        description="Review student submissions, input marks, and record evaluation notes."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="brand" pill onClick={handleSaveGrades} leftIcon={<Check className="w-4 h-4" />}>
              Save All Grades
            </Button>
          </>
        }
      >
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{sub.studentName}</div>
                <div className="text-[11px] text-slate-500 font-mono">Roll: {sub.enrollment} • {sub.submittedAt}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">Marks:</span>
                  <input
                    type="number"
                    max={sub.maxScore}
                    min={0}
                    value={gradingScores[sub.id] || sub.score || ''}
                    onChange={(e) => setGradingScores({ ...gradingScores, [sub.id]: e.target.value })}
                    className="w-14 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-center font-bold font-mono focus:ring-1 focus:ring-[#652b7c]"
                  />
                  <span className="text-slate-400">/ {sub.maxScore}</span>
                </div>
                {sub.status === 'graded' ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[10px]">
                    Graded
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[10px]">
                    Pending
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* MODAL 5: Dispatch Attendance Debarment Warning */}
      {isWarningModalOpen && selectedDefaulter && (
        <Modal
          isOpen={isWarningModalOpen}
          onClose={() => setIsWarningModalOpen(false)}
          title="Dispatch Official Attendance Debarment Notice"
          description={`Issue a statutory BPUT attendance warning letter for ${selectedDefaulter.name} (${selectedDefaulter.enrollment}).`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsWarningModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSendWarning} leftIcon={<Send className="w-4 h-4" />}>
                Confirm & Dispatch Notice
              </Button>
            </>
          }
        >
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2 text-xs text-rose-900 dark:text-rose-200">
            <p className="font-bold">Notice Preview:</p>
            <p className="leading-relaxed">
              "Dear {selectedDefaulter.name}, your recorded attendance in <strong>{selectedDefaulter.subjectName} ({selectedDefaulter.subjectCode})</strong> stands at <strong>{selectedDefaulter.percentage}%</strong> ({selectedDefaulter.attended}/{selectedDefaulter.totalClasses} classes), which is below the mandatory 75% threshold required by the BPUT Examination Board. Failure to improve turnout before end-semester exam registration may lead to formal course debarment."
            </p>
            <p className="text-[11px] text-rose-700 dark:text-rose-400 pt-1">
              • A copy will be automatically sent to the Student Advisor and logged in the academic audit registry.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
