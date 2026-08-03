import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AttendanceReportQueryParams, AttendanceKPIsData } from '../types/reports.types'

export const useAttendanceKPIs = (params: AttendanceReportQueryParams = {}) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<AttendanceKPIsData, Error>({
    queryKey: ['reports-attendance-kpis', schoolId, params],
    queryFn: async () => {
      const response = await axiosInstance.get('/reports/attendance/kpis', { params })
      const payload = response.data?.data || response.data
      return payload as AttendanceKPIsData
    },
    staleTime: 60 * 1000,
  })
}
