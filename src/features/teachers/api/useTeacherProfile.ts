import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface TeacherHeaderData {
  id: string
  profile_picture: string | null
  full_name: string
  employee_id: string | null
  department_name: string | null
  summary: string
  email: string
  phone_number: string | null
  kpi_class_leader: string
  kpi_avg_student_attendance: string
}

export interface ScheduleCardItem {
  class_name: string
  section_name: string
  subject_name: string
  start_time: string
  end_time: string
  active_days: string[]
}

export interface PersonalInformationData {
  id: string
  full_name: string
  dob: string | null
  gender: string | null
  phone_number: string | null
  email: string
  cnic_number: string | null
  joining_date: string | null
  monthly_salary: number | null
}

export interface TeacherProfileTabData {
  id: string
  schedule_cards: ScheduleCardItem[]
  personal_information: PersonalInformationData
}

export interface TeacherScheduleItem {
  day: string
  time: string
  class_section: string
  subject: string
}

export interface TeacherAttendanceTabData {
  kpi_stats: {
    attendance_rate: number
    total_school_days: number
    days_present: number
    total_absences: number
  }
  monthly_calendar: Array<{ date: string; status: string }>
  daily_logs: Array<{ date: string; mark_at: string; status: string }>
}

export interface TeacherLeaveItem {
  leave_type: string
  duration: string
  reason: string
  status: string
}

// 1. Fetch Header Data
export const useTeacherProfileHeader = (teacherId?: string) => {
  return useQuery({
    queryKey: ['teacher-profile-header', teacherId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/teachers/profile/${teacherId}/header`)
      return response.data?.data || response.data
    },
    enabled: !!teacherId,
  })
}

// 2. Fetch Profile Details Tab Data
export const useTeacherProfileTab = (teacherId?: string) => {
  return useQuery({
    queryKey: ['teacher-profile-tab', teacherId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/teachers/profile/${teacherId}/tab-profile`)
      return response.data?.data || response.data
    },
    enabled: !!teacherId,
  })
}

// 3. Fetch Classes & Schedule Tab Data
export const useTeacherScheduleTab = (teacherId?: string) => {
  return useQuery({
    queryKey: ['teacher-schedule-tab', teacherId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/teachers/profile/${teacherId}/tab-schedule`)
      return response.data?.data || response.data
    },
    enabled: !!teacherId,
  })
}

// 4. Fetch Attendance Tab Data
export const useTeacherAttendanceTab = (teacherId?: string, year?: number, month?: number) => {
  return useQuery({
    queryKey: ['teacher-attendance-tab', teacherId, year, month],
    queryFn: async () => {
      const params = year && month ? { year, month } : {}
      const response = await axiosInstance.get(`/teachers/profile/${teacherId}/tab-attendance`, { params })
      return response.data?.data || response.data
    },
    enabled: !!teacherId,
  })
}

// 5. Fetch Leave History Tab Data
export const useTeacherLeaveHistoryTab = (teacherId?: string) => {
  return useQuery({
    queryKey: ['teacher-leave-history-tab', teacherId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/teachers/profile/${teacherId}/tab-leave-history`)
      return response.data?.data || response.data
    },
    enabled: !!teacherId,
  })
}
