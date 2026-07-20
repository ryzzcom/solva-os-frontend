import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'

interface VerifyOtpResponse {
  message?: string
  access_token?: string
  user?: {
    id: string
    name: string
    email: string
    role: string
    school_id?: string
    fullName?: string
    schoolId?: string
    profile_picture_url?: string | null
  }
  school?: {
    id: string
    schoolCode: string
    name: string
    email: string
    logo_url?: string | null
  }
  data?: {
    message?: string
    tempToken?: string
  }
}

interface VerifyOtpPayload {
  email: string
  code: string
  type?: 'signup' | 'forgot-password'
}

export const useVerifyOtp = () => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationFn: async (data) => {
      const endpoint = data.type === 'forgot-password' ? '/auth/verify-otp' : '/auth/verify-signup'
      const response = await axiosInstance.post<VerifyOtpResponse>(endpoint, {
        email: data.email,
        code: data.code,
      })
      return response.data
    },
    onSuccess: (data) => {
      if (data.access_token && data.user) {
        const userPayload = {
          id: data.user.id,
          fullName: data.user.fullName || data.user.name || '',
          email: data.user.email,
          role: data.user.role,
          schoolId: data.user.schoolId || data.user.school_id || '',
          profile_picture_url: data.user.profile_picture_url || null,
          school: data.school || null,
        }
        useAuthStore.getState().setAuth(userPayload, data.access_token)
      }
    },
  })
}
