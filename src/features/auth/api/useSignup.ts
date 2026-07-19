import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { SignupInput } from '../schemas/signupSchema'

interface SignupResponse {
  message?: string
  access_token?: string
  user?: {
    id: string
    name: string
    email: string
    role: string
    school_id?: string
  }
}

export const useSignup = () => {
  return useMutation<SignupResponse, Error, SignupInput>({
    mutationFn: async (data) => {
      // Omit confirmPassword and agreeTerms when sending to backend API
      const response = await axiosInstance.post<SignupResponse>('/auth/register', {
        email: data.email,
        password: data.password,
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
