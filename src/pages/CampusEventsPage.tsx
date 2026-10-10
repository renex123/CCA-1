import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import { CampusEvent, EventRegistration } from '../types';
import {
  PartyPopper,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Ticket,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import confetti from 'canvas-confetti';

export const CampusEventsPage: React.FC = () => {
  const { user, role } = useAuth();
  const [, setTick] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CampusEvent['category']>('tech');
  const [venue, setVenue] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [capacity, setCapacity] = useState('150');

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  if (!user) return null;

  const events = db.getEvents();
  const registrations = db.getEventRegistrations(user.id);

  const handleRegister = (event: CampusEvent) => {
    const res = db.registerForEvent(event.id, user);
    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      alert(`Registration confirmed! Your ticket pass code is: ${res.registration?.ticket_code}`);
    } else {
      alert(res.message);
    }
  };

  const handleCancelRegistration = (eventId: string) => {
    if (window.confirm('Are you sure you want to cancel your pass registration?')) {
      db.cancelEventRegistration(eventId, user.id);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue) return;

    db.createEvent(
      {
        title,
        description,
        category,
        organizer: organizer || 'CampusOne Student Council',
        venue,
        date_time: new Date(dateTime || Date.now() + 86400000 * 7).toISOString(),
        registration_deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
        capacity: Number(capacity),
        banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
      },
      user
    );

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
    setVenue('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campus Events, Symposiums & Hackathons
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover student activities • Verified digital event passes • Seat capacity tracking
          </p>
        </div>

        {role === 'admin' && (
          <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Create New Event
          </Button>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => {
          const isRegistered = registrations.some(
            (r) => r.event_id === evt.id && r.status === 'confirmed'
          );
          const isFull = evt.registered_count >= evt.capacity;

          return (
            <Card key={evt.id} className="overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={evt.banner_url}
                  alt={evt.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="primary" size="sm">{evt.category.toUpperCase()}</Badge>
                  {isRegistered && (
                    <Badge variant="success" size="sm">✓ Pass Registered</Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {evt.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{new Date(evt.date_time).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>
                      {evt.registered_count} / {evt.capacity} registered
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, (evt.registered_count / evt.capacity) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  {isRegistered ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleCancelRegistration(evt.id)}
                    >
                      Cancel Registration
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      disabled={isFull}
                      onClick={() => handleRegister(evt)}
                      leftIcon={<Ticket className="w-3.5 h-3.5" />}
                    >
                      {isFull ? 'Sold Out' : 'Register for Pass'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Admin Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Publish Official Campus Event"
        description="Event will be visible across the portal with automatic pass generation."
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Event Title"
            placeholder="e.g. AI Innovation Summit 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Event Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CampusEvent['category'])}
            >
              <option value="tech">Technology & Coding</option>
              <option value="seminar">Academic Seminar</option>
              <option value="cultural">Cultural Festival</option>
              <option value="sports">Athletics & Sports</option>
              <option value="workshop">Hands-On Workshop</option>
              <option value="placement">Placement & Careers</option>
            </Select>

            <Input
              label="Auditorium / Venue"
              placeholder="e.g. Main Auditorium (5th Floor)"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Event Date & Time"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
            <Input
              label="Maximum Seating Capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Event Description"
            placeholder="Details about keynote speakers, schedule, eligibility..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
