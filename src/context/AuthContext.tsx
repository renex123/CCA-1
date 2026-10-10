import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { db } from '../services/dbStore';
import { DEMO_USERS } from '../services/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  quickSwitchRole: (role: UserRole) => void;
  signup: (details: {
    email: string;
    fullName: string;
    role: 'student' | 'faculty';
    departmentId: string;
    enrollmentNo?: string;
    facultyId?: string;
    phone?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_STORAGE_KEY = 'campusone_current_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read persisted user session
    const savedUserId = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (savedUserId) {
      const found = db.getUserById(savedUserId);
      if (found) {
        setUser(found);
      } else {
        // Fallback to demo student
        setUser(DEMO_USERS.student);
      }
    } else {
      // Default initial state for easy demo: logged in as Student Aarav Sharma
      setUser(DEMO_USERS.student);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, DEMO_USERS.student.id);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _pass: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    // Find in db users
    const allUsers = db.getUsers();
    const matched = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (matched) {
      setUser(matched);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, matched.id);
      setIsLoading(false);
      return { success: true };
    }

    // Check predefined demo emails
    if (email.includes('student') || email.includes('aarav')) {
      setUser(DEMO_USERS.student);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, DEMO_USERS.student.id);
      setIsLoading(false);
      return { success: true };
    }
    if (email.includes('faculty') || email.includes('priya')) {
      setUser(DEMO_USERS.faculty);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, DEMO_USERS.faculty.id);
      setIsLoading(false);
      return { success: true };
    }
    if (email.includes('admin') || email.includes('rajesh')) {
      setUser(DEMO_USERS.admin);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, DEMO_USERS.admin.id);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, message: 'Invalid credentials. Try aarav.sharma@campus.edu or use quick login.' };
  };

  const quickSwitchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS[role];
    if (targetUser) {
      setUser(targetUser);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, targetUser.id);
    }
  };

  const signup = async (details: {
    email: string;
    fullName: string;
    role: 'student' | 'faculty';
    departmentId: string;
    enrollmentNo?: string;
    facultyId?: string;
    phone?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    // Enforce prompt rule: "Public registration must never allow users to assign themselves an administrator role."
    if ((details.role as string) === 'admin') {
      return { success: false, message: 'Administrator accounts cannot be created via public registration.' };
    }

    const dept = db.getDepartments().find((d) => d.id === details.departmentId);
    const newId = `u-${details.role}-${Date.now()}`;
    const newProfile: UserProfile = {
      id: newId,
      email: details.email,
      full_name: details.fullName,
      role: details.role,
      department_id: details.departmentId,
      department_name: dept?.name || 'Computer Science & Engineering',
      enrollment_no: details.enrollmentNo || `23${dept?.code || 'CSE'}999`,
      faculty_id: details.facultyId,
      phone: details.phone,
      semester: details.role === 'student' ? 1 : undefined,
      batch: details.role === 'student' ? '2026-2030' : undefined,
      section: 'A',
      cgpa: details.role === 'student' ? 8.5 : undefined,
      created_at: new Date().toISOString(),
    };

    db.createUser(newProfile);
    setUser(newProfile);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, newProfile.id);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = db.updateUserProfile(user.id, updates);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickSwitchRole,
        signup,
        logout,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
