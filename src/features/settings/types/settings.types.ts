export interface PrincipalProfileData {
  id: string
  full_name: string
  email: string
  phone_number?: string | null
  profile_picture_url?: string | null
  role: string
}

export interface SchoolInfoData {
  id: string
  school_code: string
  school_name: string
  campus_name?: string | null
  website_url?: string | null
  phone_number?: string | null
  address?: string | null
  logo_url?: string | null
}

export interface ProfileAndSchoolSettingsResponse {
  profile: PrincipalProfileData
  school: SchoolInfoData
}

export interface UpdateSettingsFormData {
  full_name?: string
  phone_number?: string
  school_name?: string
  campus_name?: string
  website_url?: string
  school_phone?: string
  address?: string
  profile_picture?: File | null
  school_logo?: File | null
}
