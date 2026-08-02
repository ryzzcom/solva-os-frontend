import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { HomeworkOverviewResponse, HomeworkQueryParams } from '../types/homework.types'

export const useHomeworkOverview = (params?: HomeworkQueryParams) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)
  return useQuery({
    queryKey: ['homework-overview', schoolId, params?.classId, params?.sectionId],
    queryFn: async () => {
      const response = await axiosInstance.get('/homework/overview', {
        params: {
          ...(params?.classId ? { classId: params.classId } : {}),
          ...(params?.sectionId ? { sectionId: params.sectionId } : {}),
        },
      })

      const payload = response.data?.data || response.data
      return payload as HomeworkOverviewResponse
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}
