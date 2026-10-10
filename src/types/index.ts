export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department_id?: string;
  department_name?: string;
  enrollment_no?: string; // For students (e.g. 23CSE104)
  faculty_id?: string;    // For faculty (e.g. FAC-CSE-09)
  avatar_url?: string;
  phone?: string;
  semester?: number;      // e.g. 6
  batch?: string;         // e.g. 2023-2027
  section?: string;       // e.g. 'A'
  cgpa?: number;          // e.g. 8.74
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hod_name: string;
  description: string;
  location: string;
  total_students: number;
  total_faculty: number;
}

export interface Course {
  id: string;
  department_id: string;
  name: string;
  code: string;
  degree: string;
  duration_years: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department_id: string;
  semester: number;
  credits: number;
  type: 'theory' | 'practical';
  faculty_id?: string;
  faculty_name?: string;
}

export interface Classroom {
  id: string;
  room_number: string;
  building: string;
  floor: number;
  capacity: number;
  type: 'lecture_hall' | 'lab' | 'seminar';
  equipment: string[];
}

export interface TimetableEntry {
  id: string;
  day_of_week: 1 | 2 | 3 | 4 | 5 | 6; // Mon-Sat
  day_name: string;
  start_time: string; // '09:00'
  end_time: string;   // '10:00'
  subject_id: string;
  subject_name: string;
  subject_code: string;
  faculty_id: string;
  faculty_name: string;
  classroom_id: string;
  room_number: string;
  building: string;
  semester: number;
  section: string;
  status: 'scheduled' | 'rescheduled' | 'cancelled';
}

export interface AttendanceSession {
  id: string;
  faculty_id: string;
  faculty_name: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  section: string;
  semester: number;
  classroom_id: string;
  room_number: string;
  session_code: string;
  qr_token: string;
  duration_minutes: number;
  start_time: string;
  expires_at: string;
  is_active: boolean;
  total_enrolled: number;
  marked_count: number;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  student_name: string;
  student_enrollment: string;
  subject_id: string;
  subject_name: string;
  status: 'present' | 'late' | 'absent';
  marked_at: string;
  method: 'qr_scan' | 'manual_override';
}

export interface StudentSubjectAttendance {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  total_classes: number;
  attended_classes: number;
  percentage: number;
  status: 'good' | 'warning' | 'critical'; // >=75% good, 65-74% warning, <65% critical
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'exam' | 'holiday' | 'events' | 'emergency' | 'general' | 'department';
  priority: 'normal' | 'urgent' | 'pinned';
  publisher_id: string;
  publisher_name: string;
  publisher_role: string;
  target_audience: 'all' | 'students' | 'faculty' | 'department';
  department_name?: string;
  attachments?: string[];
  created_at: string;
  read_by?: string[];
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'warning' | 'success';
  read: boolean;
  link?: string;
  created_at: string;
}

export type ComplaintCategory =
  | 'internet'
  | 'electricity'
  | 'classroom_equipment'
  | 'cleanliness'
  | 'water_supply'
  | 'hostel'
  | 'library'
  | 'other';

export type ComplaintStatus = 'submitted' | 'acknowledged' | 'in_progress' | 'resolved' | 'rejected';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ComplaintStatusHistory {
  id: string;
  complaint_id: string;
  previous_status: ComplaintStatus;
  new_status: ComplaintStatus;
  updated_by_name: string;
  comment: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  ticket_no: string;
  student_id: string;
  student_name: string;
  student_dept: string;
  student_enrollment: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  campus_location: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assigned_to_dept?: string;
  assigned_to_person?: string;
  resolution_notes?: string;
  photo_url?: string;
  created_at: string;
  resolved_at?: string;
  history: ComplaintStatusHistory[];
}

export type ServiceType =
  | 'bonafide_certificate'
  | 'id_card_replacement'
  | 'document_request'
  | 'leave_request'
  | 'facility_booking'
  | 'lab_equipment';

export type ServiceStatus = 'submitted' | 'in_review' | 'approved' | 'rejected';

export interface ServiceRequestHistory {
  id: string;
  request_id: string;
  previous_status: ServiceStatus;
  new_status: ServiceStatus;
  action_by_name: string;
  notes: string;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  request_no: string;
  student_id: string;
  student_name: string;
  student_enrollment: string;
  department_name: string;
  semester: number;
  service_type: ServiceType;
  title: string;
  details: string;
  reason: string;
  supporting_docs?: string[];
  status: ServiceStatus;
  admin_notes?: string;
  certificate_issued_id?: string;
  created_at: string;
  updated_at: string;
  history: ServiceRequestHistory[];
}

export interface CampusFacility {
  id: string;
  name: string;
  category: 'academic' | 'lab' | 'library' | 'admin' | 'canteen' | 'hostel' | 'medical' | 'sports';
  building: string;
  floor: string;
  room_number?: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  service_hours: string;
  contact_phone: string;
  status: 'open' | 'closed' | 'maintenance';
  image_url?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: 'cultural' | 'tech' | 'sports' | 'seminar' | 'workshop' | 'placement';
  organizer: string;
  venue: string;
  date_time: string;
  registration_deadline: string;
  capacity: number;
  registered_count: number;
  banner_url: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface EventRegistration {
  id: string;
  event_id: string;
  student_id: string;
  student_name: string;
  student_enrollment: string;
  registered_at: string;
  ticket_code: string;
  status: 'confirmed' | 'cancelled';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  subject_name: string;
  faculty_id: string;
  faculty_name: string;
  due_date: string;
  max_marks: number;
  submission_count: number;
  total_students: number;
  status: 'active' | 'closed';
  file_attachment?: string;
}

export interface CampusKnowledgeDoc {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  last_verified: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
  isContextAware?: boolean;
}
