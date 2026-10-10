-- ====================================================================
-- CAMPUSONE SEED DATA SCRIPT
-- Populates demo departments, users, timetable, attendance, complaints, and knowledge base
-- ====================================================================

-- Departments
INSERT INTO public.departments (id, name, code, hod_name, description, location, total_students, total_faculty)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Computer Science & Engineering', 'CSE', 'Dr. Priya Sengupta', 'Specializing in AI, Cloud Computing, and Cybersecurity.', 'Aryabhata Academic Block, 3rd Floor', 480, 24),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Electronics & Communication', 'ECE', 'Dr. Manas Ranjan Panda', 'VLSI, Embedded Systems, and Telecommunications.', 'Raman Tech Complex, 2nd Floor', 360, 18),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Mechanical Engineering', 'MECH', 'Dr. Debabrata Roy', 'Robotics and Advanced Manufacturing.', 'Visvesvaraya Building, Ground Floor', 320, 16)
ON CONFLICT (code) DO NOTHING;

-- Classrooms
INSERT INTO public.classrooms (id, room_number, building, floor, capacity, type, equipment)
VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'LH-204', 'Aryabhata Academic Block', 2, 75, 'lecture_hall', ARRAY['Interactive 4K Display', 'Dual Ceiling Mic', 'Acoustic Panel']),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'CS-LAB-302', 'Ramanujan Computing Center', 3, 60, 'lab', ARRAY['60 i7 Workstations', 'NVIDIA GPU Server', 'Smart Projector']),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'LH-101', 'Aryabhata Academic Block', 1, 120, 'lecture_hall', ARRAY['Dual Laser Projectors', 'Wireless Mic', 'Air Conditioned'])
ON CONFLICT (room_number) DO NOTHING;

-- Knowledge Base Documents for CampusAI Grounding
INSERT INTO public.campus_knowledge_documents (category, title, content, keywords)
VALUES
  ('attendance_policy', 'University Attendance Regulations', 'According to University Academic Regulations Section 4.2, students must maintain at least 75% aggregate attendance to appear in end-semester exams.', ARRAY['attendance', '75%', 'policy']),
  ('bonafide_certificate', 'Bonafide Certificate Procedure', 'Students can apply for Bonafide Certificates online via Campus Services. Issued certificates contain a unique verification QR code.', ARRAY['bonafide', 'certificate', 'passport', 'apply']),
  ('library_rules', 'Central Library Regulations', 'Central Library operates 08:00 AM to 11:30 PM on weekdays. Undergraduates can borrow up to 4 books for 14 days.', ARRAY['library', 'timing', 'books']),
  ('complaint_sla', 'Campus SLA Standards', 'Campus issues logged in CampusOne follow strict SLAs: Urgent (2 hours), High (12 hours), Medium (24-48 hours).', ARRAY['complaint', 'sla', 'repair']);

-- Seed Complete
