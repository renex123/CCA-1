import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  studentId?: string;
  facultyId?: string;
  department: string;
  semester?: number;
  phone?: string;
  avatarUrl?: string;
  passwordHash?: string;
}

export interface AttendanceSession {
  id: string;
  subjectCode: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  classroom: string;
  pin: string;
  token: string;
  expiresAt: string;
  status: 'active' | 'closed';
  createdAt: string;
  attendanceCount: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  subjectCode: string;
  timestamp: string;
  status: 'present' | 'late' | 'absent';
  verificationMethod: 'qr_scan' | 'pin_entry' | 'faculty_override';
}

export interface TimetableClass {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  classroom: string;
  department: string;
  semester: number;
}

export interface ComplaintRecord {
  id: string;
  title: string;
  category: 'Hostel' | 'Classroom' | 'Lab' | 'Library' | 'Mess' | 'Network';
  location: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  studentId: string;
  studentName: string;
  assignedTechnician?: string;
  slaDeadline?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ServiceRequest {
  id: string;
  type: 'Bonafide Certificate' | 'Character Certificate' | 'Hostel NOC' | 'Library Clearance' | 'Grade Card Transcript';
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  certificateNumber?: string;
  qrVerificationStamp?: string;
  appliedDate: string;
  approvedDate?: string;
  remarks?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Hackathon' | 'Technical' | 'Cultural' | 'Sports' | 'Seminar';
  date: string;
  time: string;
  venue: string;
  organizer: string;
  description: string;
  registeredStudents: string[];
}

export interface FacilityRecord {
  id: string;
  name: string;
  category: 'Academic' | 'Lab' | 'Library' | 'Hostel' | 'Sports' | 'Administrative';
  block: string;
  floor: string;
  timing: string;
  incharge: string;
  phone: string;
}

class CampusStore {
  public users: UserRecord[] = [
    {
      id: 'usr-student-01',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campusone.edu',
      role: 'student',
      studentId: '23CSE104',
      department: 'Computer Science & Engineering',
      semester: 6,
      phone: '+91 98765 43210',
    },
    {
      id: 'usr-faculty-01',
      name: 'Dr. Priya Sengupta',
      email: 'priya.sengupta@campusone.edu',
      role: 'faculty',
      facultyId: 'FAC-CS-042',
      department: 'Computer Science & Engineering',
      phone: '+91 98765 43211',
    },
    {
      id: 'usr-admin-01',
      name: 'Dr. Rajesh Verma',
      email: 'dean.admin@campusone.edu',
      role: 'admin',
      department: 'Dean Academic Affairs',
      phone: '+91 98765 43212',
    },
  ];

  public sessions: AttendanceSession[] = [
    {
      id: 'sess-active-01',
      subjectCode: 'CS601',
      subjectName: 'Design & Analysis of Algorithms',
      facultyId: 'usr-faculty-01',
      facultyName: 'Dr. Priya Sengupta',
      classroom: 'Hall 302',
      pin: '849201',
      token: 'tok_live_algorithms_session_2026',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      attendanceCount: 42,
    },
  ];

  public attendanceRecords: AttendanceRecord[] = [
    {
      id: 'rec-01',
      sessionId: 'sess-active-01',
      studentId: 'usr-student-01',
      studentName: 'Aarav Sharma',
      subjectCode: 'CS601',
      timestamp: new Date().toISOString(),
      status: 'present',
      verificationMethod: 'qr_scan',
    },
  ];

  public timetables: TimetableClass[] = [
    {
      id: 'tt-01',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      subjectCode: 'CS601',
      subjectName: 'Design & Analysis of Algorithms',
      facultyId: 'usr-faculty-01',
      facultyName: 'Dr. Priya Sengupta',
      classroom: 'Hall 302',
      department: 'Computer Science & Engineering',
      semester: 6,
    },
    {
      id: 'tt-02',
      day: 'Monday',
      startTime: '10:15',
      endTime: '11:15',
      subjectCode: 'CS602',
      subjectName: 'Compiler Design',
      facultyId: 'usr-faculty-02',
      facultyName: 'Prof. Ananya Mishra',
      classroom: 'Hall 305',
      department: 'Computer Science & Engineering',
      semester: 6,
    },
    {
      id: 'tt-03',
      day: 'Monday',
      startTime: '11:30',
      endTime: '12:30',
      subjectCode: 'CS603',
      subjectName: 'Cloud Computing & Distributed Systems',
      facultyId: 'usr-faculty-03',
      facultyName: 'Dr. Debabrata Jena',
      classroom: 'Lab 4 (Network)',
      department: 'Computer Science & Engineering',
      semester: 6,
    },
    {
      id: 'tt-04',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '10:00',
      subjectCode: 'CS604',
      subjectName: 'Machine Learning Foundations',
      facultyId: 'usr-faculty-01',
      facultyName: 'Dr. Priya Sengupta',
      classroom: 'Hall 302',
      department: 'Computer Science & Engineering',
      semester: 6,
    },
  ];

  public complaints: ComplaintRecord[] = [
    {
      id: 'CMP-2026-081',
      title: 'LAN Port Defective in Software Lab 4',
      category: 'Lab',
      location: 'Academic Block B, 3rd Floor, Lab 4',
      description: 'Terminals 14-18 have intermittent network drops during compiler laboratory hours.',
      status: 'In Progress',
      urgency: 'Medium',
      studentId: 'usr-student-01',
      studentName: 'Aarav Sharma',
      assignedTechnician: 'Suresh Nayak (IT Infrastructure)',
      slaDeadline: 'Today, 4:00 PM',
      createdAt: '2026-10-10T08:30:00Z',
    },
    {
      id: 'CMP-2026-079',
      title: 'AC unit leaking water in Lecture Hall 201',
      category: 'Classroom',
      location: 'Central Lecture Complex, Hall 201',
      description: 'Water dripping on students in row 3 from the central air conditioning vent.',
      status: 'Resolved',
      urgency: 'High',
      studentId: 'usr-student-02',
      studentName: 'Rohan Sen',
      assignedTechnician: 'Estate Maintenance Team',
      slaDeadline: 'Yesterday, 6:00 PM',
      createdAt: '2026-10-09T11:20:00Z',
      resolvedAt: '2026-10-09T17:45:00Z',
    },
  ];

  public serviceRequests: ServiceRequest[] = [
    {
      id: 'REQ-2026-014',
      type: 'Bonafide Certificate',
      studentId: 'usr-student-01',
      studentName: 'Aarav Sharma',
      rollNumber: '23CSE104',
      department: 'Computer Science & Engineering',
      status: 'Approved',
      certificateNumber: 'BPUT-AUT-2026-BF-99214',
      qrVerificationStamp: 'https://campusone.edu/verify/BPUT-AUT-2026-BF-99214',
      appliedDate: '2026-10-08',
      approvedDate: '2026-10-09',
      remarks: 'Issued for State Technical Innovation Scholarship 2026.',
    },
    {
      id: 'REQ-2026-015',
      type: 'Character Certificate',
      studentId: 'usr-student-01',
      studentName: 'Aarav Sharma',
      rollNumber: '23CSE104',
      department: 'Computer Science & Engineering',
      status: 'Under Review',
      appliedDate: '2026-10-10',
      remarks: 'Forwarded to Dean Academic Affairs for authorized countersignature.',
    },
  ];

  public events: CampusEvent[] = [
    {
      id: 'EVT-01',
      title: 'HackCampus 2026 — 36hr National Smart Campus Hackathon',
      category: 'Hackathon',
      date: '2026-10-18',
      time: '09:00 AM - 09:00 PM',
      venue: 'Auditorium & Innovation Incubation Center',
      organizer: 'BPUT Innovation Cell & Tech Club',
      description: 'Build production smart campus solutions using React, AI, and IoT sensors.',
      registeredStudents: ['usr-student-01'],
    },
    {
      id: 'EVT-02',
      title: 'Industry Keynote: Next-Gen Cloud Architecture by AWS & Google',
      category: 'Seminar',
      date: '2026-10-22',
      time: '02:00 PM - 04:30 PM',
      venue: 'Mechanical Seminar Hall',
      organizer: 'Department of Computer Science',
      description: 'Hands-on architectural breakdown of enterprise multi-tenant cloud platforms.',
      registeredStudents: [],
    },
  ];

  public facilities: FacilityRecord[] = [
    {
      id: 'FAC-01',
      name: 'Central University Library & Digital Repository',
      category: 'Library',
      block: 'Central Academic Block',
      floor: 'Floors 1 & 2',
      timing: '08:00 AM – 10:00 PM (Mon-Sat)',
      incharge: 'Dr. Sunita Mohanty (Chief Librarian)',
      phone: '+91 674 2381 201',
    },
    {
      id: 'FAC-02',
      name: 'High Performance Computing & AI Research Lab',
      category: 'Lab',
      block: 'CS Department Block C',
      floor: '3rd Floor, Room 314',
      timing: '09:00 AM – 08:00 PM',
      incharge: 'Dr. Debabrata Jena',
      phone: '+91 674 2381 205',
    },
    {
      id: 'FAC-03',
      name: 'Health Center & Emergency First Aid Infirmary',
      category: 'Administrative',
      block: 'Student Amenities Block',
      floor: 'Ground Floor',
      timing: '24 Hours Emergency Service',
      incharge: 'Dr. R. K. Patra (Chief Medical Officer)',
      phone: '+91 674 2381 108',
    },
  ];

  // Grounding knowledge base for CampusAI
  public knowledgeBase = [
    {
      topic: 'Attendance Regulations',
      text: 'According to BPUT Academic Regulations 2026, students must maintain a minimum of 75% attendance in each enrolled theory and laboratory subject to be eligible to sit for end-semester examinations. Medical condonation up to 10% is granted by the Dean on approved medical documentation.',
    },
    {
      topic: 'Bonafide Certificates',
      text: 'Bonafide and Character certificates can be requested digitally via the Campus Services tab in the CampusOne portal. Processing takes 24 hours. The resulting document contains a verifiable cryptographic QR stamp that external authorities can scan.',
    },
    {
      topic: 'Hostel Curfew & Grievances',
      text: 'Main campus hostel gates close at 9:30 PM for all undergraduate scholars. Maintenance grievances regarding Wi-Fi, electrical fittings, or plumbing should be lodged under the Complaints module for automatic SLA technician assignment.',
    },
  ];
}

export const campusStore = new CampusStore();
