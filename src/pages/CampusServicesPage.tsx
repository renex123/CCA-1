import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/dbStore';
import { ServiceRequest, ServiceType, ServiceStatus } from '../types';
import {
  FileCheck,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  QrCode,
  Building,
  CreditCard,
  FileText,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

export const CampusServicesPage: React.FC = () => {
  const { user, role } = useAuth();
  const [, setTick] = useState(0);

  // New Request Form states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('bonafide_certificate');
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  // Certificate Viewer Modal
  const [viewingCertificate, setViewingCertificate] = useState<ServiceRequest | null>(null);

  // Admin Approval Modal
  const [approvingRequest, setApprovingRequest] = useState<ServiceRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    return db.subscribe(() => setTick((t) => t + 1));
  }, []);

  if (!user) return null;

  const allServices = db.getServices();
  const services = role === 'student' ? allServices.filter((s) => s.student_id === user.id) : allServices;

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !reason) {
      alert('Please fill out all required fields.');
      return;
    }

    db.createServiceRequest({
      student_id: user.id,
      student_name: user.full_name,
      student_enrollment: user.enrollment_no || '23CSE104',
      department_name: user.department_name || 'Computer Science & Engineering',
      semester: user.semester || 6,
      service_type: serviceType,
      title,
      reason,
      details: details || `Service request for ${serviceType.replace('_', ' ')}`,
      status: 'submitted',
    });

    setIsNewModalOpen(false);
    setTitle('');
    setReason('');
    setDetails('');
  };

  const handleApprove = () => {
    if (!approvingRequest) return;
    db.updateServiceStatus(
      approvingRequest.id,
      'approved',
      user,
      adminNotes || 'Verified academic standing and active enrollment. Approved.'
    );
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    setApprovingRequest(null);
    setAdminNotes('');
  };

  const handleReject = () => {
    if (!approvingRequest) return;
    db.updateServiceStatus(
      approvingRequest.id,
      'rejected',
      user,
      adminNotes || 'Request rejected. Incomplete supporting documentation.'
    );
    setApprovingRequest(null);
    setAdminNotes('');
  };

  const serviceOptions: { type: ServiceType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      type: 'bonafide_certificate',
      label: 'Bonafide Certificate',
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      desc: 'Official proof of enrollment for Passports, Visas, Bank Loans & Scholarships.',
    },
    {
      type: 'id_card_replacement',
      label: 'ID Card Replacement',
      icon: <CreditCard className="w-5 h-5 text-amber-600" />,
      desc: 'Re-issue lost or damaged RFID Smart Campus ID Card with photo reprint.',
    },
    {
      type: 'document_request',
      label: 'Transcripts & Grade Sheets',
      icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
      desc: 'Certified semester mark sheets and provisional academic records.',
    },
    {
      type: 'leave_request',
      label: 'Academic Leave Application',
      icon: <Calendar className="w-5 h-5 text-amber-600" />,
      desc: 'Formal leave request on medical grounds or family emergencies.',
    },
    {
      type: 'facility_booking',
      label: 'Facility / Lab Booking',
      icon: <Building className="w-5 h-5 text-sky-600" />,
      desc: 'Reserve seminar halls, high-performance computing clusters, or maker labs.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Digital Campus Services & Certifications
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paperless workflows • Digital signatures • Tamper-proof QR certificate verification
          </p>
        </div>

        {role === 'student' && (
          <Button onClick={() => setIsNewModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Request Campus Service
          </Button>
        )}
      </div>

      {/* Available Services Catalog (For Students) */}
      {role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceOptions.slice(0, 3).map((item) => (
            <Card
              key={item.type}
              onClick={() => {
                setServiceType(item.type);
                setTitle(`${item.label} Request`);
                setIsNewModalOpen(true);
              }}
              className="p-5 hover:border-indigo-500 transition-all cursor-pointer group shadow-xs"
            >
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 w-fit group-hover:scale-105 transition-transform mb-3">
                {item.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                {item.label}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {item.desc}
              </p>
              <span className="inline-block mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Apply online →
              </span>
            </Card>
          ))}
        </div>
      )}

      {/* Requests Ledger Table / Cards */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              {role === 'student' ? 'My Submitted Service Requests' : 'Institution Service Requests Ledger'}
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Review statuses and download authorized documents
            </p>
          </div>
          <Badge variant="primary" size="sm">{services.length} Total Requests</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No service requests on record.
            </p>
          ) : (
            services.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {req.request_no}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {req.service_type.replace('_', ' ')}
                    </span>
                    <Badge
                      variant={
                        req.status === 'approved'
                          ? 'success'
                          : req.status === 'in_review'
                          ? 'warning'
                          : req.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {req.status}
                    </Badge>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {req.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Applicant: <strong>{req.student_name}</strong> ({req.student_enrollment}) • Reason: {req.reason}
                  </p>
                  {req.admin_notes && (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                      Notes: {req.admin_notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {req.status === 'approved' && req.service_type === 'bonafide_certificate' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setViewingCertificate(req)}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                    >
                      View Certificate
                    </Button>
                  )}

                  {role === 'admin' && req.status !== 'approved' && req.status !== 'rejected' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setApprovingRequest(req)}
                    >
                      Process Request
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* New Service Request Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Apply for Campus Digital Service"
        description="Submit your request. The student affairs administration will verify your eligibility."
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <Select
            label="Service Category"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceType)}
          >
            <option value="bonafide_certificate">Bonafide Certificate</option>
            <option value="id_card_replacement">Student ID Card Replacement</option>
            <option value="document_request">Academic Transcripts / Mark Sheets</option>
            <option value="leave_request">Student Leave Request</option>
            <option value="facility_booking">Facility & Lab Booking</option>
          </Select>

          <Input
            label="Application Subject / Title"
            placeholder="e.g. Bonafide Certificate for Passport Renewal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Official Purpose / Reason"
            placeholder="e.g. Submission at Regional Passport Office"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <Textarea
            label="Additional Specifics"
            placeholder="Any specific institutional details required on the certificate..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* Admin Review / Process Modal */}
      <Modal
        isOpen={!!approvingRequest}
        onClose={() => setApprovingRequest(null)}
        title={`Review Request: ${approvingRequest?.request_no}`}
        description="Verify student records before applying university digital signature."
        footer={
          <>
            <Button variant="destructive" onClick={handleReject}>
              Reject Request
            </Button>
            <Button variant="success" onClick={handleApprove} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Approve & Issue Certificate
            </Button>
          </>
        }
      >
        {approvingRequest && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
              <p><strong>Student:</strong> {approvingRequest.student_name} ({approvingRequest.student_enrollment})</p>
              <p><strong>Department:</strong> {approvingRequest.department_name} (Semester {approvingRequest.semester})</p>
              <p><strong>Type:</strong> {approvingRequest.service_type.replace('_', ' ')}</p>
              <p><strong>Purpose:</strong> {approvingRequest.reason}</p>
            </div>

            <Textarea
              label="Administrative Endorsement Notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Verified with CSE Academic records. No dues pending. Digitally approved."
            />
          </div>
        )}
      </Modal>

      {/* Official Digitally Signed Certificate Modal (Demo 5 Download View) */}
      {viewingCertificate && (
        <Modal
          isOpen={true}
          onClose={() => setViewingCertificate(null)}
          title="Official Digitally Stamped Bonafide Certificate"
          maxWidth="2xl"
          footer={
            <>
              <Button variant="outline" onClick={() => window.print()} leftIcon={<Printer className="w-4 h-4" />}>
                Print Certificate
              </Button>
              <Button variant="primary" onClick={() => setViewingCertificate(null)}>
                Done
              </Button>
            </>
          }
        >
          {/* Certificate Printable Canvas */}
          <div className="p-8 sm:p-10 border-4 border-double border-slate-800 bg-[#fefefe] text-slate-900 rounded-xl relative shadow-md space-y-6 font-serif">
            {/* Header / Seal */}
            <div className="text-center border-b-2 border-slate-800 pb-4">
              <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto mb-2 font-black text-xl shadow-xs">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-950 font-serif">
                CampusOne Institute of Technology & Sciences
              </h2>
              <p className="text-[11px] text-slate-600 font-sans tracking-wide">
                (An Autonomous Institution Affiliated to Biju Patnaik University of Technology, Odisha)
              </p>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                Approved by AICTE, Ministry of Education, Govt. of India • Accredited 'A+' Grade by NAAC
              </p>
              <div className="flex items-center justify-between mt-4 text-[11px] font-sans border-t border-slate-200 pt-2 text-slate-600">
                <span><strong>Ref No:</strong> CIT/ACAD/2026/BNF-{viewingCertificate.student_enrollment}</span>
                <span><strong>Date of Issue:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center font-sans">
              <h3 className="text-base font-extrabold uppercase tracking-widest text-slate-900 underline decoration-slate-400 underline-offset-4">
                TO WHOMSOEVER IT MAY CONCERN
              </h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                BONAFIDE STUDENT CERTIFICATE
              </p>
            </div>

            {/* Certificate Body Text */}
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 font-serif">
              <p>
                This is to certify that <strong>Mr./Ms. {viewingCertificate.student_name}</strong>, bearing University Registration / Roll Number <strong>{viewingCertificate.student_enrollment}</strong>, is a regular bonafide student of this Institute pursuing four-year Bachelor of Technology (B.Tech) degree programme in the Department of <strong>{viewingCertificate.department_name}</strong>.
              </p>
              <p>
                He/She is currently studying in <strong>Semester {viewingCertificate.semester} (Academic Session 2025–2026)</strong>. According to institutional records, his/her academic progress and general conduct in the campus have been found to be <strong>GOOD</strong>, and he/she has maintained verified aggregate class attendance conforming to university regulations.
              </p>
              <p>
                This certificate is granted upon his/her application dated {new Date(viewingCertificate.created_at).toLocaleDateString('en-IN')} for the purpose of: <em>"{viewingCertificate.reason}"</em>.
              </p>
            </div>

            {/* Signatures & QR Verification Seal */}
            <div className="pt-6 border-t-2 border-slate-800 flex items-end justify-between font-sans">
              <div className="flex items-center gap-3">
                <div className="p-1 border border-slate-400 bg-white rounded-md">
                  <QRCodeSVG
                    value={`https://bput.ac.in/verify/cert/${viewingCertificate.certificate_issued_id || 'CERT-BNF-2026-CSE-104'}`}
                    size={72}
                  />
                </div>
                <div className="text-[10px] text-slate-500">
                  <p className="font-bold text-slate-800">QR Ledger Authentication</p>
                  <p>Scan to verify with BPUT Records</p>
                  <p className="font-mono text-emerald-700 font-semibold mt-0.5">Digitally Endorsed</p>
                </div>
              </div>

              <div className="text-right">
                <div className="w-28 border-b border-slate-400 mb-1" />
                <p className="text-xs font-bold text-slate-900">Dr. Rajesh Verma</p>
                <p className="text-[10px] font-semibold text-slate-600">Dean (Academic Affairs)</p>
                <p className="text-[9px] text-slate-400">Office of the Deputy Registrar</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
