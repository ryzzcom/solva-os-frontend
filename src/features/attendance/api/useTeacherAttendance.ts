import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type {
  TeacherAttendanceItem,
  MarkTeacherAttendancePayload,
  BulkMarkTeachersPresentPayload,
} from '../types/attendance.types'

export const useTeachersAttendanceList = (date?: string) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)
  return useQuery({
    queryKey: ['teachers-attendance-list', schoolId, date],
    queryFn: async () => {
      const response = await axiosInstance.get('/attendance/teachers', {
        params: {
          ...(date ? { date } : {}),
        },
      })

      const payload = response.data?.data || response.data
      return (Array.isArray(payload) ? payload : []) as TeacherAttendanceItem[]
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

export const useMarkTeacherAttendance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: MarkTeacherAttendancePayload) => {
      const response = await axiosInstance.post('/attendance/teachers/mark', payload)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers-attendance-list'] })
      queryClient.invalidateQueries({ queryKey: ['attendance-dashboard'] })
    },
  })
}

export const useBulkMarkTeachersPresent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: BulkMarkTeachersPresentPayload) => {
      const response = await axiosInstance.post('/attendance/teachers/bulk-present', payload)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers-attendance-list'] })
      queryClient.invalidateQueries({ queryKey: ['attendance-dashboard'] })
    },
  })
}
