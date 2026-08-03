import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AcademicReportQueryParams, GradeDistributionItem } from '../types/reports.types'

export const useGradeDistribution = (params: AcademicReportQueryParams = {}) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<GradeDistributionItem[], Error>({
    queryKey: ['reports-academic-grade-distribution', schoolId, params],
    queryFn: async () => {
      const response = await axiosInstance.get('/reports/academic/grade-distribution', { params })
      const payload = response.data?.data || response.data
      return (Array.isArray(payload) ? payload : []) as GradeDistributionItem[]
    },
    staleTime: 60 * 1000,
  })
}
