import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AttendanceReportQueryParams, AttendanceTrendItem } from '../types/reports.types'

export const useAttendanceTrends = (params: AttendanceReportQueryParams = {}) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<AttendanceTrendItem[], Error>({
    queryKey: ['reports-attendance-trends', schoolId, params],
    queryFn: async () => {
      const response = await axiosInstance.get('/reports/attendance/trends', { params })
      const payload = response.data?.data || response.data
      return (Array.isArray(payload) ? payload : []) as AttendanceTrendItem[]
    },
    staleTime: 60 * 1000,
  })
}
