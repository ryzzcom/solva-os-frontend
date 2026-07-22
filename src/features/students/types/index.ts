export interface StudentItem {
  id: string
  full_name: string
  roll_no: string
  class_name: string
  section_name: string
  gender?: string
  father_name?: string
  father_phone?: string
  status: string
  avatar_url?: string
  enrollment_date?: string

  // Legacy accessor properties for table components
  name?: string
  rollNo?: string
  classSection?: string
  parentContact?: string
  attendancePercentage?: number
}

export interface StudentsDirectoryResponse {
  students: StudentItem[]
  totalCount: number
  page: number
  limit: number
}

export interface StudentsQueryParams {
  page?: number
  limit?: number
  search?: string
  class_id?: string
  section_id?: string
  status?: string
}

export interface CreateStudentPayload {
  full_name: string
  profile_picture_url?: string
  dob: string
  gender: 'Male' | 'Female' | 'Other'
  blood_group?: string
  country?: string
  city?: string
  address?: string
  class_id: string
  section_id: string
  registration_no?: string
  guardian_type: 'PARENT' | 'GUARDIAN'
  father_name?: string
  father_phone?: string
  guardian_name?: string
  relation?: string
  guardian_phone?: string
  subjects?: string[]
}
