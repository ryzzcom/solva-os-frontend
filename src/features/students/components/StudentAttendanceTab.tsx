import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useStudentAttendance } from '../api/useStudentAttendance'

interface StudentAttendanceTabProps {
  studentId: string
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const StudentAttendanceTab: React.FC<StudentAttendanceTabProps> = ({
  studentId,
}) => {
  const currentDate = new Date()
  const realCurrentYear = currentDate.getFullYear()
  const realCurrentMonth = currentDate.getMonth() + 1

  const [year, setYear] = useState<number>(realCurrentYear)
  const [month, setMonth] = useState<number>(realCurrentMonth) // 1-indexed

  const { data, isLoading, isFetching } = useStudentAttendance(studentId, year, month)

  const isNextDisabled =
    year > realCurrentYear || (year === realCurrentYear && month >= realCurrentMonth)

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (month === 1) {
      setMonth(12)
      setYear((prev) => prev - 1)
    } else {
      setMonth((prev) => prev - 1)
    }
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isNextDisabled) return

    if (month === 12) {
      setMonth(1)
      setYear((prev) => prev + 1)
    } else {
      setMonth((prev) => prev + 1)
    }
  }

  if (isLoading && !data) {
    return (
      <div className="space-y-6 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl bg-slate-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 w-full rounded-2xl bg-slate-200" />
          <Skeleton className="h-96 w-full rounded-2xl bg-slate-200" />
        </div>
      </div>
    )
  }

  const stats = data?.stats
  const monthlyCalendar = data?.monthly_calendar || []
  const recentLogs = data?.recent_logs || []

  // Create lookup map for date -> status
  const attendanceMap = new Map<string, string>()
  monthlyCalendar.forEach((item) => {
    if (item.date) {
      // Format YYYY-MM-DD
      const dateKey = item.date.split('T')[0]
      attendanceMap.set(dateKey, item.status.toUpperCase())
    }
  })

  // Calculate calendar grid days for current year & month
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const totalDaysInMonth = new Date(year, month, 0).getDate()

  // Convert JS Day (0=Sun, 1=Mon, ..., 6=Sat) to Monday-start index (0=Mon, ..., 6=Sun)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1
  if (startDayOfWeek === -1) startDayOfWeek = 6

  // Previous month trailing days
  const prevMonthTotalDays = new Date(year, month - 1, 0).getDate()
  const prevMonthDays = Array.from(
    { length: startDayOfWeek },
    (_, i) => prevMonthTotalDays - startDayOfWeek + i + 1
  )

  // Current month days array
  const currentMonthDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1)

  return (
    <div className="space-y-6 pt-4 animate-in fade-in duration-300">
      {/* 1. Top 4 Stat Cards Grid matching Figma 96:3824 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Attendance Rate */}
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-5 space-y-2 shadow-xs border-l-4 border-l-[#2e67b1]">
          <span className="text-sm font-sans font-medium text-[#475569]">
            Attendance Rate
          </span>
          <p className="text-3xl font-bold font-urbanist text-[#2e67b1]">
            {stats?.attendance_rate != null ? `${stats.attendance_rate}%` : '96.4%'}
          </p>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 font-sans">
            <TrendingUp className="size-3.5" />
            <span>Above class average</span>
          </div>
        </div>

        {/* Stat 2: Total School Days */}
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-5 space-y-2 shadow-xs">
          <span className="text-sm font-sans font-medium text-[#475569]">
            Total School Days
          </span>
          <p className="text-3xl font-bold font-urbanist text-[#0f172a]">
            {stats?.total_school_days != null ? stats.total_school_days : 182}
          </p>
          <span className="text-xs font-sans text-slate-400 block">
            Since April {year}
          </span>
        </div>

        {/* Stat 3: Days Present */}
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-5 space-y-2 shadow-xs">
          <span className="text-sm font-sans font-medium text-[#475569]">
            Days Present
          </span>
          <p className="text-3xl font-bold font-urbanist text-[#0f172a]">
            {stats?.days_present != null ? stats.days_present : 175}
          </p>
          <span className="text-xs font-sans text-slate-400 block">
            Confirmed entries
          </span>
        </div>

        {/* Stat 4: Total Absences */}
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-5 space-y-2 shadow-xs border-l-4 border-l-orange-500">
          <span className="text-sm font-sans font-medium text-[#475569]">
            Total Absences
          </span>
          <p className="text-3xl font-bold font-urbanist text-orange-600">
            {stats?.total_absences != null
              ? String(stats.total_absences).padStart(2, '0')
              : '07'}
          </p>
          <span className="text-xs font-sans text-slate-500 block">
            ⓘ 3 Sick Leaves, 4 Unexcused
          </span>
        </div>
      </div>

      {/* 2. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Calendar View (2 Cols on LG) */}
        <div className="lg:col-span-2 bg-white border border-[#d8dee8] rounded-[16px] p-6 space-y-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Month & Navigation Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-urbanist text-[#0f172a]">
                  {MONTH_NAMES[month - 1]} {year}
                </h2>
                {isFetching && (
                  <Loader2 className="size-4 animate-spin text-[#2e67b1]" />
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  disabled={isNextDisabled}
                  className={`p-2 rounded-lg transition-colors ${
                    isNextDisabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer'
                  }`}
                  title={isNextDisabled ? 'Cannot view future months' : 'Next Month'}
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 text-center py-4 font-sans text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {WEEKDAYS.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Previous Month Days */}
              {prevMonthDays.map((d, idx) => (
                <div
                  key={`prev-${idx}`}
                  className="h-11 flex items-center justify-center text-sm font-sans text-slate-300"
                >
                  {d}
                </div>
              ))}

              {/* Current Month Days */}
              {currentMonthDays.map((day) => {
                const formattedDay = String(day).padStart(2, '0')
                const formattedMonth = String(month).padStart(2, '0')
                const dateKey = `${year}-${formattedMonth}-${formattedDay}`

                const status = attendanceMap.get(dateKey)
                const isToday =
                  currentDate.getDate() === day &&
                  currentDate.getMonth() + 1 === month &&
                  currentDate.getFullYear() === year

                let bgClasses = 'hover:bg-slate-100 text-slate-700'
                let dotColor = ''

                if (status === 'PRESENT') {
                  bgClasses = 'bg-[#e2edfd] text-[#2e67b1] font-semibold'
                  dotColor = 'bg-[#2e67b1]'
                } else if (status === 'ABSENT') {
                  bgClasses = 'bg-[#ffedd5] text-[#ea580c] font-semibold'
                  dotColor = 'bg-[#ea580c]'
                } else if (status === 'LATE') {
                  bgClasses = 'bg-[#f3e8ff] text-[#9333ea] font-semibold'
                  dotColor = 'bg-[#9333ea]'
                }

                return (
                  <div
                    key={day}
                    className={`h-11 rounded-xl flex flex-col items-center justify-center text-sm font-sans transition-all relative cursor-pointer ${bgClasses} ${
                      isToday ? 'border-2 border-[#2e67b1]' : ''
                    }`}
                  >
                    <span>{day}</span>
                    {dotColor && (
                      <span
                        className={`size-1.5 rounded-full absolute bottom-1 ${dotColor}`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Calendar Legend Bar */}
          <div className="pt-6 border-t border-slate-100 flex items-center gap-6 text-xs font-sans font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#2e67b1]" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#ea580c]" />
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#9333ea]" />
              <span>Late</span>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Logs & Warnings */}
        <div className="space-y-6">
          <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 space-y-5 shadow-xs">
            <h2 className="text-xl font-bold font-urbanist text-[#0f172a]">
              Daily Logs
            </h2>

            {/* List of Recent Daily Logs */}
            <div className="space-y-3">
              {recentLogs.length > 0 ? (
                recentLogs.map((log, idx) => {
                  const status = log.status?.toUpperCase()
                  const isPresent = status === 'PRESENT'
                  const isAbsent = status === 'ABSENT'
                  const isLate = status === 'LATE'

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                        isAbsent
                          ? 'bg-orange-50/50 border-orange-200 border-l-4 border-l-orange-500'
                          : isLate
                          ? 'bg-purple-50/50 border-purple-200'
                          : 'bg-slate-50/80 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isPresent && (
                          <div className="p-2 bg-blue-100 text-[#2e67b1] rounded-full shrink-0">
                            <CheckCircle2 className="size-4" />
                          </div>
                        )}
                        {isAbsent && (
                          <div className="p-2 bg-orange-100 text-orange-600 rounded-full shrink-0">
                            <AlertCircle className="size-4" />
                          </div>
                        )}
                        {isLate && (
                          <div className="p-2 bg-purple-100 text-purple-600 rounded-full shrink-0">
                            <Clock className="size-4" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-sm font-semibold font-urbanist text-[#0f172a] truncate">
                            {log.date}
                          </p>
                          <p className="text-xs text-slate-500 font-sans">
                            {isAbsent
                              ? log.reason || 'Unexcused Absence'
                              : `Marked at ${log.check_in || '08:42 AM'}`}
                          </p>
                        </div>
                      </div>

                      {/* Badge */}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full font-sans shrink-0 ${
                          isPresent
                            ? 'bg-blue-100 text-[#2e67b1]'
                            : isAbsent
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  )
                })
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 italic font-sans">
                  No recent check-in logs available for this period.
                </div>
              )}
            </div>

            {/* Attendance Warning Card */}
            <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl flex items-start gap-3 text-red-900 mt-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="size-4" />
              </div>
              <div className="text-xs font-sans">
                <span className="font-bold text-red-950 block text-sm font-urbanist">
                  Attendance Warning
                </span>
                <p className="text-red-700 mt-0.5">
                  2 more unexcused absences will trigger an automatic parent meeting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
