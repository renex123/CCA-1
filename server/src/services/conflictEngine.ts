import { campusStore, TimetableClass } from '../data/campusStore';

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts: {
    type: 'room_overlap' | 'faculty_overlap';
    message: string;
    existingClass: TimetableClass;
  }[];
}

export class ConflictEngine {
  /**
   * Helper to convert "HH:mm" to minutes from midnight
   */
  private static timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  }

  /**
   * Checks if two time windows overlap
   */
  private static timesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
    const aStart = this.timeToMinutes(startA);
    const aEnd = this.timeToMinutes(endA);
    const bStart = this.timeToMinutes(startB);
    const bEnd = this.timeToMinutes(endB);
    return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
  }

  /**
   * Evaluates proposed class schedule against all scheduled classes
   */
  public static checkConflicts(candidate: {
    id?: string;
    day: TimetableClass['day'];
    startTime: string;
    endTime: string;
    classroom: string;
    facultyId: string;
    facultyName: string;
  }): ConflictCheckResult {
    const conflicts: ConflictCheckResult['conflicts'] = [];

    const existingClasses = campusStore.timetables.filter(
      (c) => candidate.id ? c.id !== candidate.id : true
    );

    for (const c of existingClasses) {
      if (c.day !== candidate.day) continue;

      const overlap = this.timesOverlap(candidate.startTime, candidate.endTime, c.startTime, c.endTime);
      if (!overlap) continue;

      // 1. Room collision
      if (c.classroom.toLowerCase() === candidate.classroom.toLowerCase()) {
        conflicts.push({
          type: 'room_overlap',
          message: `Classroom ${c.classroom} is already booked for ${c.subjectName} (${c.subjectCode}) with ${c.facultyName} from ${c.startTime} to ${c.endTime}.`,
          existingClass: c,
        });
      }

      // 2. Faculty collision
      if (c.facultyId === candidate.facultyId) {
        conflicts.push({
          type: 'faculty_overlap',
          message: `Faculty member ${candidate.facultyName} is already assigned to teach ${c.subjectName} (${c.classroom}) during ${c.startTime} to ${c.endTime}.`,
          existingClass: c,
        });
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
    };
  }
}
