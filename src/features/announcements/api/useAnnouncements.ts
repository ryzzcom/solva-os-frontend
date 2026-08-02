import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { AnnouncementsListResponse, AnnouncementsQueryParams } from '../types/announcements.types'

export const useAnnouncements = (params?: AnnouncementsQueryParams) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<AnnouncementsListResponse, Error>({
    queryKey: ['announcements', schoolId, params?.search, params?.class_id, params?.section_id, params?.audience, params?.page],
    queryFn: async () => {
      const response = await axiosInstance.get('/announcements', {
        params: {
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.class_id && params.class_id !== 'ALL' ? { class_id: params.class_id } : {}),
          ...(params?.section_id && params.section_id !== 'ALL' ? { section_id: params.section_id } : {}),
          ...(params?.audience && params.audience !== 'ALL' ? { audience: params.audience } : {}),
          ...(params?.page ? { page: params.page } : {}),
          ...(params?.limit ? { limit: params.limit } : { limit: 10 }),
        },
      })

      const payload = response.data?.data || response.data
      return payload as AnnouncementsListResponse
    },
    staleTime: 30 * 1000,
  })
}
