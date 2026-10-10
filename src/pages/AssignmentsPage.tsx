import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import { Assignment } from '../types';
import {
  BookOpenCheck,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
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

export const AssignmentsPage: React.FC = () => {
  const { user, role } = useAuth();
  const [, setTick] = useState(0);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionLink, setSubmissionLink] = useState('');

  // Faculty new assignment modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('sub-cs601');
  const [dueDate, setDueDate] = useState('2026-03-24');
  const [maxMarks, setMaxMarks] = useState('25');

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  if (!user) return null;

  const assignments = db.getAssignments();
  const subjects = db.getSubjects();

  const handleOpenSubmit = (asg: Assignment) => {
    setSelectedAssignment(asg);
    setSubmissionLink('');
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionLink) return;

    if (selectedAssignment) {
      selectedAssignment.submission_count += 1;
    }
    setIsSubmitModalOpen(false);
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
    });
    alert('Assignment submission uploaded successfully!');
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const subj = subjects.find((s) => s.id === subjectId) || subjects[0];
    db.createAssignment(
      {
        title,
        description,
        subject_id: subj.id,
        subject_name: subj.name,
        faculty_id: user.id,
        faculty_name: user.full_name,
        due_date: new Date(dueDate).toISOString(),
        max_marks: Number(maxMarks),
        total_students: 60,
        status: 'active',
      },
      user
    );

    setIsNewModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const examSchedule = [
    {
      code: 'CS-601',
      subject: 'Distributed Systems & Cloud Computing',
      date: 'March 24, 2026',
      time: '10:00 AM – 01:00 PM',
      venue: 'Exam Hall 1 (LH-101 / LH-102)',
    },
    {
      code: 'CS-602',
      subject: 'Artificial Intelligence & Machine Learning',
      date: 'March 26, 2026',
      time: '10:00 AM – 01:00 PM',
      venue: 'Exam Hall 2 (LH-203 / LH-204)',
    },
    {
      code: 'CS-603',
      subject: 'Compiler Design & Automata',
      date: 'March 28, 2026',
      time: '10:00 AM – 01:00 PM',
      venue: 'Exam Hall 1 (LH-101 / LH-102)',
    },
    {
      code: 'CS-605',
      subject: 'Information & Network Security',
      date: 'March 31, 2026',
      time: '10:00 AM – 01:00 PM',
      venue: 'Exam Hall 3 (Aryabhata 3rd Floor)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academics, Assignments & Examinations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous evaluation tracking • Mid-semester schedule • Submission deadlines
          </p>
        </div>

        {role === 'faculty' && (
          <Button onClick={() => setIsNewModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Create Assignment Task
          </Button>
        )}
      </div>

      {/* Assignments Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Active Continuous Assessments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((asg) => (
            <Card key={asg.id} className="flex flex-col justify-between hover:border-indigo-400 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">{asg.subject_name.split(' ')[0]}</Badge>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Max: {asg.max_marks} Marks
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {asg.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {asg.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                      <Clock className="w-3 h-3" /> Due {new Date(asg.due_date).toLocaleDateString()}
                    </span>
                    <span>{asg.faculty_name}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-indigo-600 h-full"
                      style={{ width: `${(asg.submission_count / asg.total_students) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-right">
                    {asg.submission_count} of {asg.total_students} submitted
                  </p>
                </div>

                {role === 'student' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOpenSubmit(asg)}
                    leftIcon={<Upload className="w-3.5 h-3.5" />}
                  >
                    Submit Work
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mid-Semester Examination Schedule */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Mid-Semester Theory Examination Schedule (Spring 2026)</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved by Controller of Examinations • Hall tickets available under Campus Services
            </p>
          </div>
          <Badge variant="warning" size="sm">Begins March 24</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase">
                  <th className="pb-3 font-semibold">Course Code & Subject</th>
                  <th className="pb-3 font-semibold">Exam Date</th>
                  <th className="pb-3 font-semibold">Timing Window</th>
                  <th className="pb-3 font-semibold text-right">Assigned Hall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {examSchedule.map((exam) => (
                  <tr key={exam.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-medium">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{exam.subject}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{exam.code}</span>
                    </td>
                    <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                      {exam.date}
                    </td>
                    <td className="py-3 font-mono text-slate-500">
                      {exam.time}
                    </td>
                    <td className="py-3 text-right font-semibold text-indigo-600 dark:text-indigo-400">
                      {exam.venue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Submit Assignment Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`Submit: ${selectedAssignment?.title}`}
        description="Provide your GitHub repository link or project PDF link for grading."
      >
        <form onSubmit={handleConfirmSubmit} className="space-y-4">
          <Input
            label="Project Repository / Submission URL"
            placeholder="https://github.com/aarav-sharma/raft-consensus"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            required
          />

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500">
            <strong>Honor Code Notice:</strong> All code submissions undergo automated plagiarism verification before academic score computation.
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Submission
            </Button>
          </div>
        </form>
      </Modal>

      {/* Faculty: New Assignment Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Create Academic Assignment Task"
        description="Task will be published to the class feed and tracked in grading logs."
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="e.g. Distributed Consensus Implementation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select
            label="Subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <Input
              label="Max Marks"
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Task Instructions & Rubric"
            placeholder="Provide technical requirements, unit test criteria, and deliverables..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
