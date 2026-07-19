import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { ForgotPasswordInput } from '../schemas/forgotPasswordSchema'

interface ForgotPasswordResponse {
  message: string
}

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordInput>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post<ForgotPasswordResponse>('/auth/forgot-password', {
        email: data.email,
      })
      return response.data
    },
  })
}
