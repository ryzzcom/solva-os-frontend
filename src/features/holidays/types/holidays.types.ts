export interface HolidayKpiCards {
  total_working_days: number
  total_holidays: number
  next_holiday: string
  days_remaining_for_holiday: number
}

export interface HolidayOverviewStatsResponse {
  kpi_cards: HolidayKpiCards
}

export type HolidayStatus = 'Completed' | 'Upcoming' | 'Scheduled' | 'ONGOING' | 'PAST'

export interface HolidayItem {
  holiday_id: string
  name: string
  type: string
  start_date: string
  end_date: string
  status: HolidayStatus
}

export interface HolidaysListResponse {
  holidays: HolidayItem[]
}

export interface WeeklyScheduleMap {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export interface WeeklyScheduleSummary {
  working_days_per_week: number
  holidays_per_week: number
  total_days_per_week: number
  monthly_avg_working_days: number
}

export interface WeeklyScheduleResponse {
  schedule: WeeklyScheduleMap
  summary: WeeklyScheduleSummary
}
