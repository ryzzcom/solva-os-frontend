import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { ResetPasswordInput } from '../schemas/resetPasswordSchema'

interface ResetPasswordPayload extends ResetPasswordInput {
  token: string
}

interface ResetPasswordResponse {
  message: string
}

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post<ResetPasswordResponse>('/auth/reset-password', {
        token: data.token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })
      return response.data
    },
  })
}
