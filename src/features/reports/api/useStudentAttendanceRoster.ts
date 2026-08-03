import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AttendanceReportQueryParams, StudentAttendanceRosterResponse } from '../types/reports.types'

export const useStudentAttendanceRoster = (params: AttendanceReportQueryParams = {}) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<StudentAttendanceRosterResponse, Error>({
    queryKey: ['reports-student-attendance-roster', schoolId, params],
    queryFn: async () => {
      const response = await axiosInstance.get('/reports/attendance/roster', {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.start_date ? { start_date: params.start_date } : {}),
          ...(params.end_date ? { end_date: params.end_date } : {}),
          ...(params.class_id && params.class_id !== 'ALL' ? { class_id: params.class_id } : {}),
          ...(params.section_id && params.section_id !== 'ALL' ? { section_id: params.section_id } : {}),
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
