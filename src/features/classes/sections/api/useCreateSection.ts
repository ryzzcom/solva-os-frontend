import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface CreateSectionPayload {
  section_name: string
  class_teacher_id?: string | null
  max_capacity?: number
  subject_ids?: string[]
  new_subjects?: string[]
}

export const useCreateSection = (classId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateSectionPayload) => {
      if (!classId) throw new Error('Class ID is required')
      const response = await axiosInstance.post(`/classes/${classId}/sections/create`, payload)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes-overview'] })
      queryClient.invalidateQueries({ queryKey: ['classes-overview-full'] })
      queryClient.invalidateQueries({ queryKey: ['class-sections', classId] })
      queryClient.invalidateQueries({ queryKey: ['class-sections-overview-full', classId] })
    },
  })
}
