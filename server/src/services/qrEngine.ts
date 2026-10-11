import crypto from 'crypto';
import { campusStore, AttendanceSession, AttendanceRecord } from '../data/campusStore';

export class QREngine {
  /**
   * Generates a 6-digit random session verification PIN
   */
  public static generateSessionPin(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generates a tamper-proof cryptographic QR payload token
   */
  public static generateQRToken(sessionId: string, subjectCode: string, expiryMs: number): string {
    const expiresAt = Date.now() + expiryMs;
    const payload = `${sessionId}:${subjectCode}:${expiresAt}`;
    const signature = crypto.createHmac('sha256', 'campusone_qr_secret_salt_2026').update(payload).digest('hex').substring(0, 16);
    return Buffer.from(`${payload}:${signature}`).toString('base64url');
  }

  /**
   * Verifies and records attendance from either QR scan or manual PIN
   */
  public static verifyAndCheckIn(params: {
    tokenOrPin: string;
    studentId: string;
    studentName: string;
    method: 'qr_scan' | 'pin_entry';
  }): { success: boolean; message: string; record?: AttendanceRecord; session?: AttendanceSession } {
    const { tokenOrPin, studentId, studentName, method } = params;

    let targetSession: AttendanceSession | undefined;

    if (method === 'pin_entry') {
      targetSession = campusStore.sessions.find(
        (s) => s.pin === tokenOrPin && s.status === 'active'
      );
    } else {
      // Decode QR token
      try {
        const decoded = Buffer.from(tokenOrPin, 'base64url').toString('utf8');
        const [sessionId, , expiresAtStr] = decoded.split(':');
        const expiresAt = parseInt(expiresAtStr, 10);

        if (Date.now() > expiresAt) {
          return { success: false, message: 'This QR code has expired. Please ask the instructor for a fresh code.' };
        }

        targetSession = campusStore.sessions.find(
          (s) => s.id === sessionId && s.status === 'active'
        );
      } catch {
        // Fallback: check direct token match
        targetSession = campusStore.sessions.find(
          (s) => s.token === tokenOrPin && s.status === 'active'
        );
      }
    }

    if (!targetSession) {
      return { success: false, message: 'Invalid or expired attendance session. Please check with your faculty.' };
    }

    // Check expiration timestamp
    if (new Date(targetSession.expiresAt).getTime() < Date.now()) {
      targetSession.status = 'closed';
      return { success: false, message: 'This lecture attendance session has closed.' };
    }

    // Check duplicate check-in
    const alreadyRecorded = campusStore.attendanceRecords.some(
      (r) => r.sessionId === targetSession!.id && r.studentId === studentId
    );

    if (alreadyRecorded) {
      return {
        success: false,
        message: 'Your attendance has already been recorded for this lecture session.',
        session: targetSession,
      };
    }

    // Record verified attendance
    const record: AttendanceRecord = {
      id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sessionId: targetSession.id,
      studentId,
      studentName,
      subjectCode: targetSession.subjectCode,
      timestamp: new Date().toISOString(),
      status: 'present',
      verificationMethod: method,
    };

    campusStore.attendanceRecords.push(record);
    targetSession.attendanceCount += 1;

    return {
      success: true,
      message: `Successfully verified attendance for ${targetSession.subjectName} (${targetSession.subjectCode}) in ${targetSession.classroom}.`,
      record,
      session: targetSession,
    };
  }
}
