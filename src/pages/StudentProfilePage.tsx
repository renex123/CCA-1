import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const StudentProfilePage: React.FC = () => {
  const { user, updateCurrentUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(user?.address || 'Greenfield Residency, Tech Park Road');
  const [guardianName, setGuardianName] = useState(user?.guardian_name || 'Sanjay Sharma');
  const [guardianPhone, setGuardianPhone] = useState(user?.guardian_phone || '+91 98765 11223');

  if (!user) return null;

  const handleSave = () => {
    updateCurrentUserProfile({
      phone,
      address,
      guardian_name: guardianName,
      guardian_phone: guardianPhone,
    });
    setIsEditing(false);
    alert('Profile information updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Profile & Academic Credentials
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified university identity • Department enrollment records
          </p>
        </div>

        <div>
          {isEditing ? (
            <Button size="sm" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
              Edit Contact Info
            </Button>
          )}
        </div>
      </div>

      {/* Hero Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-slate-900 dark:bg-slate-950 border-b border-slate-800" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-6">
            <div className="flex items-end gap-4">
              <img
                src={
                  user.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={user.full_name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-lg"
              />
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {user.full_name}
                  </h3>
                  <Badge variant="primary" size="sm">
                    {user.role.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {user.department_name}
                </p>
              </div>
            </div>

            {user.role === 'student' && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-right">
                <span className="text-[10px] font-bold uppercase text-slate-500">Cumulative CGPA</span>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {user.cgpa || '8.74'} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Institutional Email</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{user.email}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">
                {user.role === 'student' ? 'Enrollment / Roll No.' : 'Faculty ID Code'}
              </span>
              <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {user.enrollment_no || user.faculty_id || '23CSE104'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Semester & Section</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                Semester {user.semester || 6} • Section {user.section || 'A'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Batch Academic Year</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{user.batch || '2023–2027'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Guardian Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Input
                  label="Contact Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="Residential Campus Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Phone</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{phone}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Address</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guardian & Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Input
                  label="Guardian / Parent Name"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
                <Input
                  label="Emergency Contact Phone"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                />
              </>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Guardian Name</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{guardianName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Emergency Phone</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{guardianPhone}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
