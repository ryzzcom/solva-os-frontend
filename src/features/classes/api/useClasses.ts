import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface BackendSectionItem {
  id?: string
  section_id?: string
  name?: string
  section_name?: string
  student_count?: number
  current_students?: number
  max_capacity?: number
  subjects?: any[]
}

export interface BackendClassItem {
  id: string
  name: string
  class_name?: string
  sections_count?: number
  sections?: BackendSectionItem[]
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
  })
}
