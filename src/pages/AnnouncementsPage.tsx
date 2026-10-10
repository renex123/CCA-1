import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import { Announcement } from '../types';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Pin,
  AlertTriangle,
  Calendar,
  Sparkles,
  BookOpen,
  Clock,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';

export const AnnouncementsPage: React.FC = () => {
  const { user, role } = useAuth();
  const [, setTick] = useState(0);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Publish Announcement Modal
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('academic');
  const [priority, setPriority] = useState<Announcement['priority']>('normal');
  const [targetAudience, setTargetAudience] = useState<Announcement['target_audience']>('all');

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  if (!user) return null;

  const announcements = db.getAnnouncements();

  const filtered = announcements.filter((a) => {
    const matchCat = categoryFilter === 'all' || a.category === categoryFilter;
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.publisher_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    db.createAnnouncement(
      {
        title,
        content,
        category,
        priority,
        publisher_id: user.id,
        publisher_name: user.full_name,
        publisher_role: role === 'faculty' ? 'Assoc. Professor' : 'Dean / Admin Desk',
        target_audience: targetAudience,
      },
      user
    );

    setIsPublishModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campus Announcements & Official Notices
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified university bulletins • Audience-targeted broadcasts • In-app alert dispatch
          </p>
        </div>

        {(role === 'admin' || role === 'faculty') && (
          <Button onClick={() => setIsPublishModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Publish Official Notice
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search announcements, examination circulars, notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          <option value="exam">Examination Circulars</option>
          <option value="academic">Academic Notices</option>
          <option value="events">Events & Hackathons</option>
          <option value="emergency">Emergency Alerts</option>
          <option value="holiday">Campus Holidays</option>
        </select>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className={`transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
              item.priority === 'urgent'
                ? 'border-l-4 border-l-rose-500'
                : item.priority === 'pinned'
                ? 'border-l-4 border-l-amber-500'
                : 'border-l-4 border-l-indigo-500'
            }`}
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  {item.priority === 'pinned' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      <Pin className="w-2.5 h-2.5" /> Pinned Notice
                    </span>
                  )}
                  {item.priority === 'urgent' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                      <AlertTriangle className="w-2.5 h-2.5" /> Urgent Bulletin
                    </span>
                  )}
                  <Badge variant="primary" size="sm">
                    {item.category.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">
                    Audience: {item.target_audience}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400">
                  {new Date(item.created_at).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  {item.publisher_name} ({item.publisher_role})
                </span>
                <span className="text-[10px]">Verified Dispatch</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Publish Modal */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Publish Official Campus Announcement"
        description="Notice will be pinned to student portals and generate automatic in-app alerts."
      >
        <form onSubmit={handlePublish} className="space-y-4">
          <Input
            label="Notice Title"
            placeholder="e.g. Mid-Semester Theory Examination Hall Tickets Available"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Announcement['category'])}
            >
              <option value="academic">Academic</option>
              <option value="exam">Examination</option>
              <option value="events">Campus Events</option>
              <option value="emergency">Emergency / Infrastructure</option>
              <option value="holiday">Holiday Notice</option>
            </Select>

            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Announcement['priority'])}
            >
              <option value="normal">Normal Bulletin</option>
              <option value="pinned">Pinned to Top</option>
              <option value="urgent">Urgent Alert</option>
            </Select>
          </div>

          <Select
            label="Target Audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value as Announcement['target_audience'])}
          >
            <option value="all">Entire Campus Community</option>
            <option value="students">Students Only</option>
            <option value="faculty">Faculty Only</option>
          </Select>

          <Textarea
            label="Notice Announcement Body"
            placeholder="Enter full circular text with official guidelines..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsPublishModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Circular
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
