import React from 'react'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { StudentAttendanceRosterItem, RiskStatusBadge } from '../types/reports.types'

interface StudentAttendanceRosterTableProps {
  roster: StudentAttendanceRosterItem[]
  isLoading?: boolean
  search: string
  setSearch: (val: string) => void
  statusFilter: 'ALL' | RiskStatusBadge
  setStatusFilter: (val: 'ALL' | RiskStatusBadge) => void
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const StudentAttendanceRosterTable: React.FC<StudentAttendanceRosterTableProps> = ({
  roster,
  isLoading = false,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  pagination,
}) => {
  const getBadgeStyle = (status: RiskStatusBadge) => {
    switch (status) {
      case 'EXCELLENT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'GOOD':
        return 'bg-blue-50 text-brand-primary border-blue-200'
      case 'AVERAGE':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'AT_RISK':
        return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-xs space-y-5">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-urbanist text-slate-900">
            Student Attendance Roster & Risk Tracking
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Individual student breakdown with attendance percentages and intervention badges.
          </p>
        </div>

        {/* Search & Risk Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Input
              placeholder="Search student or reg no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            {(['ALL', 'EXCELLENT', 'GOOD', 'AVERAGE', 'AT_RISK'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold font-urbanist transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'AT_RISK' ? 'At Risk' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">Registration No</th>
              <th className="py-3.5 px-4">Class & Section</th>
              <th className="py-3.5 px-4 text-center">Total Days</th>
              <th className="py-3.5 px-4 text-center">Present</th>
              <th className="py-3.5 px-4 text-center">Absent</th>
              <th className="py-3.5 px-4 text-center">Late</th>
              <th className="py-3.5 px-4 text-center">Attendance %</th>
              <th className="py-3.5 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="size-6 text-brand-primary animate-spin" />
                    <span>Loading student roster data...</span>
                  </div>
                </td>
              </tr>
            ) : roster.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="size-6 text-slate-400" />
                    <span>No student attendance records match criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              roster.map((row) => (
                <tr key={row.student_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-urbanist">
                    {row.student_name}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-500">{row.registration_no}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-600 font-medium">
                    {row.class_name} {row.section_name !== 'N/A' && `(${row.section_name})`}
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                    {row.total_days}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-600">
                    {row.present_days}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-rose-600">
                    {row.absent_days}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-amber-600">
                    {row.late_days}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold font-urbanist text-slate-900">
                    {row.attendance_percentage}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getBadgeStyle(
                        row.status_badge
                      )}`}
                    >
                      {row.status_badge === 'AT_RISK' ? 'At Risk' : row.status_badge}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-600">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} students total)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 px-3 rounded-lg"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 px-3 rounded-lg"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
