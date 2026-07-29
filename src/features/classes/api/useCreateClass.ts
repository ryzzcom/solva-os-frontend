import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface CreateClassSectionInput {
  section_name: string
  class_teacher_id?: string | null
  max_capacity?: number
}

export interface CreateClassPayload {
  class_name: string
  sections: CreateClassSectionInput[]
  subject_ids?: string[]
  new_subjects?: string[]
}

export const useCreateClass = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateClassPayload) => {
      const response = await axiosInstance.post('/classes/create', payload)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes-overview'] })
      queryClient.invalidateQueries({ queryKey: ['classes-overview-full'] })
    },
  })
}
