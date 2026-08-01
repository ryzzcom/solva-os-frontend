export interface HomeworkKpiCards {
  total_active_homework: number
  completed: number
  pending: number
  submission_rate: number
}

export interface HomeworkProgressStats {
  total_students: number
  submitted: number
  pending: number
  submission_percentage: number
}

export interface HomeworkOverviewItem {
  homework_id: string
  title: string
  description?: string
  subject: string
  due_date: string
  teacher_name: string
  class_section: string
  progress_stats: HomeworkProgressStats
}

export interface HomeworkOverviewResponse {
  kpi_cards: HomeworkKpiCards
  homework_list: HomeworkOverviewItem[]
}

export interface HomeworkQueryParams {
  classId?: string
  sectionId?: string
}

export type HomeworkSubmissionStatus = 'SUBMITTED' | 'PENDING' | 'LATE'

export interface HomeworkDetailsStudentSubmission {
  student_id: string
  name: string
  registration_id: string
  status: HomeworkSubmissionStatus
  submitted_at: string | null
  grade: string | null
}

export interface HomeworkDetailsResponse {
  homework_id: string
  title: string
  description: string
  subject: string
  due_date: string
  teacher_name: string
  class_section: string
  progress_stats: {
    total_students: number
    submitted: number
    pending: number
    completion_rate: number
  }
  student_submissions: HomeworkDetailsStudentSubmission[]
}
