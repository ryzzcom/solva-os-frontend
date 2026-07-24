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
