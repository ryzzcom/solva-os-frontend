import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { User, School } from '@/store/authStore'

export interface AuthMeResponse {
  user: User
  school: School | null
}

export const useAuthMe = () => {
  const token = useAuthStore((state) => state.accessToken)
  const updateUser = useAuthStore((state) => state.updateUser)
  const updateSchool = useAuthStore((state) => state.updateSchool)

  const query = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const response = await axiosInstance.get('/auth/me')
      const payload = response.data?.data || response.data
      return payload as AuthMeResponse
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
    retry: 1,
  })

  useEffect(() => {
    if (query.data) {
      if (query.data.user) {
        updateUser(query.data.user)
      }
      if (query.data.school) {
        updateSchool(query.data.school)
      }
    }
  }, [query.data, updateUser, updateSchool])

  return query
}
