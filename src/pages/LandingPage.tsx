import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
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
  Compass,
  Cpu,
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight">
                  Campus<span className="text-indigo-600 dark:text-indigo-400">One</span>
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md">
                  v2.6
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Smart Campus Platform</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Platform Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              How It Works
            </a>
            <a href="#impact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Demonstrated Impact
            </a>
            <a href="#demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Live Roles
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-200/60 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent dark:from-indigo-950/20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>National Hackathon 2026 Innovation Project</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              One Campus. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Smarter Possibilities.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Your campus life, connected. Manage academics, discover campus services, stay informed, and get intelligent assistance — all in one centralized digital ecosystem.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => handleDemoAccess('student')}
                leftIcon={<GraduationCap className="w-5 h-5" />}
              >
                Explore Student Desk
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleDemoAccess('faculty')}
                leftIcon={<Users className="w-5 h-5" />}
              >
                Faculty Portal
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => handleDemoAccess('admin')}
                leftIcon={<ShieldCheck className="w-5 h-5" />}
              >
                Admin Command Center
              </Button>
            </div>

            {/* Quick Demo Credentials Info */}
            <p className="mt-4 text-xs text-slate-400">
              ⚡ Pre-loaded with demo accounts. Click any portal above to test live end-to-end workflows.
            </p>
          </div>

          {/* Platform Preview Showcase */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 shadow-2xl">
            <div className="rounded-xl bg-white dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="h-10 bg-slate-100 dark:bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto text-xs font-mono text-slate-500 bg-white dark:bg-slate-900 px-4 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  https://campusone.edu/dashboard/student
                </div>
              </div>

              {/* Interactive Mock Dashboard Preview */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">Smart Attendance</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">88.8% Aggregate</p>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[88.8%]" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">Next Class</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Cloud Computing (LH-204)</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 font-medium">Starts in 45 mins • Dr. Priya Sengupta</p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">CampusAI</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Grounded Assistant</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">"Exam schedule verified"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Engineered For Excellence
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
            Everything your campus needs in one digital ecosystem
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Say goodbye to physical paper slips, long office queues, unverified WhatsApp notices, and disjointed portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <QrCode className="w-6 h-6 text-indigo-600" />,
              title: 'Smart QR Attendance',
              desc: 'Faculty generate time-limited QR sessions. Students scan to log attendance with server-side enrollment & expiry validation.',
              tag: 'Demo 1',
            },
            {
              icon: <AlertCircle className="w-6 h-6 text-rose-600" />,
              title: 'Transparent Complaints',
              desc: 'Report Wi-Fi, electricity, or lab equipment faults with photo attachments and track real-time resolution SLAs.',
              tag: 'Demo 2',
            },
            {
              icon: <Calendar className="w-6 h-6 text-sky-600" />,
              title: 'Timetable & Conflict Engine',
              desc: 'Automated conflict detection prevents room and faculty double-booking with instant notification broadcast.',
              tag: 'Demo 3',
            },
            {
              icon: <Sparkles className="w-6 h-6 text-purple-600" />,
              title: 'CampusAI Assistant',
              desc: 'Grounded in verified institutional regulations and student timetables. Never invents policies or dates.',
              tag: 'Demo 4',
            },
            {
              icon: <FileCheck className="w-6 h-6 text-emerald-600" />,
              title: 'Digital Campus Services',
              desc: 'Apply for Bonafide certificates, ID replacements, and hall tickets. Get digitally verified PDF documents.',
              tag: 'Demo 5',
            },
            {
              icon: <MapPin className="w-6 h-6 text-amber-600" />,
              title: 'Interactive Campus Map',
              desc: 'Find lecture halls, laboratories, food courts, and medical centers with OpenStreetMap navigation.',
              tag: 'Leaflet GPS',
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
              title: 'Administrative Analytics',
              desc: 'Institution-wide attendance metrics, complaint turnaround analysis, and CSV export for accreditations.',
              tag: 'Analytics',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
              title: 'Role-Based Security & RLS',
              desc: 'Granular Row Level Security ensures students only access their records while faculty and admins have strict permissions.',
              tag: 'Security',
            },
            {
              icon: <Cpu className="w-6 h-6 text-blue-600" />,
              title: 'Dual-Mode DB Architecture',
              desc: 'Runs out-of-the-box in local reactive mode or connects seamlessly to Supabase PostgreSQL with 1-click migrations.',
              tag: 'PostgreSQL',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                  {feature.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {feature.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              End-to-End Workflow
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              How CampusOne Solves the Daily Bottlenecks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Unified Authentication
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Students, faculty, and administrators sign in with role-tailored dashboards. Public signups can never elevate to administrator privileges.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Automated Actions & Verification
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Attendance QR tokens expire dynamically. Complaint SLA timers begin upon submission. Timetable conflicts are detected prior to scheduling.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Intelligent Assistance & Analytics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                CampusAI answers students with citations from official handbook rules and live timetables. Admins export verified reports for audit compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Demonstration Showcase for Judges */}
      <section id="demo" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Interactive Hackathon Demo Mode
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
              Ready to test CampusOne live?
            </h2>
            <p className="mt-4 text-sm text-indigo-200 leading-relaxed">
              Use the one-click demo presets below to jump directly into the full persona dashboards. No registration or manual credential setup required.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => handleDemoAccess('student')}
                className="px-5 py-3 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Launch Student Mode (Aarav Sharma)
              </button>
              <button
                onClick={() => handleDemoAccess('faculty')}
                className="px-5 py-3 rounded-xl bg-indigo-800/80 hover:bg-indigo-700/80 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-indigo-700"
              >
                <Users className="w-4 h-4 text-indigo-300" />
                Launch Faculty Mode (Dr. Priya Sengupta)
              </button>
              <button
                onClick={() => handleDemoAccess('admin')}
                className="px-5 py-3 rounded-xl bg-indigo-800/80 hover:bg-indigo-700/80 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-indigo-700"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-300" />
                Launch Admin Mode (Dr. Rajesh Verma)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">CampusOne Management Platform</span>
          </div>
          <p className="text-xs text-slate-500">
            Hackathon 2026 Project: "How technology simplifies everyday campus life."
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <Link to="/login" className="hover:text-indigo-600">Login</Link>
            <Link to="/register" className="hover:text-indigo-600">Register</Link>
            <Link to="/ai" className="hover:text-indigo-600">CampusAI</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
