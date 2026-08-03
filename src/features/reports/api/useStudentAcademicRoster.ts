import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AcademicReportQueryParams, StudentAcademicRosterResponse } from '../types/reports.types'

export const useStudentAcademicRoster = (params: AcademicReportQueryParams = {}) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<StudentAcademicRosterResponse, Error>({
    queryKey: ['reports-student-academic-roster', schoolId, params],
    queryFn: async () => {
      const response = await axiosInstance.get('/reports/academic/roster', {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.exam_id && params.exam_id !== 'ALL' ? { exam_id: params.exam_id } : {}),
          ...(params.class_id && params.class_id !== 'ALL' ? { class_id: params.class_id } : {}),
          ...(params.subject && params.subject !== 'ALL' ? { subject: params.subject } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.status_filter && params.status_filter !== 'ALL' ? { status_filter: params.status_filter } : {}),
        },
      })

      const payload = response.data?.data || response.data
      const meta = response.data?.meta

      return {
        roster: Array.isArray(payload) ? payload : payload?.roster || [],
        pagination: meta?.pagination || payload?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
      }
    },
    staleTime: 30 * 1000,
  })
}
