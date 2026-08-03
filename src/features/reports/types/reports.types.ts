export interface AttendanceReportQueryParams {
  start_date?: string
  end_date?: string
  class_id?: string
  section_id?: string
  search?: string
  status_filter?: 'ALL' | 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'AT_RISK'
  page?: number
  limit?: number
}

export interface AttendanceKPIsData {
  average_attendance_rate: number
  total_present: number
  total_absent: number
  total_late: number
  total_markings: number
  at_risk_students_count: number
}

export interface AttendanceTrendItem {
  date: string
  present: number
  absent: number
  late: number
  total: number
  percentage: number
}

export interface ClassAttendanceSummaryItem {
  class_id: string
  class_name: string
  total_students: number
  present_count: number
  absent_count: number
  late_count: number
  average_attendance_rate: number
}

export type RiskStatusBadge = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'AT_RISK'

export interface StudentAttendanceRosterItem {
  student_id: string
  student_name: string
  registration_no: string
  class_name: string
  section_name: string
  total_days: number
  present_days: number
  absent_days: number
  late_days: number
  attendance_percentage: number
  status_badge: RiskStatusBadge
}

export interface StudentAttendanceRosterResponse {
  roster: StudentAttendanceRosterItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
