import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  QrCode,
  AlertCircle,
  Calendar,
  MapPin,
  FileCheck,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  Building2,
  Lock,
  Search,
  BookOpen,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const { quickSwitchRole } = useAuth();
  const navigate = useNavigate();

  const handleDemoAccess = (role: 'student' | 'faculty' | 'admin') => {
    quickSwitchRole(role);
    if (role === 'admin') navigate('/dashboard/admin');
    else if (role === 'faculty') navigate('/dashboard/faculty');
    else navigate('/dashboard/student');
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Institutional Notification Bar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-[11px] py-1.5 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-3">
        <span className="font-semibold text-white">BPUT Affiliated Autonomous Colleges</span>
        <span className="text-slate-600">•</span>
        <span>Spring Semester 2026 Academic Operations</span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="hidden sm:inline text-emerald-400 font-medium">Digital Campus Portal Active</span>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0f141f]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-base shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  CampusOne
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Institutional OS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                Integrated Campus Management System
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600 dark:text-slate-300">
            <a href="#modules" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Core Modules
            </a>
            <a href="#workflows" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Administrative Workflows
            </a>
            <a href="#architecture" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Security & RLS
            </a>
            <a href="#live-demo" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Role Access
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs">
                Staff & Student Login
              </Button>
            </Link>
            <button
              onClick={() => handleDemoAccess('student')}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Launch Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-900 dark:text-slate-100" />
              <span>National Hackathon 2026 • Autonomous Digital Campus Initiative</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12]">
              One Campus.<br />
              Centralized Academic & Administrative Governance.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              A single digital platform connecting students, faculty, and administrators. Replaces paper certificates, manual attendance registers, disjointed notice boards, and room scheduling conflicts with verified cryptographic records.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleDemoAccess('student')}
                className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <GraduationCap className="w-4 h-4" />
                Student Portal (Aarav Sharma)
              </button>
              <button
                onClick={() => handleDemoAccess('faculty')}
                className="px-5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Faculty Desk (Dr. Priya Sengupta)
              </button>
              <button
                onClick={() => handleDemoAccess('admin')}
                className="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Dean / Admin Console (Dr. Rajesh Verma)
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              ⚡ Pre-loaded with Spring 2026 semester data. Click any role above for direct evaluation access.
            </p>
          </div>

          {/* Operational Metrics Banner */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">1,600+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enrolled Undergraduates</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">94.2%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified QR Attendance</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">&lt; 4.7 hrs</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Avg Grievance SLA</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Paperless Bonafide Certs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Operational Modules */}
      <section id="modules" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            System Capabilities
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Engineered for Everyday University Operations
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Each module addresses verified institutional bottlenecks experienced by departmental staff and engineering students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              code: 'MOD-01',
              title: 'Dynamic QR Attendance Verification',
              desc: 'Faculty generate time-limited QR sessions with 6-digit backup PINs. Server validates class roster, preventing proxy submissions.',
              badge: 'Fraud Resistant',
            },
            {
              code: 'MOD-02',
              title: 'Grievance Redressal & SLA Tracking',
              desc: 'Departmental ticket pipeline with photo upload, urgency classification, technician assignment, and transparent audit histories.',
              badge: '2-48h SLA',
            },
            {
              code: 'MOD-03',
              title: 'Timetable Scheduling & Conflict Engine',
              desc: 'Conflict algorithm checks room allocation and faculty availability before schedule commits, preventing double-booking.',
              badge: 'Automated Checks',
            },
            {
              code: 'MOD-04',
              title: 'Grounded Campus Knowledge Assistant',
              desc: 'Answers queries regarding exam dates, library regulations, and syllabus using verified institutional handbooks and live timetables.',
              badge: 'Handbook Grounded',
            },
            {
              code: 'MOD-05',
              title: 'Digital Services & QR-Verified Certs',
              desc: 'Online bonafide and ID replacement applications. Approved requests generate official stamped documents with QR verification.',
              badge: 'AICTE Compliant',
            },
            {
              code: 'MOD-06',
              title: 'Interactive Campus GPS Directory',
              desc: 'Searchable directory of 8 key facilities, lecture blocks, labs, and health center with coordinates and operating hours.',
              badge: 'Leaflet GPS',
            },
          ].map((m) => (
            <div
              key={m.code}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
                    {m.code}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {m.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Administrative Workflows */}
      <section id="workflows" className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              End-to-End Governance
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              How CampusOne Replaces Fragmented University Systems
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#fafbfc] dark:bg-slate-950">
              <span className="text-xs font-mono font-bold text-slate-400">STEP 01</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                Authentication & Role Boundaries
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Students and faculty sign in with institutional credentials. Public registration is strictly restricted—administrator roles can never be self-assigned.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#fafbfc] dark:bg-slate-950">
              <span className="text-xs font-mono font-bold text-slate-400">STEP 02</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                Real-Time Validation & Processing
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Attendance records verify timestamps against active faculty windows. Grievance tickets route automatically to relevant maintenance engineering desks.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#fafbfc] dark:bg-slate-950">
              <span className="text-xs font-mono font-bold text-slate-400">STEP 03</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                Audited Telemetry & Accreditation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Privileged actions are recorded in immutable audit logs. Administrative reports export directly to CSV format for statutory NAAC/NIRF accreditation audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Access / Demo Presets */}
      <section id="live-demo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800">
          <div className="max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Evaluation & Judging Console
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-white">
              Test CampusOne Workflows Live
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Use the presets below to jump directly into each persona. The persistent database engine preserves your test actions (marking attendance, resolving tickets, generating certificates) across browser sessions.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => handleDemoAccess('student')}
                className="px-4 py-2.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                Student: Aarav Sharma (23CSE104)
              </button>
              <button
                onClick={() => handleDemoAccess('faculty')}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Faculty: Dr. Priya Sengupta
              </button>
              <button
                onClick={() => handleDemoAccess('admin')}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin: Dr. Rajesh Verma (Dean)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-white dark:bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">CampusOne</span>
            <span>—</span>
            <span>Digital Campus Operating System</span>
          </div>
          <p>National Smart Campus Hackathon 2026</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-slate-900 dark:hover:text-white">Portal Login</Link>
            <Link to="/map" className="hover:text-slate-900 dark:hover:text-white">Campus Directory</Link>
            <Link to="/ai" className="hover:text-slate-900 dark:hover:text-white">Handbook Assistant</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
