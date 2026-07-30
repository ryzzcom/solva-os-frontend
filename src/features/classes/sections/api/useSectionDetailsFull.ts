import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface SectionStudentItem {
  student_name: string
  registration_id: string
  profile_pic?: string | null
  today_status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE' | string
  monthly_attendance_avg: number
}

export interface SectionDetailsFullResponse {
  header_info: {
    section_id?: string
    class_id?: string
    class_name: string
    section_name: string
    class_teacher_id?: string | null
    class_teacher?: {
      id?: string
      name: string
      pic?: string | null
    } | null
    total_students: number
    max_capacity: number
    avg_attendance_percentage: number
  }
  assigned_subjects: Array<{ subject_name: string }>
  student_list: SectionStudentItem[]
}

export const useSectionDetailsFull = (sectionId?: string) => {
  return useQuery<SectionDetailsFullResponse, Error>({
    queryKey: ['section-details-full', sectionId],
    queryFn: async () => {
      if (!sectionId) throw new Error('Section ID is required')
      const { data } = await axiosInstance.get(`/sections/${sectionId}/details`)
      const raw = data?.data || data
      return {
        header_info: raw?.header_info || {
          class_name: 'Class',
          section_name: 'Section',
          total_students: 0,
          max_capacity: 30,
          avg_attendance_percentage: 0,
        },
        assigned_subjects: raw?.assigned_subjects || [],
        student_list: raw?.student_list || [],
      }
    },
    enabled: Boolean(sectionId),
    staleTime: 5 * 60 * 1000,
  })
}
