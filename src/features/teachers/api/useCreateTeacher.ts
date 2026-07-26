import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { CreateTeacherPayload } from '../types'

export const createTeacherApi = async (payload: CreateTeacherPayload) => {
  const { data } = await axiosInstance.post('/teachers/add', payload)
  return data
}

export const useCreateTeacher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTeacherPayload) => createTeacherApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
