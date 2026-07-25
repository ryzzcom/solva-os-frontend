export interface StudentProfileHeaderData {
  profile_picture_url?: string | null
  full_name: string
  registration_no: string
  class_name: string
  section_name: string
}

export interface StudentProfileKPIs {
  attendance_percentage: number
  academic_rank: string
  pending_fees: number
  pending_homework: number
}

export interface StudentProfileSummaryResponse {
  header: StudentProfileHeaderData
  kpis: StudentProfileKPIs
}

export interface PersonalInformationData {
  full_name: string
  registration_no: string
  gender: string
  dob: string
  blood_group: string
  phone_number: string
  email?: string
  address?: string
  country?: string
  city?: string
  created_at?: string
}

export interface AcademicEnrollmentData {
  academic_year: string
  class_name: string
  section_name: string
  class_id?: string
  section_id?: string
  roll_number?: string | number
  class_teacher?: string
  assigned_subjects: string[]
}

export interface GuardianDetailsData {
  guardian_type: string
  relation: string
  guardian_name: string
  guardian_phone: string
}

export interface StudentPersonalProfileResponse {
  personal_information: PersonalInformationData
  academic_enrollment: AcademicEnrollmentData
  guardian_details: GuardianDetailsData
  id_card_url?: string
}

export interface StudentExamResultItem {
  student_name: string
  registration_no: string
  exam_name: string
  percentage: string
  grade: string
  status: 'Pass' | 'Failed' | string
}

export type StudentExamResultsResponse = StudentExamResultItem[]

export interface StudentHomeworkItem {
  subject: string
  title: string
  description?: string
  teacher_name?: string
  due_date: string
  grade: string
  status: 'Submitted' | 'Pending' | 'Overdue' | 'Late' | 'Unsubmitted' | string
}

export type StudentHomeworkResponse = StudentHomeworkItem[]

export interface UpdateStudentPayload {
  full_name?: string
  dob?: string
  gender?: 'Male' | 'Female' | 'Other' | string
  blood_group?: string
  country?: string
  city?: string
  address?: string
  class_id?: string
  section_id?: string
  class_name?: string
  section_name?: string
  guardian_type?: 'PARENT' | 'GUARDIAN' | string
  father_name?: string
  father_phone?: string
  guardian_name?: string
  relation?: string
  guardian_phone?: string
  profile_picture?: File | null
  profile_picture_url?: string
}



