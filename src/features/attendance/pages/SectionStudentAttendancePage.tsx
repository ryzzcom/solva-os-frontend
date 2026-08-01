import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Calendar,
  ChevronLeft,
  Loader2,
  AlertCircle,
  UserCheck,
} from 'lucide-react'
import { useSectionStudentsAttendance } from '../api/useSectionStudentsAttendance'
import type { AttendanceStatus, SectionStudentAttendanceItem } from '../types/attendance.types'

export const SectionStudentAttendancePage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>()
  const navigate = useNavigate()

  // Date state (defaults to today's date in YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )

  const {
    data: attendanceData,
    isLoading,
    isError,
    refetch,
  } = useSectionStudentsAttendance(sectionId, selectedDate)

  const className = attendanceData?.class_name || 'Class'
  const sectionName = attendanceData?.section_name || 'Section'
  const fullTitle = `${className}-${sectionName.replace(/^Section\s*/i, '')}`
  const studentsList = attendanceData?.students || []

  // Format status badge pills
  const renderStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold font-sans">
            Present
          </span>
        )
      case 'LATE':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold font-sans">
            Late
          </span>
        )
      case 'LEAVE':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold font-sans">
            Leave
          </span>
        )
      case 'ABSENT':
      default:
        return (
          <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold font-sans">
            Absent
          </span>
        )
    }
  }

  // Format 7-day trend indicator bars
  const render7DayTrend = (last7Days: AttendanceStatus[] = []) => {
    // Fill up to 7 slots if array is shorter
    const slots = Array.from({ length: 7 }, (_, i) => last7Days[i] || 'ABSENT')

    return (
      <div className="flex items-center gap-1">
        {slots.map((status, idx) => {
          const isPresent = status === 'PRESENT' || status === 'LATE'
          return (
            <div
              key={idx}
              className={`w-2.5 h-6 rounded-xs transition-colors ${
                isPresent ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
              title={`Day ${idx + 1}: ${status}`}
            />
          )
        })}
      </div>
    )
  }

  // Format attendance percentage color
  const renderPercentageText = (pct: number) => {
    let colorClass = 'text-emerald-600'
    if (pct < 60) colorClass = 'text-rose-600'
    else if (pct < 80) colorClass = 'text-accent-orange'

    return (
      <span className={`text-base font-bold font-urbanist ${colorClass}`}>
        {Math.round(pct)}%
      </span>
    )
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Breadcrumb & Date Controls */}
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
            Student Attendance Records
          </span>
        </div>

        {/* Title Banner & Date Selector */}
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
              <span>{isLoading ? 'Class Attendance' : fullTitle}</span>
            </h1>
            <p className="text-sm font-sans text-slate-600 pl-11">
              Daily Attendance List
            </p>
          </div>

          {/* Date Picker Control */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-card-border rounded-xl text-xs font-bold font-urbanist text-slate-700 shadow-xs">
              <Calendar className="size-4 text-brand-primary" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none outline-none font-urbanist text-xs text-slate-800 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Roster Data Table Container */}
      <div className="bg-white border border-card-border rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-8 text-brand-primary animate-spin" />
            <span>Loading student attendance records...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-700 font-sans space-y-3">
            <AlertCircle className="size-8 text-rose-600 mx-auto" />
            <p className="font-semibold text-sm">Failed to load section student records.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : studentsList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-sans text-sm space-y-2">
            <UserCheck className="size-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No student records found for this section.</p>
            <p className="text-xs text-slate-400">Ensure students are enrolled in {fullTitle}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-slate-50/70 text-xs font-bold font-urbanist text-slate-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Student Info</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Last 7 Days</th>
                  <th className="py-4 px-6">Total %</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentsList.map((item: SectionStudentAttendanceItem) => {
                  const initials = item.name
                    ? item.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()
                    : 'ST'

                  return (
                    <tr
                      key={item.student_id}
                      onClick={() => navigate(`/students/${item.student_id}`)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* 1. Student Info Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-brand-soft text-brand-primary font-bold text-sm flex items-center justify-center font-urbanist shrink-0">
                            {initials}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <p className="font-bold text-sm font-urbanist text-navy-main group-hover:text-brand-primary transition-colors truncate">
                              {item.name}
                            </p>
                            <p className="text-xs font-sans text-slate-500 truncate">
                              ID: #{item.registration_id || item.student_id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Status Badge Column */}
                      <td className="py-4 px-6">
                        {renderStatusBadge(item.today_status)}
                      </td>

                      {/* 3. Last 7 Days Trend Column */}
                      <td className="py-4 px-6">
                        {render7DayTrend(item.last_7_days)}
                      </td>

                      {/* 4. Total % Column */}
                      <td className="py-4 px-6">
                        {renderPercentageText(item.attendance_percentage)}
                      </td>

                      {/* 5. Action Column */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/students/${item.student_id}`)
                          }}
                          className="p-2 rounded-xl text-slate-400 group-hover:text-brand-primary group-hover:bg-brand-soft transition-all"
                          title="View Student Profile"
                        >
                          <ChevronRight className="size-5" />
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

export default SectionStudentAttendancePage
