import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface SubjectItem {
  id?: string
  subject_id?: string
  name?: string
  subject_name?: string
}

export interface BackendSectionItem {
  id?: string
  section_id?: string
  name?: string
  section_name?: string
  student_count?: number
  current_students?: number
  max_capacity?: number
  progress_percentage?: number
  subjects?: (string | SubjectItem)[]
  class_teacher?: {
    id: string
    full_name: string
    profile_picture_url?: string | null
  } | null
}

export interface BackendClassItem {
  id: string
  name: string
  class_name?: string
  sections_count?: number
  total_students?: number
  description?: string
  sections?: BackendSectionItem[]
}

export interface ClassesOverviewKpiStats {
  total_classes: number
  total_sections: number
  total_students: number
  avg_students_per_class: number
}

export interface ClassesOverviewFullResponse {
  kpi_stats: ClassesOverviewKpiStats
  classes_list: BackendClassItem[]
}

export interface ClassDetailsFullResponse {
  class_id: string
  class_name: string
  sections: BackendSectionItem[]
}

export const useClassesOverviewFull = () => {
  return useQuery<ClassesOverviewFullResponse, Error>({
    queryKey: ['classes-overview-full'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/classes/overview')
      const raw = data?.data || data
      return {
        kpi_stats: {
          total_classes: raw?.kpi_stats?.total_classes ?? 0,
          total_sections: raw?.kpi_stats?.total_sections ?? 0,
          total_students: raw?.kpi_stats?.total_students ?? 0,
          avg_students_per_class: raw?.kpi_stats?.avg_students_per_class ?? 0,
        },
        classes_list: raw?.classes_list || (Array.isArray(raw) ? raw : []),
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useClassDetailsFull = (classId?: string) => {
  return useQuery<ClassDetailsFullResponse, Error>({
    queryKey: ['class-details-full', classId],
    queryFn: async () => {
      if (!classId) throw new Error('Class ID is required')
      const { data } = await axiosInstance.get(`/classes/${classId}/sections`)
      const raw = data?.data || data
      return {
        class_id: raw?.class_id || classId,
        class_name: raw?.class_name || '',
        sections: raw?.sections || [],
      }
    },
    enabled: Boolean(classId),
    staleTime: 5 * 60 * 1000,
  })
}

export const useClassesOverview = () => {
  return useQuery<BackendClassItem[], Error>({
    queryKey: ['classes-overview'],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get('/classes/overview')
        const raw = data?.data || data
        const list: BackendClassItem[] = raw?.classes_list || (Array.isArray(raw) ? raw : [])
        return list
      } catch (err) {
        return []
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useClassSections = (classId: string) => {
  return useQuery<BackendSectionItem[], Error>({
    queryKey: ['class-sections', classId],
    queryFn: async () => {
      if (!classId) return []
      try {
        const { data } = await axiosInstance.get(`/classes/${classId}/sections`)
        const raw = data?.data || data
        const list: BackendSectionItem[] = raw?.sections || (Array.isArray(raw) ? raw : [])
        return list
      } catch (err) {
        return []
      }
    },
    enabled: Boolean(classId),
    staleTime: 5 * 60 * 1000,
  })
}
