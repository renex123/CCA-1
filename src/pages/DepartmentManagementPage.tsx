import React from 'react';
import { db } from '../services/dbStore';
import { Building2, Users, BookOpen, Layers, Monitor, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const DepartmentManagementPage: React.FC = () => {
  const departments = db.getDepartments();
  const classrooms = db.getClassrooms();
  const subjects = db.getSubjects();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Department & Infrastructure Management
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Academic faculties • Classroom capacities • Smart lab equipment inventory
        </p>
      </div>

      {/* Departments Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Academic Departments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-5 space-y-3 hover:border-indigo-400 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {dept.code}
                </span>
                <Badge variant="primary" size="sm">
                  {dept.total_students} Students
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {dept.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {dept.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p><strong>Head of Dept:</strong> {dept.hod_name}</p>
                <p className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3 h-3 text-indigo-500" />
                  {dept.location}
                </p>
                <p>Faculty Strength: <strong>{dept.total_faculty} Members</strong></p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Classrooms and Laboratories */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Classrooms & Research Laboratories</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Physical facility capacities and audio-visual equipment</p>
          </div>
          <Badge variant="outline" size="sm">{classrooms.length} Allocated Halls</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classrooms.map((room) => (
              <div
                key={room.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {room.room_number}
                  </span>
                  <Badge variant={room.type === 'lab' ? 'warning' : 'primary'} size="sm">
                    {room.type.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {room.building} (Floor {room.floor})
                </h4>
                <p className="text-xs text-slate-500">
                  Seating Capacity: <strong>{room.capacity} Students</strong>
                </p>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Fitted Equipment:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {room.equipment.map((eq, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
