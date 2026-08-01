import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { LeaveRequestItem, UpdateLeaveStatusPayload } from '../types/attendance.types'

export const useLeaveRequestsList = (status?: string) => {
  return useQuery({
    queryKey: ['leave-requests-list', status],
    queryFn: async () => {
      const response = await axiosInstance.get('/leaves', {
        params: {
          ...(status && status !== 'ALL' ? { status } : {}),
        },
      })

      const payload = response.data?.data || response.data
      return (Array.isArray(payload) ? payload : []) as LeaveRequestItem[]
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: UpdateLeaveStatusPayload) => {
      const response = await axiosInstance.patch(`/leaves/${id}/status`, { status })
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests-list'] })
      queryClient.invalidateQueries({ queryKey: ['attendance-dashboard'] })
    },
  })
}
