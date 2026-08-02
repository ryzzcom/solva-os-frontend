import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore, type User } from '@/store/authStore'

export interface GoogleAuthResponse {
  status: string
  data: {
    accessToken: string
    user: {
      id: string
      email: string
      full_name: string
      role: string
      school_id?: string | null
      schoolId?: string | null
      is_active: boolean
      school?: any | null
    }
  }
}

export const useGoogleAuth = () => {
  return useMutation({
    mutationFn: async (googleToken: string) => {
      const response = await axiosInstance.post('/auth/google', {
        token: googleToken,
      })
      return response.data as GoogleAuthResponse
    },
    onSuccess: (res: any) => {
      const payload = res?.data || res
      const token = payload?.accessToken || payload?.access_token
      const rawUser = payload?.user

      if (token && rawUser) {
        const schoolId = rawUser.school_id ?? rawUser.schoolId ?? null
        const formattedUser: User = {
          id: rawUser.id,
          fullName: rawUser.full_name || rawUser.fullName || rawUser.email.split('@')[0],
          email: rawUser.email,
          role: rawUser.role || 'PRINCIPAL',
          schoolId: schoolId,
          school: rawUser.school || null,
        }

        useAuthStore.getState().setAuth(formattedUser, token)
      }
    },
  })
}
