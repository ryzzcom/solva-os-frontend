import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface UpdateSectionPayload {
  section_name?: string
  class_teacher_id?: string | null
  max_capacity?: number
  subject_ids?: string[]
  new_subjects?: string[]
}

export const useUpdateSection = (sectionId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateSectionPayload) => {
      if (!sectionId) throw new Error('Section ID is required')
      const response = await axiosInstance.patch(`/sections/${sectionId}`, payload)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes-overview'] })
      queryClient.invalidateQueries({ queryKey: ['classes-overview-full'] })
      queryClient.invalidateQueries({ queryKey: ['section-details', sectionId] })
      queryClient.invalidateQueries({ queryKey: ['class-sections'] })
      queryClient.invalidateQueries({ queryKey: ['class-sections-overview-full'] })
    },
  })
}
