import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import {
  StudentSubjectAttendance,
  TimetableEntry,
  Announcement,
  Complaint,
  ServiceRequest,
  Assignment,
} from '../types';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  QrCode,
  Calendar,
  AlertCircle,
  FileCheck,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  if (!user) return null;

  const attendanceList: StudentSubjectAttendance[] = db.getStudentAttendance(user.id);
  const timetable: TimetableEntry[] = db.getTimetable().filter((t) => t.semester === (user.semester || 6));
  const announcements: Announcement[] = db.getAnnouncements().slice(0, 3);
  const complaints: Complaint[] = db.getComplaints().filter((c) => c.student_id === user.id);
  const services: ServiceRequest[] = db.getServices().filter((s) => s.student_id === user.id);
  const assignments: Assignment[] = db.getAssignments().slice(0, 3);

  // Calculate aggregate attendance
  const totalClasses = attendanceList.reduce((acc, curr) => acc + curr.total_classes, 0);
  const attendedClasses = attendanceList.reduce((acc, curr) => acc + curr.attended_classes, 0);
  const aggregatePercentage = totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(1) : '85.0';

  // Next class calculation
  const nextClass = timetable[0];

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {user.department_name}
            </span>
            <span className="text-[10px] font-semibold text-slate-500">
              Semester {user.semester || 6} • Section {user.section || 'A'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[10px] font-mono text-slate-500">
              Roll: <strong className="text-slate-900 dark:text-slate-100">{user.enrollment_no}</strong>
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {user.full_name}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Cumulative Academic Performance: <span className="font-bold text-slate-900 dark:text-slate-100">{user.cgpa || '8.74'} SGPA</span> • Status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Good Standing</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/attendance">
            <button className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer shadow-xs">
              <QrCode className="w-3.5 h-3.5" />
              Check In Attendance
            </button>
          </Link>
          <Link to="/complaints">
            <button className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
              Lodge Grievance
            </button>
          </Link>
        </div>
      </div>

      {/* Next Class Alert Card */}
      {nextClass && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-600 text-white shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  Next Up Today
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  {nextClass.start_time} - {nextClass.end_time}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {nextClass.subject_name} ({nextClass.subject_code})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Faculty: {nextClass.faculty_name}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                  <MapPin className="w-3 h-3" /> {nextClass.room_number} ({nextClass.building})
                </span>
              </p>
            </div>
          </div>
          <Link to="/attendance">
            <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Class Check-In
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Aggregate"
          value={`${aggregatePercentage}%`}
          change={parseFloat(aggregatePercentage) >= 75 ? 'Eligibility Safe' : 'Shortage Warning'}
          isPositive={parseFloat(aggregatePercentage) >= 75}
          subtitle="Minimum 75% required for exams"
          icon={<CheckCircle2 className="w-5 h-5 text-indigo-600" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/60"
        />

        <StatCard
          title="Active Assignments"
          value={assignments.length}
          subtitle="2 due within next 7 days"
          icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/60"
        />

        <StatCard
          title="Active Complaints"
          value={complaints.filter((c) => c.status !== 'resolved').length}
          subtitle={`${complaints.filter((c) => c.status === 'in_progress').length} currently in progress`}
          icon={<AlertCircle className="w-5 h-5 text-rose-600" />}
          iconBgColor="bg-rose-50 dark:bg-rose-950/60"
        />

        <StatCard
          title="Service Requests"
          value={services.length}
          subtitle="1 approved certificate ready"
          icon={<FileCheck className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
        />
      </div>

      {/* Two Column Layout: Subject Attendance + Today's Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject-Wise Attendance Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Subject-Wise Attendance Breakdown</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Real-time attendance log synchronized with QR sessions</p>
              </div>
              <Link to="/attendance">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {attendanceList.map((item) => (
                <div key={item.subject_id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{item.subject_name}</span>
                      <span className="text-slate-400 ml-1.5 font-mono">({item.subject_code})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono">
                        {item.attended_classes}/{item.total_classes} classes
                      </span>
                      <Badge
                        variant={
                          item.status === 'good'
                            ? 'success'
                            : item.status === 'warning'
                            ? 'warning'
                            : 'destructive'
                        }
                        size="sm"
                      >
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.percentage >= 75
                          ? 'bg-emerald-500'
                          : item.percentage >= 65
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Timetable Snippet */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <Link to="/timetable">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                  Full Week
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {timetable.slice(0, 4).map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
                >
                  <div className="px-2 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold text-center shrink-0">
                    <div>{entry.start_time}</div>
                    <div className="text-[9px] text-slate-400">{entry.end_time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {entry.subject_name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{entry.faculty_name}</p>
                    <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {entry.room_number} • {entry.building}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Announcements + Pending Complaints + Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Campus Notices</CardTitle>
            <Link to="/announcements">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <Badge variant={ann.priority === 'urgent' ? 'destructive' : 'primary'} size="sm">
                    {ann.category}
                  </Badge>
                  <span className="text-[10px] text-slate-400">
                    {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {ann.title}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {ann.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>My Complaints</CardTitle>
            <Link to="/complaints">
              <Button variant="ghost" size="sm">+ New</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {complaints.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No complaints logged</p>
            ) : (
              complaints.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono text-slate-400">{c.ticket_no}</span>
                    <Badge
                      variant={
                        c.status === 'resolved'
                          ? 'success'
                          : c.status === 'in_progress'
                          ? 'warning'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {c.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {c.title}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">{c.campus_location}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Digital Service Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Service Requests</CardTitle>
            <Link to="/services">
              <Button variant="ghost" size="sm">Apply</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono text-slate-400">{s.request_no}</span>
                  <Badge variant={s.status === 'approved' ? 'success' : 'warning'} size="sm">
                    {s.status}
                  </Badge>
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {s.title}
                </h5>
                {s.status === 'approved' && (
                  <Link to="/services" className="inline-block mt-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    📥 Download Digitally Signed Certificate
                  </Link>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
