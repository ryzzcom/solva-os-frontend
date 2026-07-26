export interface TeacherItem {
  id: string
  employee_id: string
  full_name: string
  email: string
  department: string
  teacher_leader?: string | null
  assigned_classes: string[]
  status: 'Present' | 'Absent' | 'On Leave' | 'Not Marked' | string
  avatar_url?: string | null
  phone_number?: string
  qualification?: string
}

export interface TeachersDirectoryPagination {
  total: number
  page: number
  limit: number
  totalPages?: number
}

export interface TeachersDirectoryResponse {
  teachers: TeacherItem[]
  pagination: TeachersDirectoryPagination
  totalCount?: number
}

export interface TeachersQueryParams {
  page?: number
  limit?: number
  search?: string
  department_id?: string
  class_id?: string
  section_id?: string
  status?: string
}

export interface CreateTeacherPayload {
  full_name: string
  email: string
  cnic_number: string
  dob?: string
  gender?: 'Male' | 'Female' | 'Other' | string
  phone_number?: string
  department_name?: string
  designation?: string
  joining_date?: string
  monthly_salary?: number | string
  class_id?: string
  section_id?: string
  registration_no?: string
}

