import React, { useState } from 'react';
import { db } from '../services/dbStore';
import {
  BarChart3,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  FileCheck,
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';

export const AnalyticsReportsPage: React.FC = () => {
  const departments = db.getDepartments();
  const complaints = db.getComplaints();
  const services = db.getServices();

  const attendanceTrends = [
    { week: 'Week 1', CSE: 91, ECE: 84, MECH: 80, CIVIL: 86 },
    { week: 'Week 2', CSE: 89, ECE: 86, MECH: 82, CIVIL: 84 },
    { week: 'Week 3', CSE: 93, ECE: 88, MECH: 83, CIVIL: 87 },
    { week: 'Week 4', CSE: 88, ECE: 82, MECH: 79, CIVIL: 85 },
    { week: 'Week 5', CSE: 92, ECE: 87, MECH: 84, CIVIL: 88 },
    { week: 'Week 6', CSE: 94, ECE: 89, MECH: 85, CIVIL: 89 },
  ];

  const slaData = [
    { department: 'Campus IT', total: 18, resolvedWithinSLA: 16, avgHours: 3.2 },
    { department: 'AV Support', total: 12, resolvedWithinSLA: 11, avgHours: 5.4 },
    { department: 'Estate & Maintenance', total: 15, resolvedWithinSLA: 13, avgHours: 8.1 },
    { department: 'Sanitation', total: 8, resolvedWithinSLA: 8, avgHours: 2.1 },
  ];

  const handleExportReportCSV = () => {
    const headers = ['Metric', 'Category', 'Value', 'Timestamp'];
    const rows = [
      ['Attendance Rate', 'CSE', '94%', new Date().toISOString()],
      ['Attendance Rate', 'ECE', '89%', new Date().toISOString()],
      ['Attendance Rate', 'MECH', '85%', new Date().toISOString()],
      ['Complaints Total', 'All', complaints.length.toString(), new Date().toISOString()],
      ['Complaints Resolved', 'All', complaints.filter((c) => c.status === 'resolved').length.toString(), new Date().toISOString()],
      ['Services Processed', 'All', services.length.toString(), new Date().toISOString()],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campusone_executive_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Institution Analytics & Compliance Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            NAAC/NIRF accreditation metrics • Attendance telemetry • Complaint turnaround times
          </p>
        </div>

        <Button onClick={handleExportReportCSV} leftIcon={<Download className="w-4 h-4" />}>
          Export Full Accreditation Report (CSV)
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance Rate"
          value="89.2%"
          change="+2.4% vs Spring 2025"
          isPositive={true}
          icon={<CheckCircle2 className="w-5 h-5 text-indigo-600" />}
        />

        <StatCard
          title="Avg Complaint Turnaround"
          value="4.7 Hours"
          change="35% faster with CampusOne"
          isPositive={true}
          icon={<Clock className="w-5 h-5 text-purple-600" />}
        />

        <StatCard
          title="Digital Services Issued"
          value={services.length}
          subtitle="100% paperless certificates"
          icon={<FileCheck className="w-5 h-5 text-emerald-600" />}
        />

        <StatCard
          title="SLA Compliance Rate"
          value="93.8%"
          subtitle="Resolved within published window"
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* 6-Week Attendance Trend Line Chart */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Departmental Weekly Attendance Performance (%)</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative trends across CSE, ECE, Mechanical, and Civil engineering cohorts
            </p>
          </div>
          <Badge variant="success" size="sm">Above 75% Mandate</Badge>
        </CardHeader>
        <CardContent className="min-h-[320px]">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrends} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  borderRadius: '0.75rem',
                  border: 'none',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="CSE" stroke="#6366f1" strokeWidth={3} />
              <Line type="monotone" dataKey="ECE" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="CIVIL" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="MECH" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* SLA Performance Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Departmental SLA Resolution Benchmarks</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Response times and resolution fidelity</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase">
                  <th className="pb-3 font-semibold">Service Department</th>
                  <th className="pb-3 font-semibold text-center">Total Tickets Logged</th>
                  <th className="pb-3 font-semibold text-center">Resolved Inside SLA</th>
                  <th className="pb-3 font-semibold text-center">Avg Resolution Time</th>
                  <th className="pb-3 font-semibold text-right">Compliance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {slaData.map((d) => (
                  <tr key={d.department} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-bold text-slate-900 dark:text-slate-100">
                      {d.department}
                    </td>
                    <td className="py-3 text-center font-semibold">{d.total}</td>
                    <td className="py-3 text-center text-emerald-600 font-bold">{d.resolvedWithinSLA}</td>
                    <td className="py-3 text-center font-mono">{d.avgHours} hrs</td>
                    <td className="py-3 text-right">
                      <Badge variant="success" size="sm">
                        {((d.resolvedWithinSLA / d.total) * 100).toFixed(1)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
