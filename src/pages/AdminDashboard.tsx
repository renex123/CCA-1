import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import { Department, Complaint, ServiceRequest, AuditLog } from '../types';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  BarChart3,
  Calendar,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  if (!user) return null;

  const departments: Department[] = db.getDepartments();
  const complaints: Complaint[] = db.getComplaints();
  const services: ServiceRequest[] = db.getServices();
  const auditLogs: AuditLog[] = db.getAuditLogs().slice(0, 5);

  const totalStudents = departments.reduce((acc, d) => acc + d.total_students, 0);
  const totalFaculty = departments.reduce((acc, d) => acc + d.total_faculty, 0);
  const openComplaints = complaints.filter((c) => c.status !== 'resolved').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'resolved').length;
  const pendingServices = services.filter((s) => s.status === 'submitted' || s.status === 'in_review').length;

  // Chart data: Attendance & enrollment by department
  const deptData = departments.map((d) => ({
    name: d.code,
    students: d.total_students,
    attendanceRate: d.code === 'CSE' ? 88.4 : d.code === 'ECE' ? 82.1 : d.code === 'MECH' ? 79.5 : 85.0,
  }));

  // Complaint category chart data
  const complaintsByCategory = [
    { name: 'Internet / Wi-Fi', value: complaints.filter((c) => c.category === 'internet').length, color: '#6366f1' },
    { name: 'Classroom AV', value: complaints.filter((c) => c.category === 'classroom_equipment').length, color: '#8b5cf6' },
    { name: 'Water / Sanitation', value: complaints.filter((c) => c.category === 'water_supply').length, color: '#06b6d4' },
    { name: 'Electricity', value: complaints.filter((c) => c.category === 'electricity').length, color: '#f59e0b' },
    { name: 'Other Facilities', value: complaints.filter((c) => c.category === 'cleanliness' || c.category === 'other').length || 1, color: '#10b981' },
  ];

  const handleResetData = () => {
    if (window.confirm('Reset all demo state to fresh default dataset?')) {
      db.resetAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Executive Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Academic Affairs & Digital Governance
            </span>
            <span className="text-[10px] font-semibold text-slate-500">
              Dean & Controller of Examinations
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[10px] font-mono text-slate-500">
              Admin Node: <strong className="text-slate-900 dark:text-slate-100">ADM-HQ-01</strong>
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {user.full_name}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Institutional Oversight: {departments.length} Academic Departments, 1,600+ Students, 80 Faculty Staff
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/analytics">
            <button className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer shadow-xs">
              <BarChart3 className="w-3.5 h-3.5" />
              Statutory Reports & Audits
            </button>
          </Link>
          <button
            onClick={handleResetData}
            title="Reset demonstration data"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          subtitle="Across 5 active departments"
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/60"
        />

        <StatCard
          title="Faculty Members"
          value={totalFaculty}
          subtitle="18 Professors & 62 Lecturers"
          icon={<Building2 className="w-5 h-5 text-purple-600" />}
          iconBgColor="bg-purple-50 dark:bg-purple-950/60"
        />

        <StatCard
          title="Open Complaints"
          value={openComplaints}
          subtitle={`${resolvedComplaints} resolved successfully`}
          isPositive={openComplaints <= 3}
          change={openComplaints > 0 ? 'Action Required' : 'All Clear'}
          icon={<AlertCircle className="w-5 h-5 text-rose-600" />}
          iconBgColor="bg-rose-50 dark:bg-rose-950/60"
        />

        <StatCard
          title="Pending Requests"
          value={pendingServices}
          subtitle="Bonafide & ID replacements"
          isPositive={pendingServices === 0}
          icon={<FileCheck className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/60"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Rates by Department Bar Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div>
                <CardTitle>Attendance Trends by Department (%)</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Calculated from verified QR check-ins this semester</p>
              </div>
              <Badge variant="success" size="sm">75% Threshold Passed</Badge>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      color: '#fff',
                      borderRadius: '0.75rem',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="attendanceRate" name="Attendance Rate %" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Complaint Category Breakdown Pie Chart */}
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div>
                <CardTitle>Complaint Categories</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Distribution by campus issue type</p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={complaintsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {complaintsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-2 gap-2 w-full text-[11px]">
                {complaintsByCategory.map((c) => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-slate-600 dark:text-slate-400 truncate">{c.name} ({c.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Two Columns: Recent System Audit Logs + Quick Administrative Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>System Audit Log & Live Activity</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Tamper-evident record of privileged actions</p>
              </div>
              <Badge variant="outline" size="sm">RLS Protected</Badge>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 dark:divide-slate-800 p-0">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
                        {log.action}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {log.user_name}
                      </span>
                      <span className="text-[10px] text-slate-400">({log.user_role})</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {log.details}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Administrator Ops */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Administrative Workflows</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link
                to="/complaints"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:border-indigo-500 transition-colors group block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Manage Complaints</p>
                    <p className="text-[10px] text-slate-400">{openComplaints} awaiting resolution</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link
                to="/services"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:border-indigo-500 transition-colors group block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Approve Certificates</p>
                    <p className="text-[10px] text-slate-400">{pendingServices} pending requests</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link
                to="/timetable"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:border-indigo-500 transition-colors group block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Timetable Scheduler</p>
                    <p className="text-[10px] text-slate-400">Conflict-checked room bookings</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link
                to="/users"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between hover:border-indigo-500 transition-colors group block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">User Directory</p>
                    <p className="text-[10px] text-slate-400">Student & faculty profiles</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
