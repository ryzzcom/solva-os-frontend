import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { HomeworkDetailsResponse } from '../types/homework.types'

export const useHomeworkDetails = (homeworkId?: string, status?: string) => {
  return useQuery({
    queryKey: ['homework-details', homeworkId, status],
    queryFn: async () => {
      if (!homeworkId) throw new Error('Homework ID is required')
      const response = await axiosInstance.get(`/homework/${homeworkId}/details`, {
        params: {
          ...(status && status !== 'ALL' ? { status } : {}),
        },
      })

      const payload = response.data?.data || response.data
      return payload as HomeworkDetailsResponse
    },
    enabled: Boolean(homeworkId),
    staleTime: 30 * 1000, // 30 seconds
  })
}
