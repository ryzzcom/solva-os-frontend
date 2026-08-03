import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AnnouncementItem } from '../types/announcements.types'

export const useAnnouncementDetails = (id?: string) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<AnnouncementItem, Error>({
    queryKey: ['announcement-details', schoolId, id],
    queryFn: async () => {
      if (!id) throw new Error('Announcement ID is required')
      const response = await axiosInstance.get(`/announcements/${id}`)
      const payload = response.data?.data || response.data
      return payload as AnnouncementItem
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  })
}
