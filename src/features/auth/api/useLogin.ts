import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { LoginInput } from '../schemas/loginSchema'
import { useAuthStore } from '@/store/authStore'

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await axiosInstance.post('/auth/login', {
        email: data.email,
        password: data.password,
      })
      return response.data
    },
    onSuccess: (res: any) => {
      const payload = res?.data || res
      const token = payload?.access_token || payload?.accessToken
      const user = payload?.user

      if (token) {
        localStorage.setItem('access_token', token)
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }

      if (token && user) {
        useAuthStore.getState().setAuth(user, token)
      }
    },
  })
}
