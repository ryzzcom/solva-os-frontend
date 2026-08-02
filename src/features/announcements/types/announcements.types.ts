export type AudienceType = 'ALL' | 'STUDENT' | 'TEACHER'

export interface AnnouncementItem {
  id: string
  title: string
  description: string
  audience: AudienceType
  date: string
  class_id: string | null
  class_name: string
  section_id: string | null
  section_name: string
  created_at: string
}

export interface AnnouncementsPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AnnouncementsListResponse {
  announcements: AnnouncementItem[]
  pagination: AnnouncementsPagination
}

export interface AnnouncementsQueryParams {
  search?: string
  class_id?: string
  section_id?: string
  audience?: string
  page?: number
  limit?: number
}
