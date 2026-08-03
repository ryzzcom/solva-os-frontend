import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { NotificationsQueryParams, NotificationsListResponse } from '../types/notifications.types'

export const useNotifications = (params: NotificationsQueryParams = {}) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<NotificationsListResponse, Error>({
    queryKey: ['notifications', schoolId, params],
    queryFn: async () => {
      const response = await axiosInstance.get('/notifications', {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.is_read !== undefined && params.is_read !== 'ALL' ? { is_read: params.is_read } : {}),
          ...(params.type && params.type !== 'ALL' ? { type: params.type } : {}),
          ...(params.search ? { search: params.search } : {}),
        },
      })

      const payload = response.data?.data || response.data
      const meta = response.data?.meta

      return {
        notifications: Array.isArray(payload) ? payload : payload?.notifications || [],
        unread_count: meta?.unread_count ?? payload?.unreadCount ?? 0,
        pagination: meta?.pagination || payload?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
      }
    },
    staleTime: 15 * 1000,
  })
}
