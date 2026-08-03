import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { NotificationItem } from '../types/notifications.types'

export const useNotificationDetails = (id?: string) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)
  const queryClient = useQueryClient()

  return useQuery<NotificationItem, Error>({
    queryKey: ['notification-details', schoolId, id],
    queryFn: async () => {
      if (!id) throw new Error('Notification ID is required')
      const response = await axiosInstance.get(`/notifications/${id}`)
      const payload = response.data?.data || response.data

      // Invalidate count & list as fetching detail auto-marks as read
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })

      return payload as NotificationItem
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  })
}
