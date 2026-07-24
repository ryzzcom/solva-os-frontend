export interface AttendanceStats {
  attendance_rate: number
  total_school_days: number
  days_present: number
  total_absences: number
}

export interface MonthlyCalendarDay {
  date: string // ISO date "YYYY-MM-DD"
  status: 'PRESENT' | 'ABSENT' | 'LATE' | string
}

export interface RecentLog {
  date: string // ISO date "YYYY-MM-DD"
  check_in?: string // e.g. "08:42 AM"
  status: 'PRESENT' | 'ABSENT' | 'LATE' | string
  reason?: string
}

export interface StudentAttendanceProfileResponse {
  stats: AttendanceStats
  monthly_calendar: MonthlyCalendarDay[]
  recent_logs: RecentLog[]
}
