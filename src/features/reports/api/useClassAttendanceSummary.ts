import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AttendanceReportQueryParams, ClassAttendanceSummaryItem } from '../types/reports.types'

export const useClassAttendanceSummary = (params: AttendanceReportQueryParams = {}) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<ClassAttendanceSummaryItem[], Error>({
    queryKey: ['reports-class-attendance-summary', schoolId, params],
    queryFn: async () => {
      const response = await axiosInstance.get('/reports/attendance/class-summary', { params })
      const payload = response.data?.data || response.data
      return (Array.isArray(payload) ? payload : []) as ClassAttendanceSummaryItem[]
    },
    staleTime: 60 * 1000,
  })
}
