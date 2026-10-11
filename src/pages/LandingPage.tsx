import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  Sun,
  Moon,
  Play,
  Award,
  ChevronRight,
  X,
  ExternalLink,
  Check,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Clean decorative dot matrix pattern in the exact #652B7C imperial purple swatch
const DotGrid: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="130" height="90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <pattern id="dot-grid-pattern-plum" x="0" y="0" width="13" height="13" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.75" className="fill-[#652b7c]/40 dark:fill-[#c27de2]/30" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#dot-grid-pattern-plum)" />
  </svg>
);

export const LandingPage: React.FC = () => {
  const { quickSwitchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [activeTourTab, setActiveTourTab] = useState<'student' | 'faculty' | 'admin'>('student');

  const handleDemoAccess = (role: 'student' | 'faculty' | 'admin') => {
    quickSwitchRole(role);
    if (role === 'admin') navigate('/dashboard/admin');
    else if (role === 'faculty') navigate('/dashboard/faculty');
    else navigate('/dashboard/student');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#652b7c] selection:text-white">
      {/* Top Institutional Notification Bar */}
      <div className="bg-[#15071b] dark:bg-[#0d0411] text-[#edd5f5] text-[11px] py-1.5 px-4 text-center border-b border-[#3b1549] flex items-center justify-center gap-3">
        <span className="font-semibold text-white">BPUT Affiliated Autonomous Colleges</span>
        <span className="text-[#a84acb]/40">•</span>
        <span>Spring Semester 2026 Academic Operations</span>
        <span className="text-[#a84acb]/40 hidden sm:inline">•</span>
        <span className="hidden sm:inline text-[#e4b5ef] font-medium">Digital Campus Portal Active</span>
      </div>

      {/* Main Navigation — Crisp White with #652B7C Accents */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0e0614]/95 backdrop-blur-md border-b border-[#f0daf5] dark:border-[#2a0e35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#652b7c] to-[#4e1e61] text-white flex items-center justify-center font-bold text-base shadow-md shadow-[#652b7c]/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  Campus<span className="text-[#652b7c] dark:text-[#c27de2]">One</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#fbf3fc] dark:bg-[#250d2f] text-[#652b7c] dark:text-[#c27de2] border border-[#ebd0f3] dark:border-[#4b1d5c]">
                  Institutional OS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                Integrated Campus Management System
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600 dark:text-slate-300">
            <a href="#gallery" className="hover:text-[#652b7c] dark:hover:text-[#c27de2] transition-colors">
              Campus Life
            </a>
            <a href="#modules" className="hover:text-[#652b7c] dark:hover:text-[#c27de2] transition-colors">
              Core Modules
            </a>
            <a href="#workflows" className="hover:text-[#652b7c] dark:hover:text-[#c27de2] transition-colors">
              Administrative Workflows
            </a>
            <a href="#live-demo" className="hover:text-[#652b7c] dark:hover:text-[#c27de2] transition-colors">
              Role Access
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-[#652b7c] hover:bg-[#faf0fc] dark:text-slate-400 dark:hover:text-[#c27de2] dark:hover:bg-[#250d2f]/50 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#652b7c]" />
              )}
            </button>
            <Link to="/login">
              <button className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#652b7c] hover:bg-[#faf0fc] dark:hover:text-[#c27de2] dark:hover:bg-[#250d2f]/50 transition-colors cursor-pointer">
                Staff & Student Login
              </button>
            </Link>
            <button
              onClick={() => handleDemoAccess('student')}
              className="px-5 py-2.5 rounded-full bg-[#652b7c] hover:bg-[#522165] text-white text-xs font-semibold shadow-md shadow-[#652b7c]/25 transition-all cursor-pointer active:scale-95"
            >
              Launch Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section — Clean White & Custom Swatch #652B7C Mesh Blend */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#faf0fc]/90 via-white to-[#f5e1f8]/70 dark:from-[#16071e] dark:via-[#0c0411] dark:to-[#0b0f17] border-b border-[#f0daf5] dark:border-[#2a0e35] pt-10 pb-16 lg:py-20">
        {/* Soft Ambient Light Orbs with #652B7C */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#652b7c]/15 dark:bg-[#652b7c]/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#8534a4]/10 dark:bg-[#652b7c]/20 blur-2xl pointer-events-none" />

        {/* Background Dot Matrix Accents */}
        <div className="absolute top-6 right-6 lg:right-16 pointer-events-none opacity-80">
          <DotGrid />
        </div>
        <div className="absolute bottom-6 left-6 pointer-events-none opacity-70">
          <DotGrid />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Breadcrumb, Headline, Trust Card, Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Breadcrumbs */}
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#652b7c] dark:text-[#c27de2]">
                <span>PORTAL</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9e55b9]" />
                <span>ACADEMICS</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9e55b9]" />
                <span>SMART CAMPUS</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9e55b9]" />
                <span className="text-[#3a1347] dark:text-[#eedaf3] font-extrabold">HIGHER EDUCATION</span>
              </div>

              {/* Main Headline — Crisp White and #652B7C Blend */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.12]">
                One Campus.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#652b7c] via-[#8534a4] to-[#a84acb] dark:from-[#d598ef] dark:via-[#c27de2] dark:to-[#e8baf9]">
                  Smarter Possibilities.
                </span>
              </h1>

              {/* Subheading / Description */}
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                A centralized digital platform connecting students, faculty, and college administrators. Replaces paper certificates, manual attendance registers, disjointed notice boards, and room scheduling conflicts with verified cryptographic records.
              </p>

              {/* Insights & Trust Badge in White & #652B7C Blend */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#15071f]/90 backdrop-blur-md border-2 border-[#ebd0f3] dark:border-[#4b1d5c] shadow-md shadow-[#652b7c]/5 flex items-center gap-3.5 max-w-xl">
                <div className="w-9 h-9 rounded-xl bg-[#fbf3fc] dark:bg-[#280c34] text-[#652b7c] dark:text-[#c27de2] flex items-center justify-center shrink-0 border border-[#ebd0f3] dark:border-[#521b65]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#3a1347] dark:text-[#eedaf3]">
                    OPERATIONAL TELEMETRY FOR SPRING SEMESTER 2026
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Supporting 16,000+ enrolled students, 450+ faculty, and 23 autonomous departments.
                  </p>
                </div>
              </div>

              {/* Action Buttons — Pill/Capsule Styling matching user's reference */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Exact "Admission Website" pill button from user's reference */}
                  <button
                    onClick={() => setIsAdmissionModalOpen(true)}
                    className="px-8 py-3.5 rounded-full bg-[#652b7c] hover:bg-[#522165] text-white text-sm sm:text-base font-medium shadow-md shadow-[#652b7c]/25 hover:shadow-lg hover:shadow-[#652b7c]/35 transition-all flex items-center justify-center cursor-pointer active:scale-95 tracking-normal"
                  >
                    Admission Website
                  </button>

                  <button
                    onClick={() => handleDemoAccess('student')}
                    className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#652b7c] to-[#783093] hover:from-[#522165] hover:to-[#652b7c] text-white text-sm font-semibold shadow-lg shadow-[#652b7c]/30 hover:shadow-xl hover:shadow-[#652b7c]/40 transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
                  >
                    <span>Explore CampusOne Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsTourModalOpen(true)}
                    className="px-6 py-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-[#652b7c]/50 dark:border-[#652b7c]/70 hover:bg-[#fcf7fd] dark:hover:bg-[#250d2f]/50 text-[#652b7c] dark:text-[#c27de2] text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-[#652b7c] text-[#652b7c] dark:fill-[#c27de2] dark:text-[#c27de2]" />
                    <span>Watch Interactive Tour</span>
                  </button>
                </div>

                {/* Direct Persona Jump Links in Crisp White with #652B7C Borders */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">1-Click Personas:</span>
                  <button
                    onClick={() => handleDemoAccess('student')}
                    className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:border-[#652b7c] hover:text-[#652b7c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    🎓 Student (Aarav)
                  </button>
                  <button
                    onClick={() => handleDemoAccess('faculty')}
                    className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:border-[#652b7c] hover:text-[#652b7c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    👩‍🏫 Faculty (Dr. Priya)
                  </button>
                  <button
                    onClick={() => handleDemoAccess('admin')}
                    className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:border-[#652b7c] hover:text-[#652b7c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    🏛️ Dean (Dr. Rajesh)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Organic Shaped Campus Photo in #652B7C Frame with White Cards */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              {/* Soft Glowing Decorative Disc in Background */}
              <div className="absolute -bottom-6 -right-4 w-44 h-44 rounded-full bg-gradient-to-tr from-[#652b7c]/50 via-[#8534a4]/40 to-white blur-xl -z-0 pointer-events-none" />

              {/* Organic Curved Photo Container in Crisp #652B7C Frame */}
              <div className="relative z-10 w-full max-w-[460px] aspect-[4/3] sm:aspect-[1.15/1] rounded-[2.5rem] lg:rounded-[3rem] border-4 border-[#652b7c] dark:border-[#8534a4] shadow-2xl shadow-[#652b7c]/30 overflow-hidden bg-[#faf0fc] dark:bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80"
                  alt="University students collaborating happily outdoors on campus"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle dark vignette gradient at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#15071b]/70 via-transparent to-black/20 pointer-events-none" />

                {/* Top Floating Badge in Crisp White with #652B7C Accent */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border-2 border-[#ebd0f3] dark:border-[#4b1d5c] shadow-md flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#652b7c] animate-pulse" />
                  <span className="text-[11px] font-bold text-[#3a1347] dark:text-[#eedaf3]">
                    Spring 2026 Live Session
                  </span>
                </div>

                {/* Center Interactive Tour Play Button — Pure White with #652B7C Icon */}
                <button
                  onClick={() => setIsTourModalOpen(true)}
                  className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-[#652b7c] shadow-2xl shadow-[#652b7c]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer group ring-4 ring-[#ebd0f3] dark:ring-[#521b65]"
                  aria-label="Play Interactive Campus Platform Tour"
                  title="Click to view interactive platform walkthrough"
                >
                  <Play className="w-7 h-7 fill-[#652b7c] ml-1 group-hover:scale-110 transition-transform" />
                </button>

                {/* Bottom Floating Telemetry Card in Crisp White & #652B7C Pill */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border-2 border-[#ebd0f3] dark:border-[#4b1d5c] shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                        className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                        alt="Student Aarav"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80"
                        className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                        alt="Faculty Dr Priya"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80"
                        className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                        alt="Dean Dr Rajesh"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                        94.2% Attendance Verified
                      </p>
                      <p className="text-[9px] text-slate-500 dark:text-slate-400">
                        1,480 check-ins recorded today
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#fbf3fc] dark:bg-[#250d2f] text-[#652b7c] dark:text-[#c27de2]">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Metrics Counter Bar — White & #652B7C Blend */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-gradient-to-br from-white via-white to-[#fbf3fc] dark:from-slate-900 dark:to-slate-900 border-2 border-[#ebd0f3] dark:border-[#3b1549] shadow-md shadow-[#652b7c]/5">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#652b7c] dark:text-[#c27de2]">16,000+</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Enrolled Students</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#652b7c] dark:text-[#c27de2]">94.2%</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Verified QR Attendance</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#652b7c] dark:text-[#c27de2]">&lt; 4.7 hrs</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Avg Grievance SLA</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#652b7c] dark:text-[#c27de2]">100%</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Paperless Bonafide Certs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Life & Facilities Bento Photo Grid Section */}
      <section id="gallery" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b0f17]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#652b7c] dark:text-[#c27de2]">
              <Sparkles className="w-4 h-4 text-[#652b7c]" />
              <span>Campus Life & Facilities in Action</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white mt-1">
              Connected Spaces. Empowered Students.
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              See how everyday learning spaces, laboratories, and administrative desks connect in real-time across the university.
            </p>
          </div>
          <button
            onClick={() => handleDemoAccess('student')}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-[#652b7c] hover:bg-[#522165] text-white text-xs font-bold shadow-md shadow-[#652b7c]/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Campus Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6-Card Responsive Bento Grid with Real University Photography & #652B7C Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Smart Lecture Theatres (Spans 2 columns on wide screens) */}
          <div className="lg:col-span-2 group relative rounded-3xl overflow-hidden border-2 border-[#ebd0f3] dark:border-[#3b1549] bg-slate-900 shadow-sm min-h-[320px] flex flex-col justify-end p-6 sm:p-8">
            <img
              src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1000&auto=format&fit=crop&q=80"
              alt="Grand university lecture theater"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15071b] via-[#15071b]/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#652b7c] text-white shadow-sm shadow-[#652b7c]/30">
                  Academic Timetable
                </span>
                <span className="text-xs text-[#edd5f5] font-medium">42 Connected Halls</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Smart Lecture Halls & Theatres
              </h3>
              <p className="text-xs sm:text-sm text-[#edd5f5]/90 max-w-xl leading-relaxed">
                Automated scheduling engine cross-checks faculty availability and classroom capacities in real time, preventing double-bookings before schedules are published.
              </p>
            </div>
          </div>

          {/* Card 2: Central University Library */}
          <div className="group relative rounded-3xl overflow-hidden border-2 border-[#ebd0f3] dark:border-[#3b1549] bg-slate-900 shadow-sm min-h-[320px] flex flex-col justify-end p-6 sm:p-8">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80"
              alt="University central library and study hall"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15071b] via-[#15071b]/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#652b7c] text-white shadow-sm shadow-[#652b7c]/30">
                Digital Services
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Central Library & Commons
              </h3>
              <p className="text-xs text-[#edd5f5]/90 leading-relaxed">
                Instant digital bonafide certificates, contactless RFID card replacements, and quiet zone directory with live hours.
              </p>
            </div>
          </div>

          {/* Card 3: Hackathons & Student Innovation */}
          <div className="group relative rounded-3xl overflow-hidden border-2 border-[#ebd0f3] dark:border-[#3b1549] bg-slate-900 shadow-sm min-h-[320px] flex flex-col justify-end p-6 sm:p-8">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80"
              alt="Students collaborating at hackathon"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15071b] via-[#15071b]/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#652b7c] text-white shadow-sm shadow-[#652b7c]/30">
                Campus Events
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                National Hackathons & Tech Clubs
              </h3>
              <p className="text-xs text-[#edd5f5]/90 leading-relaxed">
                Register for university hackathons, technical symposiums, and cultural fests with one click. Team registration with instant passes.
              </p>
            </div>
          </div>

          {/* Card 4: Dynamic QR Attendance In Action */}
          <div className="group relative rounded-3xl overflow-hidden border-2 border-[#ebd0f3] dark:border-[#3b1549] bg-slate-900 shadow-sm min-h-[320px] flex flex-col justify-end p-6 sm:p-8">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80"
              alt="Faculty and students in interactive class"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15071b] via-[#15071b]/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#652b7c] text-white shadow-sm shadow-[#652b7c]/30">
                Fraud Resistant
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Dynamic QR Attendance
              </h3>
              <p className="text-xs text-[#edd5f5]/90 leading-relaxed">
                60-second time-limited QR codes projected in class. Server validates active rosters and timestamps, preventing proxy attendance.
              </p>
            </div>
          </div>

          {/* Card 5: Campus Directory & Green Walkways */}
          <div className="group relative rounded-3xl overflow-hidden border-2 border-[#ebd0f3] dark:border-[#3b1549] bg-slate-900 shadow-sm min-h-[320px] flex flex-col justify-end p-6 sm:p-8">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80"
              alt="Historic brick college campus walkway"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15071b] via-[#15071b]/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#652b7c] text-white shadow-sm shadow-[#652b7c]/30">
                Leaflet GPS
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Interactive Campus Directory
              </h3>
              <p className="text-xs text-[#edd5f5]/90 leading-relaxed">
                Searchable GPS map with 8 key facilities, administrative blocks, academic centers, and university health infirmary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Operational Modules — Clean White Background with #652B7C Accents */}
      <section id="modules" className="py-16 bg-gradient-to-b from-white via-[#faf0fc]/40 to-white dark:from-slate-900 dark:via-[#15071b] dark:to-slate-900 border-y border-[#ebd0f3] dark:border-[#3b1549]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[#652b7c] dark:text-[#c27de2]">
              System Architecture
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
                className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-[#ebd0f3]/70 dark:border-slate-800 hover:border-[#652b7c] dark:hover:border-[#8534a4] hover:shadow-xl hover:shadow-[#652b7c]/10 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 group-hover:text-[#652b7c] dark:group-hover:text-[#c27de2] transition-colors">
                      {m.code}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#fbf3fc] dark:bg-[#250d2f] text-[#652b7c] dark:text-[#c27de2] border border-[#ebd0f3] dark:border-[#4b1d5c]">
                      {m.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#4a185c] dark:group-hover:text-[#eedaf3] transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Administrative Workflows */}
      <section id="workflows" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0b0f17]">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#652b7c] dark:text-[#c27de2]">
            End-to-End Governance
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            How CampusOne Replaces Fragmented University Systems
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border-2 border-[#ebd0f3]/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-[#652b7c] dark:hover:border-[#8534a4] transition-colors">
            <span className="text-xs font-mono font-bold text-[#652b7c] dark:text-[#c27de2]">STEP 01</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
              Authentication & Role Boundaries
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Students and faculty sign in with institutional credentials. Public registration is strictly restricted—administrator roles can never be self-assigned.
            </p>
          </div>

          <div className="p-6 rounded-2xl border-2 border-[#ebd0f3]/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-[#652b7c] dark:hover:border-[#8534a4] transition-colors">
            <span className="text-xs font-mono font-bold text-[#652b7c] dark:text-[#c27de2]">STEP 02</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
              Real-Time Validation & Processing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Attendance records verify timestamps against active faculty windows. Grievance tickets route automatically to relevant maintenance engineering desks.
            </p>
          </div>

          <div className="p-6 rounded-2xl border-2 border-[#ebd0f3]/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-[#652b7c] dark:hover:border-[#8534a4] transition-colors">
            <span className="text-xs font-mono font-bold text-[#652b7c] dark:text-[#c27de2]">STEP 03</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
              Audited Telemetry & Accreditation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Privileged actions are recorded in immutable audit logs. Administrative reports export directly to CSV format for statutory NAAC/NIRF accreditation audits.
            </p>
          </div>
        </div>
      </section>

      {/* Role Access / Demo Presets — Deep #652B7C & White Contrast */}
      <section id="live-demo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#200929] via-[#331141] to-[#16051d] text-white border-2 border-[#652b7c]/80 shadow-2xl shadow-[#652b7c]/35">
          <div className="max-w-3xl">
            <p className="text-xs font-mono uppercase tracking-widest text-[#d598ef] font-bold">
              Evaluation & Judging Console
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-white">
              Test CampusOne Workflows Live
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#ebd0f3]/85 leading-relaxed">
              Use the presets below to jump directly into each persona. The persistent database engine preserves your test actions (marking attendance, resolving tickets, generating certificates) across browser sessions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => handleDemoAccess('student')}
                className="px-6 py-3.5 rounded-full bg-white text-[#3a1347] text-xs font-bold hover:bg-[#fbf3fc] transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-white/10 active:scale-95"
              >
                <GraduationCap className="w-4 h-4 text-[#652b7c]" />
                Student: Aarav Sharma (23CSE104)
              </button>
              <button
                onClick={() => handleDemoAccess('faculty')}
                className="px-6 py-3.5 rounded-full bg-[#522165]/80 hover:bg-[#652b7c] text-white border border-[#8534a4]/60 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Users className="w-4 h-4 text-[#d598ef]" />
                Faculty: Dr. Priya Sengupta
              </button>
              <button
                onClick={() => handleDemoAccess('admin')}
                className="px-6 py-3.5 rounded-full bg-[#522165]/80 hover:bg-[#652b7c] text-white border border-[#8534a4]/60 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-[#d598ef]" />
                Admin: Dr. Rajesh Verma (Dean)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer in Crisp White and #652B7C */}
      <footer className="border-t border-[#ebd0f3] dark:border-[#2a0e35] py-12 bg-white dark:bg-[#0c0411] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#652b7c] text-white flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100">Campus<span className="text-[#652b7c] dark:text-[#c27de2]">One</span></span>
              <span className="text-slate-400 ml-1.5">• Digital Campus Operating System</span>
            </div>
          </div>
          <p className="text-slate-500">National Smart Campus Hackathon 2026 • BPUT Affiliated Autonomous Colleges</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-[#652b7c] dark:hover:text-[#c27de2] transition-colors">Portal Login</Link>
            <Link to="/map" className="hover:text-[#652b7c] dark:hover:text-[#c27de2] transition-colors">Campus Directory</Link>
            <Link to="/ai" className="hover:text-[#652b7c] dark:hover:text-[#c27de2] transition-colors">Handbook Assistant</Link>
          </div>
        </div>
      </footer>

      {/* Interactive Platform Tour Modal (Triggered by Play Button in Hero) */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#15071f] border-2 border-[#ebd0f3] dark:border-[#4b1d5c] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsTourModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-[#652b7c] dark:hover:text-[#c27de2] hover:bg-[#faf0fc] dark:hover:bg-[#250d2f]/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#652b7c] dark:text-[#c27de2] mb-1">
              <Play className="w-4 h-4 fill-[#652b7c] text-[#652b7c]" />
              <span>Interactive Platform Walkthrough</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
              CampusOne 5-Stage Verification Tour
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Select a persona below to see how end-to-end workflows execute in the portal:
            </p>

            {/* Persona Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#faf0fc] dark:bg-[#250d2f]/50 mb-6">
              {[
                { id: 'student', label: 'Student Persona', sub: 'Aarav Sharma' },
                { id: 'faculty', label: 'Faculty Persona', sub: 'Dr. Priya Sengupta' },
                { id: 'admin', label: 'Dean / Admin', sub: 'Dr. Rajesh Verma' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTourTab(tab.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    activeTourTab === tab.id
                      ? 'bg-white dark:bg-slate-900 text-[#652b7c] dark:text-[#c27de2] shadow-sm border border-[#ebd0f3] dark:border-[#4b1d5c]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#652b7c]'
                  }`}
                >
                  <div>{tab.label}</div>
                  <div className="text-[10px] font-normal opacity-75">{tab.sub}</div>
                </button>
              ))}
            </div>

            {/* Tab Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-[#ebd0f3]/70 dark:border-[#3b1549] space-y-3 mb-6 text-xs text-slate-700 dark:text-slate-300">
              {activeTourTab === 'student' && (
                <>
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#652b7c]" />
                    <span>Student Capabilities:</span>
                  </div>
                  <p>• Scan live QR code or submit 6-digit session PIN to check in to lectures.</p>
                  <p>• Lodge maintenance grievances with photo upload and track live technician SLAs.</p>
                  <p>• Apply for official Bonafide Certificates with verifiable QR verification stamps.</p>
                  <p>• Chat with CampusAI for schedule queries, library regulations, and exam dates.</p>
                </>
              )}

              {activeTourTab === 'faculty' && (
                <>
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#652b7c]" />
                    <span>Faculty Capabilities:</span>
                  </div>
                  <p>• Broadcast live 60-second QR sessions to lecture hall projector screens.</p>
                  <p>• Live roster display shows enrolled students checking in in real time.</p>
                  <p>• Post authorized department circulars directly to student feeds.</p>
                  <p>• Manage class rosters and grade submission deadlines.</p>
                </>
              )}

              {activeTourTab === 'admin' && (
                <>
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#652b7c]" />
                    <span>Administrator Governance:</span>
                  </div>
                  <p>• Timetable conflict detector flags overlapping rooms and faculty before commits.</p>
                  <p>• Assign technicians to student grievances and enforce resolution deadlines.</p>
                  <p>• Manage university department directories, courses, and faculty rosters.</p>
                  <p>• Generate NAAC / NIRF accreditation CSV audit reports with one click.</p>
                </>
              )}
            </div>

            {/* Direct Launch CTA */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsTourModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                Close Walkthrough
              </button>
              <button
                onClick={() => {
                  setIsTourModalOpen(false);
                  handleDemoAccess(activeTourTab);
                }}
                className="px-6 py-2.5 rounded-full bg-[#652b7c] hover:bg-[#522165] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#652b7c]/25 active:scale-95"
              >
                <span>Launch As {activeTourTab === 'student' ? 'Student' : activeTourTab === 'faculty' ? 'Faculty' : 'Admin'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admission Website Modal (Triggered by 'Admission Website' Pill Button) */}
      {isAdmissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#15071f] border-2 border-[#ebd0f3] dark:border-[#4b1d5c] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAdmissionModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#652b7c] dark:hover:text-[#c27de2] hover:bg-[#faf0fc] dark:hover:bg-[#250d2f]/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#652b7c] dark:text-[#c27de2] mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Year 2026–2027 Admissions</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
              Autonomous Campus Admissions Portal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              BPUT Affiliated Autonomous Engineering & Management Colleges • Direct Counseling & Merit Allotment
            </p>

            {/* Program Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-[#faf0fc] dark:bg-[#250d2f]/50 border border-[#ebd0f3] dark:border-[#4b1d5c]">
                <div className="text-xs font-bold text-[#652b7c] dark:text-[#c27de2]">Undergraduate (B.Tech)</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 space-y-0.5">
                  <p>• Computer Science & Engineering (180 seats)</p>
                  <p>• Artificial Intelligence & ML (120 seats)</p>
                  <p>• Electronics & Communication (120 seats)</p>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#faf0fc] dark:bg-[#250d2f]/50 border border-[#ebd0f3] dark:border-[#4b1d5c]">
                <div className="text-xs font-bold text-[#652b7c] dark:text-[#c27de2]">Postgraduate (M.Tech / MBA / MCA)</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 space-y-0.5">
                  <p>• M.Tech Computer Science & VLSI</p>
                  <p>• Master of Business Administration</p>
                  <p>• Master of Computer Applications</p>
                </div>
              </div>
            </div>

            {/* Admission Metrics */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-[#ebd0f3]/70 dark:border-[#3b1549] space-y-2 mb-6 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-[#652b7c]" />
                <span>Eligibility & Selection Process:</span>
              </div>
              <p>• Valid JEE (Main) / OJEE rank required for B.Tech admission counseling.</p>
              <p>• Merit scholarship waivers up to 100% available for top 100 state rank holders.</p>
              <p>• Verified document scrutiny and Bonafide certificates issued via CampusOne portal.</p>
            </div>

            {/* Action Buttons — Pill Style */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setIsAdmissionModalOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  setIsAdmissionModalOpen(false);
                  handleDemoAccess('student');
                }}
                className="px-8 py-3 rounded-full bg-[#652b7c] hover:bg-[#522165] text-white text-xs sm:text-sm font-medium transition-all shadow-md shadow-[#652b7c]/25 active:scale-95 cursor-pointer"
              >
                Enter Student Portal Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
