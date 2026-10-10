import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import {
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../types';
import {
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  User,
  MapPin,
  Camera,
  History,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';

export const ComplaintsPage: React.FC = () => {
  const { user, role } = useAuth();
  const [, setTick] = useState(0);

  // Filter states
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // New complaint form states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ComplaintCategory>('internet');
  const [newPriority, setNewPriority] = useState<ComplaintPriority>('high');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Admin resolution / update state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<ComplaintStatus>('acknowledged');
  const [updateAssignedDept, setUpdateAssignedDept] = useState('Campus IT & Networks');
  const [updateComment, setUpdateComment] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  if (!user) return null;

  const allComplaints = db.getComplaints();
  const complaints = (role === 'student' ? allComplaints.filter((c) => c.student_id === user.id) : allComplaints).filter(
    (c) => {
      const matchCat = filterCategory === 'all' || c.category === filterCategory;
      const matchStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchCat && matchStatus;
    }
  );

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation || !newDescription) {
      alert('Please fill out all required fields.');
      return;
    }

    db.createComplaint({
      student_id: user.id,
      student_name: user.full_name,
      student_dept: user.department_name || 'Computer Science & Engineering',
      student_enrollment: user.enrollment_no || '23CSE104',
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      campus_location: newLocation,
      description: newDescription,
      photo_url: newPhotoUrl || undefined,
      status: 'submitted',
    });

    setIsNewModalOpen(false);
    setNewTitle('');
    setNewLocation('');
    setNewDescription('');
    setNewPhotoUrl('');
  };

  const handleOpenUpdate = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    setUpdateAssignedDept(complaint.assigned_to_dept || 'Campus IT & Networks');
    setUpdateComment('');
    setResolutionNotes(complaint.resolution_notes || '');
    setIsUpdateModalOpen(true);
  };

  const handleSaveUpdate = () => {
    if (!selectedComplaint) return;
    db.updateComplaintStatus(
      selectedComplaint.id,
      updateStatus,
      user,
      updateComment || `Updated ticket status to ${updateStatus}`,
      updateAssignedDept,
      undefined,
      resolutionNotes
    );
    setIsUpdateModalOpen(false);
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'acknowledged':
        return <Badge variant="info">Acknowledged</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Submitted</Badge>;
    }
  };

  const getPriorityBadge = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive" size="sm">Urgent SLA</Badge>;
      case 'high':
        return <Badge variant="warning" size="sm">High Priority</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Digital Complaint & Grievance Portal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent resolution tracking • Multi-department SLAs • Audit history
          </p>
        </div>

        {role === 'student' && (
          <Button onClick={() => setIsNewModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Lodge New Complaint
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-44 text-xs py-1.5"
        >
          <option value="all">All Categories</option>
          <option value="internet">Internet & Wi-Fi</option>
          <option value="classroom_equipment">Classroom Equipment</option>
          <option value="water_supply">Water Supply</option>
          <option value="electricity">Electricity</option>
          <option value="cleanliness">Cleanliness</option>
          <option value="hostel">Hostel Facilities</option>
          <option value="library">Library Facilities</option>
        </Select>

        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-36 text-xs py-1.5"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </Select>

        <span className="text-xs text-slate-400 ml-auto mr-2">
          Showing {complaints.length} tickets
        </span>
      </div>

      {/* Complaints List Cards */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <Card className="p-12 text-center bg-slate-50 dark:bg-slate-900/40 border-dashed">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No complaints found
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              There are no matching complaints for the selected filters.
            </p>
          </Card>
        ) : (
          complaints.map((c) => (
            <Card key={c.id} className="transition-all hover:border-slate-300 dark:hover:border-slate-700">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {c.ticket_no}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {c.category.replace('_', ' ')}
                    </span>
                    {getPriorityBadge(c.priority)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      Logged {new Date(c.created_at).toLocaleDateString()}
                    </span>
                    {getStatusBadge(c.status)}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {c.campus_location}
                  </span>
                  <span>Student: <strong>{c.student_name}</strong> ({c.student_enrollment})</span>
                  {c.assigned_to_dept && (
                    <span className="text-indigo-600 dark:text-indigo-400">
                      Assigned to: <strong>{c.assigned_to_dept}</strong>
                    </span>
                  )}
                </div>

                {/* Resolution Notes (if resolved) */}
                {c.resolution_notes && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                    <strong>Official Resolution:</strong> {c.resolution_notes}
                  </div>
                )}

                {/* History / Audit trail accordion */}
                {c.history && c.history.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Resolution Timeline & Status History
                    </p>
                    <div className="space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                      {c.history.map((h) => (
                        <div key={h.id} className="text-xs text-slate-500 dark:text-slate-400 pl-2">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {h.updated_by_name}
                          </span>{' '}
                          marked as <span className="font-mono text-indigo-600">{h.new_status}</span>: "{h.comment}"
                          <span className="text-[10px] text-slate-400 ml-2">
                            ({new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Update Button */}
                {role === 'admin' && (
                  <div className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenUpdate(c)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Process / Update Status
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Student: New Complaint Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Submit Campus Issue or Complaint"
        description="Provide details and location. A ticket will be routed to the respective department with SLA tracking."
      >
        <form onSubmit={handleCreateComplaint} className="space-y-4">
          <Input
            label="Complaint Title"
            placeholder="e.g. Wi-Fi router disconnection in Central Library"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as ComplaintCategory)}
            >
              <option value="internet">Internet & Wi-Fi</option>
              <option value="classroom_equipment">Classroom Equipment</option>
              <option value="water_supply">Water Supply</option>
              <option value="electricity">Electricity</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="hostel">Hostel Facilities</option>
              <option value="library">Library Facilities</option>
              <option value="other">Other Issues</option>
            </Select>

            <Select
              label="Priority Level"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as ComplaintPriority)}
            >
              <option value="low">Low (Standard repair)</option>
              <option value="medium">Medium (Within 24-48h)</option>
              <option value="high">High (Within 12h)</option>
              <option value="urgent">Urgent (Emergency 2h)</option>
            </Select>
          </div>

          <Input
            label="Specific Campus Location"
            placeholder="e.g. Central Library, 2nd Floor Digital Lab"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            required
          />

          <Textarea
            label="Detailed Description"
            placeholder="Describe what is failing, error messages seen, and impact..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            required
          />

          <Input
            label="Optional Photo Attachment URL"
            placeholder="https://example.com/photo.jpg"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* Admin: Update Ticket Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Update Ticket: ${selectedComplaint?.ticket_no}`}
        description="Assign departments, update progress, or mark ticket resolved with official notes."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveUpdate}>
              Save & Broadcast Status
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Status Pipeline Transition"
            value={updateStatus}
            onChange={(e) => setUpdateStatus(e.target.value as ComplaintStatus)}
          >
            <option value="submitted">Submitted</option>
            <option value="acknowledged">Acknowledged (Under review)</option>
            <option value="in_progress">In Progress (Technician deployed)</option>
            <option value="resolved">Resolved (Fix complete)</option>
            <option value="rejected">Rejected (Invalid)</option>
          </Select>

          <Select
            label="Responsible Department"
            value={updateAssignedDept}
            onChange={(e) => setUpdateAssignedDept(e.target.value)}
          >
            <option value="Campus IT & Networks">Campus IT & Networks</option>
            <option value="AV & Classroom Support">AV & Classroom Support</option>
            <option value="Estate Maintenance">Estate & Electrical Maintenance</option>
            <option value="Sanitation & Cleanliness">Sanitation & Water Works</option>
            <option value="Hostel Administration">Hostel Administration</option>
          </Select>

          <Input
            label="Audit History Comment"
            placeholder="e.g. Technician dispatched with replacement router antenna."
            value={updateComment}
            onChange={(e) => setUpdateComment(e.target.value)}
          />

          {updateStatus === 'resolved' && (
            <Textarea
              label="Final Resolution Notes (Visible to Student)"
              placeholder="e.g. Access Point AP-LIB-02 firmware re-flashed and speed verified at 120 Mbps."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              required
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
