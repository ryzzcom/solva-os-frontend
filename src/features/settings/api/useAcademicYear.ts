import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type {
  CurrentAcademicYearResponse,
  StudentPromotionItem,
  FinalizePurgePayload,
} from '../types/academic_year.types'

/**
 * GET /api/v1/settings/academic-year/current
 */
export const useGetCurrentSession = () => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<CurrentAcademicYearResponse, Error>({
    queryKey: ['current-academic-session', schoolId],
    queryFn: async () => {
      const response = await axiosInstance.get('/settings/academic-year/current')
      const payload = response.data?.data || response.data
      return payload as CurrentAcademicYearResponse
    },
    staleTime: 30 * 1000,
  })
}

/**
 * POST /api/v1/settings/academic-year/promote
 */
export const usePromoteStudents = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (promotions: StudentPromotionItem[]) => {
      const response = await axiosInstance.post('/settings/academic-year/promote', { promotions })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-academic-session'] })
      queryClient.invalidateQueries({ queryKey: ['students-overview'] })
    },
  })
}

/**
 * POST /api/v1/settings/academic-year/rollback
 */
export const useRollbackPromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/settings/academic-year/rollback')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-academic-session'] })
      queryClient.invalidateQueries({ queryKey: ['students-overview'] })
    },
  })
}

/**
 * POST /api/v1/settings/academic-year/finalize-purge
 */
export const useFinalizePurge = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: FinalizePurgePayload) => {
      const response = await axiosInstance.post('/settings/academic-year/finalize-purge', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-academic-session'] })
      queryClient.invalidateQueries({ queryKey: ['students-overview'] })
    },
  })
}
