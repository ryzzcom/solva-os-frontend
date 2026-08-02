import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'

export const useLogout = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/auth/logout')
      return response.data
    },
    onSettled: () => {
      useAuthStore.getState().logout()
      navigate('/login', { replace: true })
    },
  })
}
