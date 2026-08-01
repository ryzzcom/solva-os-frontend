import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface SectionStudentItem {
  id?: string
  student_id?: string
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
      const rawStudentList = raw?.student_list || []
      const studentList: SectionStudentItem[] = Array.isArray(rawStudentList)
        ? rawStudentList.map((st: any) => {
            const sid = st.student_id || st.id || st.user_id || st.student_uuid || ''
            return {
              id: sid,
              student_id: sid,
              student_name: st.student_name || st.name || st.full_name || 'Student',
              registration_id: st.registration_id || st.registration_no || 'N/A',
              profile_pic: st.profile_pic || st.profile_picture_url || null,
              today_status: st.today_status || 'ABSENT',
              monthly_attendance_avg: st.monthly_attendance_avg || 0,
            }
          })
        : []

      return {
        header_info: raw?.header_info || {
          class_name: 'Class',
          section_name: 'Section',
          total_students: 0,
          max_capacity: 30,
          avg_attendance_percentage: 0,
        },
        assigned_subjects: raw?.assigned_subjects || [],
        student_list: studentList,
      }
    },
    enabled: Boolean(sectionId),
    staleTime: 30 * 1000,
  })
}
