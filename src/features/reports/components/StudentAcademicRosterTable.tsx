import React from 'react'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { StudentAcademicRosterItem, AcademicStatusBadge } from '../types/reports.types'

interface StudentAcademicRosterTableProps {
  roster: StudentAcademicRosterItem[]
  isLoading?: boolean
  search: string
  setSearch: (val: string) => void
  statusFilter: 'ALL' | AcademicStatusBadge
  setStatusFilter: (val: 'ALL' | AcademicStatusBadge) => void
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const StudentAcademicRosterTable: React.FC<StudentAcademicRosterTableProps> = ({
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
  const getBadgeStyle = (status: AcademicStatusBadge) => {
    switch (status) {
      case 'EXCELLENT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'GOOD':
        return 'bg-blue-50 text-brand-primary border-blue-200'
      case 'SATISFACTORY':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'NEEDS_SUPPORT':
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
            Student Academic Roster & Performance Rankings
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Detailed breakdown of individual student marks, percentages, grade letters, and support status.
          </p>
        </div>

        {/* Search & Academic Status Tabs */}
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
            {(['ALL', 'EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_SUPPORT'] as const).map((tab) => (
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
                {tab === 'NEEDS_SUPPORT' ? 'Needs Support' : tab.charAt(0) + tab.slice(1).toLowerCase()}
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
              <th className="py-3.5 px-4 text-center">Exams Taken</th>
              <th className="py-3.5 px-4 text-center">Marks Obtained / Max</th>
              <th className="py-3.5 px-4 text-center">Average %</th>
              <th className="py-3.5 px-4 text-center">Grade</th>
              <th className="py-3.5 px-4 text-right">Academic Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="size-6 text-brand-primary animate-spin" />
                    <span>Loading student academic data...</span>
                  </div>
                </td>
              </tr>
            ) : roster.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="size-6 text-slate-400" />
                    <span>No academic performance records match criteria.</span>
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
                    {row.total_exams_taken}
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                    <span className="text-slate-900 font-bold">{row.total_marks_obtained}</span> /{' '}
                    <span className="text-slate-500">{row.max_possible_marks}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold font-urbanist text-slate-900">
                    {row.average_percentage}%
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 font-urbanist">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                      {row.grade_letter}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getBadgeStyle(
                        row.academic_status
                      )}`}
                    >
                      {row.academic_status === 'NEEDS_SUPPORT' ? 'Needs Support' : row.academic_status}
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
