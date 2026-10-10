import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, BookOpen, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/dbStore';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const facilities = db.getFacilities();
  const announcements = db.getAnnouncements();
  const subjects = db.getSubjects();
  const events = db.getEvents();

  const filteredFacilities = facilities.filter(
    (f) => f.name.toLowerCase().includes(query.toLowerCase()) || f.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredAnnouncements = announcements.filter(
    (a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredSubjects = subjects.filter(
    (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredEvents = events.filter(
    (e) => e.title.toLowerCase().includes(query.toLowerCase()) || e.venue.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const quickPages = [
    { label: 'Timetable', path: '/timetable', icon: Calendar },
    { label: 'Attendance Management', path: '/attendance', icon: BookOpen },
    { label: 'Campus Map & Directory', path: '/map', icon: MapPin },
    { label: 'Lodge Complaint', path: '/complaints', icon: AlertCircle },
    { label: 'Ask CampusAI', path: '/ai', icon: Sparkles },
  ];

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search campus facilities, courses, notices, events (or jump to a page)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full px-3 py-3.5 text-sm bg-transparent border-0 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {!query && (
            <div>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Quick Navigation
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {quickPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.path}
                      onClick={() => handleSelect(page.path)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {page.label}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {query && (
            <>
              {filteredFacilities.length > 0 && (
                <div>
                  <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Campus Facilities & Labs
                  </p>
                  {filteredFacilities.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => handleSelect('/map')}
                      className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {f.name}
                        </p>
                        <p className="text-[11px] text-slate-500">{f.building} • {f.floor}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {f.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {filteredAnnouncements.length > 0 && (
                <div>
                  <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Announcements
                  </p>
                  {filteredAnnouncements.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => handleSelect('/announcements')}
                      className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {a.title}
                        </p>
                        <p className="text-[11px] text-slate-500">Notice • {a.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredSubjects.length > 0 && (
                <div>
                  <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Subjects & Courses
                  </p>
                  {filteredSubjects.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleSelect('/timetable')}
                      className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {s.name} ({s.code})
                        </p>
                        <p className="text-[11px] text-slate-500">Semester {s.semester} • {s.credits} Credits</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredEvents.length > 0 && (
                <div>
                  <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Campus Events
                  </p>
                  {filteredEvents.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => handleSelect('/events')}
                      className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {e.title}
                        </p>
                        <p className="text-[11px] text-slate-500">{e.venue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search CampusOne database</span>
          <span>Tip: Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
