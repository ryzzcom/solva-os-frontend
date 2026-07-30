import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface ClassTeacherInfo {
  id: string
  full_name: string
  profile_picture_url?: string | null
}

export interface SectionOverviewItem {
  section_id: string
  section_name: string
  current_students: number
  max_capacity: number
  progress_percentage: number
  subjects?: any[]
  class_teacher?: ClassTeacherInfo | null
}

export interface ClassSectionsOverviewResponse {
  class_id: string
  class_name: string
  sections: SectionOverviewItem[]
}

export const useClassSectionsOverview = (classId?: string) => {
  return useQuery<ClassSectionsOverviewResponse, Error>({
    queryKey: ['class-sections-overview-full', classId],
    queryFn: async () => {
      if (!classId) throw new Error('Class ID is required')
      const { data } = await axiosInstance.get(`/classes/${classId}/sections`)
      const raw = data?.data || data
      return {
        class_id: raw?.class_id || classId,
        class_name: raw?.class_name || 'Class Sections',
        sections: raw?.sections || [],
      }
    },
    enabled: Boolean(classId),
    staleTime: 5 * 60 * 1000, // 5 minutes caching
  })
}
