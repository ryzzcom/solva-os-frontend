import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '@/lib/axios'

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (teacherId: string) => {
      const response = await axiosInstance.delete(`/teachers/${teacherId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      navigate('/teachers')
    },
  })
}
