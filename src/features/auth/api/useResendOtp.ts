import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

interface ResendOtpResponse {
  message: string
}

export const useResendOtp = () => {
  return useMutation<ResendOtpResponse, Error, { email: string }>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post<ResendOtpResponse>('/auth/resend-otp', {
        email: data.email,
      })
      return response.data
    },
  })
}
