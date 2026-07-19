import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { LoginInput } from '../schemas/loginSchema'

interface LoginResponse {
  access_token: string
  user: {
    id: string
    name: string
    email: string
    role: string
    school_id?: string
  }
}

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (data) => {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        email: data.email,
        password: data.password,
      })
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
  })
}
