export type AcademicYearStatus = 'ACTIVE' | 'PROMOTING_IN_WINDOW' | 'COMPLETED'

export interface AcademicYearData {
  id: string
  year_name: string
  start_date: string
  end_date: string
  status: AcademicYearStatus
}

export interface RollbackInfoData {
  is_rollback_available: boolean
  rollback_expires_in_seconds: number
  latest_log_id?: string | null
}

export interface CurrentAcademicYearResponse {
  academic_year: AcademicYearData
  rollback_info: RollbackInfoData
}

export type PromotionAction = 'PROMOTE' | 'GRADUATE' | 'RETAIN'

export interface StudentPromotionItem {
  student_id: string
  action: PromotionAction
  new_class_id?: string
  new_section_id?: string
}

export interface PromoteStudentsPayload {
  promotions: StudentPromotionItem[]
}

export interface FinalizePurgePayload {
  year_name: string
  start_date: string
  end_date: string
}
