import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AcademicReportQueryParams, SubjectSummaryItem } from '../types/reports.types'

export const useSubjectSummary = (params: AcademicReportQueryParams = {}) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<SubjectSummaryItem[], Error>({
    queryKey: ['reports-academic-subject-summary', schoolId, params],
    queryFn: async () => {
      const response = await axiosInstance.get('/reports/academic/subject-summary', { params })
      const payload = response.data?.data || response.data
      return (Array.isArray(payload) ? payload : []) as SubjectSummaryItem[]
    },
    staleTime: 60 * 1000,
  })
}
