import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AcademicReportQueryParams, AcademicKPIsData } from '../types/reports.types'

export const useAcademicKPIs = (params: AcademicReportQueryParams = {}) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<AcademicKPIsData, Error>({
    queryKey: ['reports-academic-kpis', schoolId, params],
    queryFn: async () => {
      const response = await axiosInstance.get('/reports/academic/kpis', { params })
      const payload = response.data?.data || response.data
      return payload as AcademicKPIsData
    },
    staleTime: 60 * 1000,
  })
}
