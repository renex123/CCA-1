-- ====================================================================
-- CAMPUSONE SMART CAMPUS MANAGEMENT PLATFORM
-- Supabase PostgreSQL Database Migration Script
-- Version: 1.0.0
-- Generated: 2026-10-10
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE user_role_type AS ENUM ('student', 'faculty', 'admin');
CREATE TYPE complaint_status_type AS ENUM ('submitted', 'acknowledged', 'in_progress', 'resolved', 'rejected');
CREATE TYPE complaint_priority_type AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE service_status_type AS ENUM ('submitted', 'in_review', 'approved', 'rejected');
CREATE TYPE timetable_status_type AS ENUM ('scheduled', 'rescheduled', 'cancelled');

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role_type NOT NULL DEFAULT 'student',
  department_id UUID,
  department_name TEXT,
  enrollment_no TEXT UNIQUE,
  faculty_id TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  semester INT,
  batch TEXT,
  section TEXT DEFAULT 'A',
  cgpa NUMERIC(4, 2),
  guardian_name TEXT,
  guardian_phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  hod_name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  total_students INT DEFAULT 0,
  total_faculty INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  degree TEXT NOT NULL DEFAULT 'B.Tech',
  duration_years INT DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CLASSROOMS TABLE
CREATE TABLE IF NOT EXISTS public.classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number TEXT UNIQUE NOT NULL,
  building TEXT NOT NULL,
  floor INT NOT NULL,
  capacity INT NOT NULL DEFAULT 60,
  type TEXT NOT NULL DEFAULT 'lecture_hall',
  equipment TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  semester INT NOT NULL,
  credits INT NOT NULL DEFAULT 3,
  type TEXT NOT NULL DEFAULT 'theory',
  faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  faculty_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TIMETABLE ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.timetable_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  day_name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  faculty_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  faculty_name TEXT NOT NULL,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  building TEXT NOT NULL,
  semester INT NOT NULL,
  section TEXT NOT NULL DEFAULT 'A',
  status timetable_status_type DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ATTENDANCE SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  faculty_name TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'A',
  semester INT NOT NULL,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  session_code VARCHAR(10) NOT NULL,
  qr_token TEXT NOT NULL,
  duration_minutes INT DEFAULT 15,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  total_enrolled INT DEFAULT 60,
  marked_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ATTENDANCE RECORDS TABLE (Unique per student per session)
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_enrollment TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  status TEXT DEFAULT 'present',
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  method TEXT DEFAULT 'qr_scan',
  CONSTRAINT unique_student_session UNIQUE (session_id, student_id)
);

-- 11. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'academic',
  priority TEXT NOT NULL DEFAULT 'normal',
  publisher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  publisher_name TEXT NOT NULL,
  publisher_role TEXT NOT NULL,
  target_audience TEXT NOT NULL DEFAULT 'all',
  department_name TEXT,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_no TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_dept TEXT NOT NULL,
  student_enrollment TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  campus_location TEXT NOT NULL,
  priority complaint_priority_type DEFAULT 'medium',
  status complaint_status_type DEFAULT 'submitted',
  assigned_to_dept TEXT,
  assigned_to_person TEXT,
  resolution_notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 14. COMPLAINT STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.complaint_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  previous_status complaint_status_type NOT NULL,
  new_status complaint_status_type NOT NULL,
  updated_by_name TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. DIGITAL CAMPUS SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_no TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_enrollment TEXT NOT NULL,
  department_name TEXT NOT NULL,
  semester INT NOT NULL,
  service_type TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT,
  reason TEXT NOT NULL,
  status service_status_type DEFAULT 'submitted',
  admin_notes TEXT,
  certificate_issued_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. SERVICE REQUEST HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.service_request_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE,
  previous_status service_status_type NOT NULL,
  new_status service_status_type NOT NULL,
  action_by_name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. CAMPUS FACILITIES TABLE
CREATE TABLE IF NOT EXISTS public.campus_facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  building TEXT NOT NULL,
  floor TEXT NOT NULL,
  room_number TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  service_hours TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'open',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. CAMPUS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  organizer TEXT NOT NULL,
  venue TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  capacity INT NOT NULL DEFAULT 100,
  registered_count INT DEFAULT 0,
  banner_url TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_enrollment TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  ticket_code TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  CONSTRAINT unique_student_event UNIQUE (event_id, student_id)
);

-- 20. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  faculty_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  faculty_name TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  max_marks INT DEFAULT 25,
  submission_count INT DEFAULT 0,
  total_students INT DEFAULT 60,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. CAMPUS KNOWLEDGE BASE (Used by CampusAI for grounding)
CREATE TABLE IF NOT EXISTS public.campus_knowledge_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  last_verified DATE DEFAULT CURRENT_DATE
);

-- 22. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  user_name TEXT NOT NULL,
  user_role user_role_type NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can view their own profile; admins can view all profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 2. Complaints: Students can view their complaints; admins and faculty can view all
CREATE POLICY "Students view own complaints, admins view all"
  ON public.complaints FOR SELECT
  USING (
    student_id = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'faculty')
  );

-- 3. Service Requests: Students view own requests; admins view all
CREATE POLICY "Students view own service requests, admins view all"
  ON public.service_requests FOR SELECT
  USING (
    student_id = auth.uid() OR
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- 4. Audit Logs: Strictly restricted to administrators
CREATE POLICY "Only admins can access audit logs"
  ON public.audit_logs FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Done. Migration complete.
