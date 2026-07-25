import React, { useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { useStudentHomework } from '../api/useStudentProfile'
import { Skeleton } from '@/components/ui/skeleton'

interface StudentHomeworkTabProps {
  studentId: string
}

export const StudentHomeworkTab: React.FC<StudentHomeworkTabProps> = ({ studentId }) => {
  const { data: homeworkList, isLoading, isError, error } = useStudentHomework(studentId)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Academic Pulse Skeleton */}
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 md:p-8 space-y-4 shadow-xs">
          <Skeleton className="h-7 w-48 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-xl space-y-2">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 md:p-8 space-y-4 shadow-xs">
          <Skeleton className="h-7 w-56 rounded-md" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white border border-rose-200 rounded-[16px] p-8 text-center space-y-3 shadow-xs">
        <div className="size-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="text-lg font-semibold font-urbanist text-slate-900">
          Failed to load homework assignments
        </h3>
        <p className="text-sm font-sans text-slate-500 max-w-md mx-auto">
          {error?.message || 'An error occurred while fetching homework records.'}
        </p>
      </div>
    )
  }

  const items = homeworkList || []

  // Dynamic calculations for Academic Pulse
  const completedCount = items.filter(
    (item) => item.status.toLowerCase() === 'submitted'
  ).length

  const pendingCount = items.filter(
    (item) => item.status.toLowerCase() === 'pending' || item.status.toLowerCase() === 'unsubmitted'
  ).length

  const overdueCount = items.filter(
    (item) => item.status.toLowerCase() === 'overdue' || item.status.toLowerCase() === 'late'
  ).length

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filterStatus === 'ALL') return true
    if (filterStatus === 'SUBMITTED') return item.status.toLowerCase() === 'submitted'
    if (filterStatus === 'PENDING')
      return item.status.toLowerCase() === 'pending' || item.status.toLowerCase() === 'unsubmitted'
    if (filterStatus === 'OVERDUE')
      return item.status.toLowerCase() === 'overdue' || item.status.toLowerCase() === 'late'
    return true
  })

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* 1. Academic Pulse Stats Section */}
      <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
          <div className="size-10 rounded-xl bg-[#2e67b1]/10 text-[#2e67b1] flex items-center justify-center">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-urbanist text-[#0f172a] tracking-tight">
              Academic Pulse
            </h3>
            <p className="text-xs font-sans text-slate-500">
              Overview of student homework activity and assignment statuses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Completed Stat */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 flex items-center justify-between transition-all hover:shadow-xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 font-urbanist">
                  Completed
                </span>
                <p className="text-2xl font-bold text-emerald-950 font-urbanist">
                  {completedCount}
                </p>
              </div>
            </div>
            <span className="text-xs font-sans text-emerald-600 bg-white/80 px-2.5 py-1 rounded-full border border-emerald-200">
              Submissions
            </span>
          </div>

          {/* Pending Stat */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 flex items-center justify-between transition-all hover:shadow-xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock className="size-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 font-urbanist">
                  Pending
                </span>
                <p className="text-2xl font-bold text-amber-950 font-urbanist">
                  {pendingCount}
                </p>
              </div>
            </div>
            <span className="text-xs font-sans text-amber-600 bg-white/80 px-2.5 py-1 rounded-full border border-amber-200">
              In Progress
            </span>
          </div>

          {/* Overdue Stat */}
          <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-4 flex items-center justify-between transition-all hover:shadow-xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 font-urbanist">
                  Overdue
                </span>
                <p className="text-2xl font-bold text-rose-950 font-urbanist">
                  {overdueCount}
                </p>
              </div>
            </div>
            <span className="text-xs font-sans text-rose-600 bg-white/80 px-2.5 py-1 rounded-full border border-rose-200">
              Needs Action
            </span>
          </div>
        </div>
      </div>

      {/* 2. Recent Assignments Section */}
      <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 md:p-8 space-y-6 shadow-xs">
        {/* Card Header & Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold font-urbanist text-[#0f172a] tracking-tight">
              Recent Assignments
            </h3>
            <p className="text-xs font-sans text-slate-500">
              Detailed list of assigned tasks, due dates, submission status, and marks.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium font-sans">
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterStatus === 'ALL'
                    ? 'bg-white text-[#2e67b1] font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('SUBMITTED')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterStatus === 'SUBMITTED'
                    ? 'bg-white text-[#2e67b1] font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Submitted
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('PENDING')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterStatus === 'PENDING'
                    ? 'bg-white text-[#2e67b1] font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
            </div>

            {/* Export PDF Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium font-urbanist text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="size-3.5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Assignments Table */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="size-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <FileText className="size-6" />
            </div>
            <h4 className="text-base font-semibold font-urbanist text-slate-800">
              No assignments found
            </h4>
            <p className="text-xs font-sans text-slate-500 max-w-sm mx-auto">
              There are no homework assignments matching the selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600 font-urbanist">
                  <th className="py-3.5 px-4 md:px-6">Subject</th>
                  <th className="py-3.5 px-4 md:px-6">Assignment Title</th>
                  <th className="py-3.5 px-4 md:px-6">Teacher / Assigned</th>
                  <th className="py-3.5 px-4 md:px-6">Due Date</th>
                  <th className="py-3.5 px-4 md:px-6 text-center">Status</th>
                  <th className="py-3.5 px-4 md:px-6 text-center">Grade</th>
                  <th className="py-3.5 px-4 md:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-sans">
                {filteredItems.map((hw, idx) => {
                  const statusLower = hw.status.toLowerCase()
                  const isSubmitted = statusLower === 'submitted'
                  const isOverdue = statusLower === 'overdue' || statusLower === 'late'

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/60 transition-colors duration-150"
                    >
                      {/* Subject */}
                      <td className="py-4 px-4 md:px-6 font-semibold text-[#0f172a] font-urbanist">
                        {hw.subject}
                      </td>

                      {/* Assignment Title & Description */}
                      <td className="py-4 px-4 md:px-6">
                        <div className="font-medium text-slate-900 font-urbanist">
                          {hw.title}
                        </div>
                        {hw.description && (
                          <div className="text-xs text-slate-500 truncate max-w-xs">
                            {hw.description}
                          </div>
                        )}
                      </td>

                      {/* Teacher */}
                      <td className="py-4 px-4 md:px-6 text-slate-600 text-xs">
                        {hw.teacher_name || 'N/A'}
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-4 md:px-6 text-slate-600 text-xs font-mono">
                        {hw.due_date}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 md:px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                            isSubmitted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isOverdue
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isSubmitted
                                ? 'bg-emerald-500'
                                : isOverdue
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {hw.status}
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="py-4 px-4 md:px-6 text-center">
                        <span className="inline-block px-2.5 py-0.5 text-xs rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          {hw.grade || 'N/A'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 md:px-6 text-right">
                        <button
                          type="button"
                          onClick={() => console.log('View homework', hw.title)}
                          className="inline-flex items-center gap-1 text-xs font-medium font-urbanist text-[#2e67b1] hover:underline cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
