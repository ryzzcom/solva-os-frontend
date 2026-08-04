import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { ProfileAndSchoolSettingsResponse } from '../types/settings.types'

export const useProfileAndSchoolSettings = () => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)

  return useQuery<ProfileAndSchoolSettingsResponse, Error>({
    queryKey: ['settings-profile-and-school', schoolId],
    queryFn: async () => {
      const response = await axiosInstance.get('/settings/profile-and-school')
      const payload = response.data?.data || response.data
      return payload as ProfileAndSchoolSettingsResponse
    },
    staleTime: 60 * 1000,
  })
}
