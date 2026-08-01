export type PtmStatus = 'Upcoming' | 'Completed' | 'Cancelled'

export interface PtmItem {
  ptm_id: string
  title: string
  description?: string | null
  date: string
  start_time: string
  end_time: string
  class_section: string
  status: PtmStatus
}

export interface PtmListResponse {
  ptm_list: PtmItem[]
}

export interface PtmQueryParams {
  search?: string
  classId?: string
  sectionId?: string
  status?: string
}
