import {
  UserProfile,
  Department,
  Subject,
  Classroom,
  TimetableEntry,
  AttendanceSession,
  AttendanceRecord,
  StudentSubjectAttendance,
  Announcement,
  Complaint,
  ServiceRequest,
  CampusFacility,
  CampusEvent,
  EventRegistration,
  Assignment,
  NotificationItem,
  AuditLog,
  ComplaintStatus,
  ServiceStatus,
  UserRole,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_CLASSROOMS,
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_STUDENT_ATTENDANCE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_COMPLAINTS,
  INITIAL_SERVICES,
  INITIAL_FACILITIES,
  INITIAL_EVENTS,
  INITIAL_ASSIGNMENTS,
} from './mockData';

const STORAGE_KEY = 'campusone_db_state_v1';

export interface DatabaseState {
  users: Record<string, UserProfile>;
  departments: Department[];
  classrooms: Classroom[];
  subjects: Subject[];
  timetable: TimetableEntry[];
  attendanceSessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];
  studentAttendance: Record<string, StudentSubjectAttendance[]>;
  announcements: Announcement[];
  complaints: Complaint[];
  services: ServiceRequest[];
  facilities: CampusFacility[];
  events: CampusEvent[];
  eventRegistrations: EventRegistration[];
  assignments: Assignment[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
}

function getInitialState(): DatabaseState {
  const initialAudit: AuditLog[] = [
    {
      id: 'log-1',
      user_id: 'u-adm-1',
      user_name: 'Dr. Rajesh Verma',
      user_role: 'admin',
      action: 'SYSTEM_INITIALIZED',
      entity_type: 'system',
      entity_id: 'sys-01',
      details: 'CampusOne Smart Management Platform database initialized with Spring 2026 academic data.',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'log-2',
      user_id: 'u-fac-1',
      user_name: 'Dr. Priya Sengupta',
      user_role: 'faculty',
      action: 'COURSE_SYLLABUS_UPDATED',
      entity_type: 'subject',
      entity_id: 'sub-cs601',
      details: 'Updated Distributed Systems & Cloud Computing lab curriculum with Kubernetes microservices.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  const initialNotifications: NotificationItem[] = [
    {
      id: 'notif-1',
      user_id: 'u-std-1',
      title: 'Bonafide Request Approved',
      message: 'Your bonafide certificate request REQ-BNF-2026-089 has been signed and is ready for download.',
      type: 'success',
      read: false,
      link: '/services',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'notif-2',
      user_id: 'u-std-1',
      title: 'Upcoming Assignment Deadline',
      message: 'Distributed Systems Raft Consensus assignment is due in 3 days.',
      type: 'warning',
      read: false,
      link: '/assignments',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'notif-3',
      user_id: 'u-std-1',
      title: 'New Announcement',
      message: 'Mid-Semester Examination Schedule for Spring 2026 has been published.',
      type: 'info',
      read: true,
      link: '/announcements',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return {
    users: DEMO_USERS,
    departments: INITIAL_DEPARTMENTS,
    classrooms: INITIAL_CLASSROOMS,
    subjects: INITIAL_SUBJECTS,
    timetable: INITIAL_TIMETABLE,
    attendanceSessions: [
      {
        id: 'sess-active-demo',
        faculty_id: 'u-fac-1',
        faculty_name: 'Dr. Priya Sengupta',
        subject_id: 'sub-cs601',
        subject_name: 'Distributed Systems & Cloud Computing',
        subject_code: 'CS-601',
        section: 'A',
        semester: 6,
        classroom_id: 'room-lh-204',
        room_number: 'LH-204',
        session_code: '749216',
        qr_token: 'QR-CS601-SEC-A-749216',
        duration_minutes: 15,
        start_time: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        expires_at: new Date(Date.now() + 1000 * 60 * 13).toISOString(),
        is_active: true,
        total_enrolled: 60,
        marked_count: 24,
      },
    ],
    attendanceRecords: [
      {
        id: 'rec-1',
        session_id: 'sess-active-demo',
        student_id: 'u-std-2',
        student_name: 'Ananya Mishra',
        student_enrollment: '23CSE102',
        subject_id: 'sub-cs601',
        subject_name: 'Distributed Systems & Cloud Computing',
        status: 'present',
        marked_at: new Date(Date.now() - 1000 * 60).toISOString(),
        method: 'qr_scan',
      },
    ],
    studentAttendance: {
      'u-std-1': INITIAL_STUDENT_ATTENDANCE,
    },
    announcements: INITIAL_ANNOUNCEMENTS,
    complaints: INITIAL_COMPLAINTS,
    services: INITIAL_SERVICES,
    facilities: INITIAL_FACILITIES,
    events: INITIAL_EVENTS,
    eventRegistrations: [
      {
        id: 'evtr-1',
        event_id: 'evt-301',
        student_id: 'u-std-1',
        student_name: 'Aarav Sharma',
        student_enrollment: '23CSE104',
        registered_at: '2026-03-08T14:00:00Z',
        ticket_code: 'HACK-2026-TKT-104',
        status: 'confirmed',
      },
    ],
    assignments: INITIAL_ASSIGNMENTS,
    notifications: initialNotifications,
    auditLogs: initialAudit,
  };
}

class DatabaseStore {
  private state: DatabaseState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load stored database state, initializing fresh state', e);
    }
    return getInitialState();
  }

  private persistState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist database state', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public resetAllData() {
    this.state = getInitialState();
    this.persistState();
  }

  // --- Users & Profiles ---
  public getUsers(): UserProfile[] {
    return Object.values(this.state.users);
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.state.users[id];
  }

  public updateUserProfile(id: string, updates: Partial<UserProfile>): UserProfile {
    const current = this.state.users[id];
    if (!current) throw new Error(`User ${id} not found`);
    const updated = { ...current, ...updates };
    this.state.users[id] = updated;
    this.addAuditLog(id, updated.full_name, updated.role, 'USER_PROFILE_UPDATED', 'user', id, 'Updated profile details');
    this.persistState();
    return updated;
  }

  public createUser(profile: UserProfile): UserProfile {
    this.state.users[profile.id] = profile;
    this.addAuditLog('system', 'System Administrator', 'admin', 'USER_REGISTERED', 'user', profile.id, `Created account for ${profile.full_name} (${profile.role})`);
    this.persistState();
    return profile;
  }

  // --- Departments, Classrooms, Subjects ---
  public getDepartments(): Department[] {
    return this.state.departments;
  }

  public getClassrooms(): Classroom[] {
    return this.state.classrooms;
  }

  public getSubjects(): Subject[] {
    return this.state.subjects;
  }

  // --- Timetable & Conflict Validation (Demo 3) ---
  public getTimetable(): TimetableEntry[] {
    return this.state.timetable;
  }

  public checkTimetableConflict(
    day_of_week: number,
    start_time: string,
    end_time: string,
    classroom_id: string,
    faculty_id: string,
    exclude_entry_id?: string
  ): { hasConflict: boolean; reason?: string } {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const newStart = toMinutes(start_time);
    const newEnd = toMinutes(end_time);

    for (const entry of this.state.timetable) {
      if (entry.id === exclude_entry_id || entry.status === 'cancelled') continue;
      if (entry.day_of_week !== day_of_week) continue;

      const entryStart = toMinutes(entry.start_time);
      const entryEnd = toMinutes(entry.end_time);

      // Check time overlap
      const overlaps = Math.max(newStart, entryStart) < Math.min(newEnd, entryEnd);
      if (overlaps) {
        if (entry.classroom_id === classroom_id) {
          return {
            hasConflict: true,
            reason: `Classroom ${entry.room_number} is already reserved for ${entry.subject_name} (${entry.start_time} - ${entry.end_time}).`,
          };
        }
        if (entry.faculty_id === faculty_id) {
          return {
            hasConflict: true,
            reason: `Faculty ${entry.faculty_name} is already assigned to teach ${entry.subject_name} in ${entry.room_number} at this time.`,
          };
        }
      }
    }

    return { hasConflict: false };
  }

  public updateTimetableEntry(entry: TimetableEntry, updater: UserProfile): TimetableEntry {
    const index = this.state.timetable.findIndex((t) => t.id === entry.id);
    if (index === -1) {
      this.state.timetable.push(entry);
    } else {
      this.state.timetable[index] = entry;
    }

    // Trigger notification to students
    this.createNotification({
      user_id: 'u-std-1',
      title: 'Timetable Updated',
      message: `${entry.subject_name} (${entry.day_name}) classroom updated to ${entry.room_number}.`,
      type: 'info',
      read: false,
      link: '/timetable',
    });

    this.addAuditLog(
      updater.id,
      updater.full_name,
      updater.role,
      'TIMETABLE_RESCHEDULED',
      'timetable',
      entry.id,
      `Rescheduled ${entry.subject_name} to ${entry.room_number} (${entry.day_name} ${entry.start_time}-${entry.end_time})`
    );

    this.persistState();
    return entry;
  }

  // --- Smart Attendance (Demo 1) ---
  public getAttendanceSessions(): AttendanceSession[] {
    return this.state.attendanceSessions;
  }

  public createAttendanceSession(
    faculty: UserProfile,
    subjectId: string,
    classroomId: string,
    durationMinutes: number = 15,
    section: string = 'A',
    semester: number = 6
  ): AttendanceSession {
    const subject = this.state.subjects.find((s) => s.id === subjectId) || this.state.subjects[0];
    const classroom = this.state.classrooms.find((c) => c.id === classroomId) || this.state.classrooms[0];
    const sessionCode = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    const session: AttendanceSession = {
      id: `sess-${Date.now()}`,
      faculty_id: faculty.id,
      faculty_name: faculty.full_name,
      subject_id: subject.id,
      subject_name: subject.name,
      subject_code: subject.code,
      section,
      semester,
      classroom_id: classroom.id,
      room_number: classroom.room_number,
      session_code: sessionCode,
      qr_token: `CAMPUSONE-ATTEND-${subject.code}-${sessionCode}-${Date.now()}`,
      duration_minutes: durationMinutes,
      start_time: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      is_active: true,
      total_enrolled: 60,
      marked_count: 0,
    };

    this.state.attendanceSessions.unshift(session);
    this.addAuditLog(
      faculty.id,
      faculty.full_name,
      faculty.role,
      'ATTENDANCE_SESSION_CREATED',
      'attendance_session',
      session.id,
      `Created QR attendance session for ${subject.code} (${session.session_code}, valid for ${durationMinutes} mins)`
    );
    this.persistState();
    return session;
  }

  public closeAttendanceSession(sessionId: string, faculty: UserProfile) {
    const session = this.state.attendanceSessions.find((s) => s.id === sessionId);
    if (session) {
      session.is_active = false;
      this.addAuditLog(
        faculty.id,
        faculty.full_name,
        faculty.role,
        'ATTENDANCE_SESSION_CLOSED',
        'attendance_session',
        sessionId,
        `Closed attendance session ${session.session_code}. Total marked: ${session.marked_count}`
      );
      this.persistState();
    }
  }

  public markAttendance(
    sessionCodeOrToken: string,
    student: UserProfile
  ): { success: boolean; message: string; record?: AttendanceRecord } {
    const cleanInput = sessionCodeOrToken.trim();
    // Locate active session matching session_code or qr_token
    const session = this.state.attendanceSessions.find(
      (s) =>
        s.is_active &&
        (s.session_code === cleanInput || s.qr_token === cleanInput || s.qr_token.includes(cleanInput))
    );

    if (!session) {
      return { success: false, message: 'Invalid or inactive session code. Please verify with your professor.' };
    }

    // Check expiry
    const now = new Date();
    if (new Date(session.expires_at) < now) {
      session.is_active = false;
      this.persistState();
      return { success: false, message: 'This attendance session has expired.' };
    }

    // Check duplicate
    const alreadyMarked = this.state.attendanceRecords.some(
      (r) => r.session_id === session.id && r.student_id === student.id
    );
    if (alreadyMarked) {
      return { success: false, message: 'Attendance already recorded for this session!' };
    }

    // Record attendance
    const record: AttendanceRecord = {
      id: `rec-${Date.now()}`,
      session_id: session.id,
      student_id: student.id,
      student_name: student.full_name,
      student_enrollment: student.enrollment_no || '2301106104',
      subject_id: session.subject_id,
      subject_name: session.subject_name,
      status: 'present',
      marked_at: now.toISOString(),
      method: 'qr_scan',
    };

    this.state.attendanceRecords.push(record);
    session.marked_count += 1;

    // Recalculate subject percentage for student
    const studentList = this.state.studentAttendance[student.id] || INITIAL_STUDENT_ATTENDANCE;
    const subjIndex = studentList.findIndex((s) => s.subject_id === session.subject_id);
    if (subjIndex !== -1) {
      studentList[subjIndex].attended_classes += 1;
      studentList[subjIndex].total_classes += 1;
      studentList[subjIndex].percentage = parseFloat(
        ((studentList[subjIndex].attended_classes / studentList[subjIndex].total_classes) * 100).toFixed(1)
      );
      if (studentList[subjIndex].percentage >= 75) {
        studentList[subjIndex].status = 'good';
      } else if (studentList[subjIndex].percentage >= 65) {
        studentList[subjIndex].status = 'warning';
      } else {
        studentList[subjIndex].status = 'critical';
      }
      this.state.studentAttendance[student.id] = [...studentList];
    }

    this.addAuditLog(
      student.id,
      student.full_name,
      student.role,
      'ATTENDANCE_MARKED',
      'attendance_record',
      record.id,
      `Marked attendance for ${session.subject_code} via secure QR scan`
    );

    this.persistState();
    return {
      success: true,
      message: `Attendance marked successfully for ${session.subject_name} (${session.subject_code})!`,
      record,
    };
  }

  public getStudentAttendance(studentId: string): StudentSubjectAttendance[] {
    return this.state.studentAttendance[studentId] || INITIAL_STUDENT_ATTENDANCE;
  }

  public getAttendanceRecords(sessionId?: string): AttendanceRecord[] {
    if (sessionId) {
      return this.state.attendanceRecords.filter((r) => r.session_id === sessionId);
    }
    return this.state.attendanceRecords;
  }

  // --- Complaint Management (Demo 2) ---
  public getComplaints(): Complaint[] {
    return this.state.complaints;
  }

  public createComplaint(complaintData: Omit<Complaint, 'id' | 'ticket_no' | 'created_at' | 'history'>): Complaint {
    const count = this.state.complaints.length + 104;
    const ticket_no = `CMP-2026-0${count}`;
    const newComplaint: Complaint = {
      ...complaintData,
      id: `cmp-${Date.now()}`,
      ticket_no,
      created_at: new Date().toISOString(),
      history: [
        {
          id: `cmph-${Date.now()}`,
          complaint_id: `cmp-${Date.now()}`,
          previous_status: 'submitted',
          new_status: 'submitted',
          updated_by_name: complaintData.student_name,
          comment: 'Complaint registered by student via portal.',
          created_at: new Date().toISOString(),
        },
      ],
    };

    this.state.complaints.unshift(newComplaint);

    // Notify administrators
    this.createNotification({
      user_id: 'u-adm-1',
      title: 'New Complaint Registered',
      message: `${complaintData.title} logged in ${complaintData.campus_location} (${complaintData.priority} priority).`,
      type: 'warning',
      read: false,
      link: '/complaints',
    });

    this.addAuditLog(
      complaintData.student_id,
      complaintData.student_name,
      'student',
      'COMPLAINT_SUBMITTED',
      'complaint',
      newComplaint.id,
      `Submitted ticket ${ticket_no}: "${complaintData.title}"`
    );

    this.persistState();
    return newComplaint;
  }

  public updateComplaintStatus(
    id: string,
    newStatus: ComplaintStatus,
    updater: UserProfile,
    comment: string,
    assignedDept?: string,
    assignedPerson?: string,
    resolutionNotes?: string
  ): Complaint {
    const complaint = this.state.complaints.find((c) => c.id === id);
    if (!complaint) throw new Error(`Complaint ${id} not found`);

    const prevStatus = complaint.status;
    complaint.status = newStatus;
    if (assignedDept) complaint.assigned_to_dept = assignedDept;
    if (assignedPerson) complaint.assigned_to_person = assignedPerson;
    if (resolutionNotes) complaint.resolution_notes = resolutionNotes;
    if (newStatus === 'resolved') {
      complaint.resolved_at = new Date().toISOString();
    }

    complaint.history.push({
      id: `cmph-${Date.now()}`,
      complaint_id: complaint.id,
      previous_status: prevStatus,
      new_status: newStatus,
      updated_by_name: `${updater.full_name} (${updater.role.toUpperCase()})`,
      comment: comment || `Status updated from ${prevStatus} to ${newStatus}`,
      created_at: new Date().toISOString(),
    });

    // Notify the student
    this.createNotification({
      user_id: complaint.student_id,
      title: `Complaint ${complaint.ticket_no} Updated`,
      message: `Your ticket "${complaint.title}" is now marked as "${newStatus.replace('_', ' ').toUpperCase()}".`,
      type: newStatus === 'resolved' ? 'success' : 'info',
      read: false,
      link: '/complaints',
    });

    this.addAuditLog(
      updater.id,
      updater.full_name,
      updater.role,
      'COMPLAINT_STATUS_UPDATED',
      'complaint',
      complaint.id,
      `Updated ${complaint.ticket_no} status to ${newStatus}: ${comment}`
    );

    this.persistState();
    return complaint;
  }

  // --- Campus Services (Demo 5) ---
  public getServices(): ServiceRequest[] {
    return this.state.services;
  }

  public createServiceRequest(
    data: Omit<ServiceRequest, 'id' | 'request_no' | 'created_at' | 'updated_at' | 'history'>
  ): ServiceRequest {
    const count = this.state.services.length + 90;
    const request_no = `REQ-SVC-2026-0${count}`;
    const newRequest: ServiceRequest = {
      ...data,
      id: `srv-${Date.now()}`,
      request_no,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      history: [
        {
          id: `srvh-${Date.now()}`,
          request_id: `srv-${Date.now()}`,
          previous_status: 'submitted',
          new_status: 'submitted',
          action_by_name: data.student_name,
          notes: 'Application submitted online with student details.',
          created_at: new Date().toISOString(),
        },
      ],
    };

    this.state.services.unshift(newRequest);

    this.addAuditLog(
      data.student_id,
      data.student_name,
      'student',
      'SERVICE_REQUEST_SUBMITTED',
      'service_request',
      newRequest.id,
      `Applied for ${data.service_type}: "${data.title}"`
    );

    this.persistState();
    return newRequest;
  }

  public updateServiceStatus(
    id: string,
    newStatus: ServiceStatus,
    updater: UserProfile,
    notes: string
  ): ServiceRequest {
    const srv = this.state.services.find((s) => s.id === id);
    if (!srv) throw new Error(`Service request ${id} not found`);

    const prevStatus = srv.status;
    srv.status = newStatus;
    srv.updated_at = new Date().toISOString();
    srv.admin_notes = notes;

    if (newStatus === 'approved' && srv.service_type === 'bonafide_certificate') {
      srv.certificate_issued_id = `CERT-BNF-2026-${srv.student_enrollment}`;
    }

    srv.history.push({
      id: `srvh-${Date.now()}`,
      request_id: srv.id,
      previous_status: prevStatus,
      new_status: newStatus,
      action_by_name: `${updater.full_name} (${updater.role.toUpperCase()})`,
      notes,
      created_at: new Date().toISOString(),
    });

    // Notify student
    this.createNotification({
      user_id: srv.student_id,
      title: `Service Request ${newStatus.toUpperCase()}`,
      message: `Your request ${srv.request_no} for "${srv.title}" has been ${newStatus}.`,
      type: newStatus === 'approved' ? 'success' : newStatus === 'rejected' ? 'alert' : 'info',
      read: false,
      link: '/services',
    });

    this.addAuditLog(
      updater.id,
      updater.full_name,
      updater.role,
      'SERVICE_REQUEST_UPDATED',
      'service_request',
      srv.id,
      `Updated ${srv.request_no} to ${newStatus}: ${notes}`
    );

    this.persistState();
    return srv;
  }

  // --- Campus Events ---
  public getEvents(): CampusEvent[] {
    return this.state.events;
  }

  public getEventRegistrations(studentId?: string): EventRegistration[] {
    if (studentId) {
      return this.state.eventRegistrations.filter((r) => r.student_id === studentId);
    }
    return this.state.eventRegistrations;
  }

  public registerForEvent(
    eventId: string,
    student: UserProfile
  ): { success: boolean; message: string; registration?: EventRegistration } {
    const event = this.state.events.find((e) => e.id === eventId);
    if (!event) return { success: false, message: 'Event not found.' };

    if (event.registered_count >= event.capacity) {
      return { success: false, message: 'Registration full. Maximum capacity reached.' };
    }

    const alreadyReg = this.state.eventRegistrations.some(
      (r) => r.event_id === eventId && r.student_id === student.id && r.status === 'confirmed'
    );
    if (alreadyReg) {
      return { success: false, message: 'You have already registered for this event!' };
    }

    const registration: EventRegistration = {
      id: `evtr-${Date.now()}`,
      event_id: eventId,
      student_id: student.id,
      student_name: student.full_name,
      student_enrollment: student.enrollment_no || '2301106104',
      registered_at: new Date().toISOString(),
      ticket_code: `TKT-${event.category.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
    };

    event.registered_count += 1;
    this.state.eventRegistrations.push(registration);

    this.createNotification({
      user_id: student.id,
      title: 'Event Registration Confirmed!',
      message: `Your pass for "${event.title}" has been confirmed. Ticket: ${registration.ticket_code}`,
      type: 'success',
      read: false,
      link: '/events',
    });

    this.addAuditLog(
      student.id,
      student.full_name,
      'student',
      'EVENT_REGISTERED',
      'event',
      eventId,
      `Registered for event "${event.title}"`
    );

    this.persistState();
    return { success: true, message: 'Registration confirmed!', registration };
  }

  public cancelEventRegistration(eventId: string, studentId: string): boolean {
    const reg = this.state.eventRegistrations.find(
      (r) => r.event_id === eventId && r.student_id === studentId && r.status === 'confirmed'
    );
    const event = this.state.events.find((e) => e.id === eventId);
    if (reg && event) {
      reg.status = 'cancelled';
      event.registered_count = Math.max(0, event.registered_count - 1);
      this.persistState();
      return true;
    }
    return false;
  }

  public createEvent(eventData: Omit<CampusEvent, 'id' | 'registered_count' | 'status'>, admin: UserProfile): CampusEvent {
    const newEvent: CampusEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registered_count: 0,
      status: 'upcoming',
    };
    this.state.events.unshift(newEvent);
    this.addAuditLog(
      admin.id,
      admin.full_name,
      admin.role,
      'EVENT_CREATED',
      'event',
      newEvent.id,
      `Published new campus event "${newEvent.title}"`
    );
    this.persistState();
    return newEvent;
  }

  // --- Announcements ---
  public getAnnouncements(): Announcement[] {
    return this.state.announcements;
  }

  public createAnnouncement(announcementData: Omit<Announcement, 'id' | 'created_at'>, publisher: UserProfile): Announcement {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `ann-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.state.announcements.unshift(newAnnouncement);

    // Broadcast notification to all students
    this.createNotification({
      user_id: 'u-std-1',
      title: `Notice: ${newAnnouncement.title}`,
      message: newAnnouncement.content.slice(0, 120) + '...',
      type: newAnnouncement.priority === 'urgent' ? 'alert' : 'info',
      read: false,
      link: '/announcements',
    });

    this.addAuditLog(
      publisher.id,
      publisher.full_name,
      publisher.role,
      'ANNOUNCEMENT_PUBLISHED',
      'announcement',
      newAnnouncement.id,
      `Published notice: "${newAnnouncement.title}" (${newAnnouncement.category})`
    );

    this.persistState();
    return newAnnouncement;
  }

  // --- Campus Facilities ---
  public getFacilities(): CampusFacility[] {
    return this.state.facilities;
  }

  // --- Assignments ---
  public getAssignments(): Assignment[] {
    return this.state.assignments;
  }

  public createAssignment(data: Omit<Assignment, 'id' | 'submission_count'>, faculty: UserProfile): Assignment {
    const newAssignment: Assignment = {
      ...data,
      id: `asg-${Date.now()}`,
      submission_count: 0,
    };
    this.state.assignments.unshift(newAssignment);
    this.persistState();
    return newAssignment;
  }

  // --- Notifications ---
  public getNotifications(userId: string): NotificationItem[] {
    return this.state.notifications.filter((n) => n.user_id === userId);
  }

  public markNotificationAsRead(id: string) {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persistState();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    this.state.notifications.forEach((n) => {
      if (n.user_id === userId) n.read = true;
    });
    this.persistState();
  }

  public createNotification(item: Omit<NotificationItem, 'id' | 'created_at'>): NotificationItem {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      created_at: new Date().toISOString(),
    };
    this.state.notifications.unshift(newNotif);
    this.persistState();
    return newNotif;
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.state.auditLogs;
  }

  public addAuditLog(
    user_id: string,
    user_name: string,
    user_role: UserRole,
    action: string,
    entity_type: string,
    entity_id: string,
    details: string
  ) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      user_id,
      user_name,
      user_role,
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(log);
    // Keep last 150 logs
    if (this.state.auditLogs.length > 150) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 150);
    }
  }
}

export const db = new DatabaseStore();
