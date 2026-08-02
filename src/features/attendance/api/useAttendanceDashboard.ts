import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AttendanceDashboardResponse, AttendanceDashboardQueryParams } from '../types/attendance.types'

export const useAttendanceDashboard = (params?: AttendanceDashboardQueryParams) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)
  return useQuery({
    queryKey: ['attendance-dashboard', schoolId, params?.classId, params?.sectionId, params?.date],
    queryFn: async () => {
      const response = await axiosInstance.get('/attendance/dashboard', {
        params: {
          ...(params?.classId ? { classId: params.classId } : {}),
          ...(params?.sectionId ? { sectionId: params.sectionId } : {}),
          ...(params?.date ? { date: params.date } : {}),
        },
      })

      const payload = response.data?.data || response.data
      return payload as AttendanceDashboardResponse
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}
