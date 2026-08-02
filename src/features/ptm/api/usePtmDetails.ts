import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { PtmItem } from '../types/ptm.types'

export const usePtmDetails = (ptmId?: string | null) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)
  return useQuery({
    queryKey: ['ptm-details', schoolId, ptmId],
    queryFn: async () => {
      if (!ptmId) throw new Error('PTM ID is required')
      const response = await axiosInstance.get(`/ptm/${ptmId}`)
      const payload = response.data?.data || response.data
      return payload as PtmItem
    },
    enabled: Boolean(ptmId),
    staleTime: 30 * 1000,
  })
}
