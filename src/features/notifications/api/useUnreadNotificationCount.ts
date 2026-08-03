import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { UnreadCountResponse } from '../types/notifications.types'

export const useUnreadNotificationCount = () => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<UnreadCountResponse, Error>({
    queryKey: ['notifications-unread-count', schoolId],
    queryFn: async () => {
      const response = await axiosInstance.get('/notifications/unread-count')
      const payload = response.data?.data || response.data
      return { unread_count: payload?.unread_count ?? payload?.unreadCount ?? 0 }
    },
    staleTime: 15 * 1000,
  })
}
