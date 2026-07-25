import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '@/lib/axios'

export const deleteStudentApi = async (studentId: string) => {
  const { data } = await axiosInstance.delete(`/students/${studentId}`)
  return data
}

export const useDeleteStudent = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (studentId: string) => deleteStudentApi(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      navigate('/students')
    },
  })
}
