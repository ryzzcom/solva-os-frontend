import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

interface VerifyOtpResponse {
  message?: string
  access_token?: string
  user?: {
    id: string
    name: string
    email: string
    role: string
    school_id?: string
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
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    },
  })
}
