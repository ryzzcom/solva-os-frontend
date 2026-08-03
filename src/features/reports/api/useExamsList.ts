import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'

export interface ExamItem {
  id: string
  title: string
  class_id?: string
}

export const useExamsList = () => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<ExamItem[], Error>({
    queryKey: ['exams-list', schoolId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/exams')
        const payload = response.data?.data || response.data
        return (Array.isArray(payload) ? payload : payload?.exams || []) as ExamItem[]
      } catch (err) {
        return []
      }
    },
    staleTime: 60 * 1000,
  })
}
