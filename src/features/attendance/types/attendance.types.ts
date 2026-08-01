export interface AttendanceKpiCards {
  avg_student_attendance: number
  teacher_attendance_rate: number
  pending_leaves_count: number
  low_attendance_students_count: number
}

export interface SectionAttendanceItem {
  section_id?: string
  section_name: string
  total_students: number
  present: number
  absent: number
  status_color: 'GREEN' | 'ORANGE' | 'RED'
}

export interface ClassAttendanceItem {
  class_name: string
  attendance_percentage: number
  sections: SectionAttendanceItem[]
}

export interface AttendanceDashboardResponse {
  kpi_cards: AttendanceKpiCards
  class_wise_attendance: ClassAttendanceItem[]
}

export interface AttendanceDashboardQueryParams {
  classId?: string
  sectionId?: string
  date?: string
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE'

export interface SectionStudentAttendanceItem {
  student_id: string
  name: string
  registration_id: string
  today_status: AttendanceStatus
  last_7_days: AttendanceStatus[]
  attendance_percentage: number
}

export interface SectionStudentsAttendanceResponse {
  class_name: string
  section_name: string
  students: SectionStudentAttendanceItem[]
}

export interface TeacherFirstLesson {
  subject_name: string
  class_name: string | null
  section_name: string | null
  start_time: string
  end_time: string
}

export interface TeacherAttendanceItem {
  teacher_id: string
  name: string
  employee_id: string | null
  profile_picture_url?: string | null
  first_lesson: TeacherFirstLesson | null
  attendance_status: AttendanceStatus | null
}

export interface MarkTeacherAttendancePayload {
  teacher_id: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE'
}

export interface BulkMarkTeachersPresentPayload {
  date: string
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface LeaveRequestItem {
  id: string
  user_type: 'STUDENT' | 'TEACHER'
  name: string | null
  ref_id: string | null
  status: LeaveStatus
  start_date: string
  end_date: string
  reason_type: string
  description: string
}

export interface UpdateLeaveStatusPayload {
  id: string
  status: 'APPROVED' | 'REJECTED'
}
