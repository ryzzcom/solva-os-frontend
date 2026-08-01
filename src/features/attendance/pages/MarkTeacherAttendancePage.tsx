import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  CheckCheck,
  Loader2,
  AlertCircle,
  UserCheck,
} from 'lucide-react'
import { HasRole } from '@/components/auth/HasRole'
import {
  useTeachersAttendanceList,
  useMarkTeacherAttendance,
  useBulkMarkTeachersPresent,
} from '../api/useTeacherAttendance'
import type { TeacherAttendanceItem } from '../types/attendance.types'

export const MarkTeacherAttendancePage: React.FC = () => {
  const navigate = useNavigate()

  // Date state (defaults to today's date in YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )

  // API hooks
  const {
    data: teachersList = [],
    isLoading,
    isError,
    refetch,
  } = useTeachersAttendanceList(selectedDate)

  const markMutation = useMarkTeacherAttendance()
  const bulkMarkMutation = useBulkMarkTeachersPresent()

  const handleMarkSingle = (teacherId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    markMutation.mutate({
      teacher_id: teacherId,
      date: selectedDate,
      status,
    })
  }

  const handleBulkMarkPresent = () => {
    bulkMarkMutation.mutate({
      date: selectedDate,
    })
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Breadcrumb & Actions Banner */}
      <div className="space-y-4">
        {/* Breadcrumb Row */}
        <div className="flex items-center gap-2 text-xs md:text-sm font-sans text-slate-500">
          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            Principal Dashboard.
          </button>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-semibold text-navy-main font-urbanist">
            Teacher Attendance
          </span>
        </div>

        {/* Title Banner & Bulk Mark Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-navy-main flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/attendance')}
                className="p-1.5 rounded-xl border border-card-border hover:bg-slate-100 text-slate-600 transition-colors"
                title="Back to Attendance Overview"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span>Mark Teacher Attendance</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Picker Control */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-card-border rounded-xl text-xs font-bold font-urbanist text-slate-700 shadow-xs">
              <Calendar className="size-4 text-brand-primary" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none outline-none font-urbanist text-xs text-slate-800 cursor-pointer"
              />
            </div>

            {/* Mark All Present Primary Action Button */}
            <HasRole allowedRoles={['SUPER_ADMIN', 'PRINCIPAL']}>
              <button
                type="button"
                disabled={bulkMarkMutation.isPending || isLoading}
                onClick={handleBulkMarkPresent}
                className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-urbanist font-medium text-xs md:text-sm transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                {bulkMarkMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCheck className="size-4 stroke-[2.5]" />
                )}
                <span>Mark All Present</span>
              </button>
            </HasRole>
          </div>
        </div>
      </div>

      {/* 2. Teachers Roster Table Container */}
      <div className="bg-white border border-card-border rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-8 text-brand-primary animate-spin" />
            <span>Loading faculty members list...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-700 font-sans space-y-3">
            <AlertCircle className="size-8 text-rose-600 mx-auto" />
            <p className="font-semibold text-sm">Failed to load teacher attendance roster.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : teachersList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-sans text-sm space-y-2">
            <UserCheck className="size-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No active faculty members found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-slate-50/70 text-xs font-bold font-urbanist text-slate-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Teacher Info</th>
                  <th className="py-4 px-6">First Lesson</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6 text-center">Status Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachersList.map((teacher: TeacherAttendanceItem) => {
                  const initials = teacher.name
                    ? teacher.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()
                    : 'FC'

                  // Format First Lesson info text
                  let lessonText = 'No scheduled lesson'
                  if (teacher.first_lesson) {
                    const cls = teacher.first_lesson.class_name || ''
                    const sec = teacher.first_lesson.section_name || ''
                    const time = teacher.first_lesson.start_time
                      ? ` (${teacher.first_lesson.start_time})`
                      : ''
                    lessonText = `${cls} - ${sec}${time}`
                  }

                  const subjectText = teacher.first_lesson?.subject_name || 'General Faculty'

                  const currentStatus = teacher.attendance_status

                  return (
                    <tr
                      key={teacher.teacher_id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* 1. Teacher Info Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-brand-soft text-brand-primary font-bold text-sm flex items-center justify-center font-urbanist shrink-0">
                            {initials}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <p className="font-bold text-sm font-urbanist text-navy-main truncate">
                              {teacher.name}
                            </p>
                            <p className="text-xs font-sans text-slate-500 truncate">
                              ID: #{teacher.employee_id || teacher.teacher_id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. First Lesson Column */}
                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold font-urbanist text-slate-700">
                          {lessonText}
                        </span>
                      </td>

                      {/* 3. Subject Column */}
                      <td className="py-4 px-6">
                        <span className="text-xs font-sans text-slate-600">
                          {subjectText}
                        </span>
                      </td>

                      {/* 4. Segmented Status Toggle Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center p-1.5 bg-slate-100 border border-slate-200 rounded-2xl gap-1 max-w-sm mx-auto">
                          {/* PRESENT Button */}
                          <button
                            type="button"
                            onClick={() => handleMarkSingle(teacher.teacher_id, 'PRESENT')}
                            disabled={markMutation.isPending}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-urbanist flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              currentStatus === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200/70'
                            }`}
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>PRESENT</span>
                          </button>

                          {/* ABSENT Button */}
                          <button
                            type="button"
                            onClick={() => handleMarkSingle(teacher.teacher_id, 'ABSENT')}
                            disabled={markMutation.isPending}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-urbanist flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              currentStatus === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200/70'
                            }`}
                          >
                            <XCircle className="size-3.5" />
                            <span>ABSENT</span>
                          </button>

                          {/* LATE Button */}
                          <button
                            type="button"
                            onClick={() => handleMarkSingle(teacher.teacher_id, 'LATE')}
                            disabled={markMutation.isPending}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-urbanist flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              currentStatus === 'LATE'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-200/70'
                            }`}
                          >
                            <Clock className="size-3.5" />
                            <span>LATE</span>
                          </button>
                        </div>
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

export default MarkTeacherAttendancePage
