import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface UpdateClassSectionInput {
  id?: string
  section_name: string
  class_teacher_id?: string | null
  max_capacity?: number
}

export interface UpdateClassPayload {
  class_name?: string
  sections?: UpdateClassSectionInput[]
  new_subjects?: string[]
}

export const useUpdateClass = (classId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateClassPayload) => {
      if (!classId) throw new Error('Class ID is required')
      const response = await axiosInstance.put(`/classes/${classId}`, payload)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes-overview'] })
      queryClient.invalidateQueries({ queryKey: ['classes-overview-full'] })
      queryClient.invalidateQueries({ queryKey: ['class-sections', classId] })
      queryClient.invalidateQueries({ queryKey: ['class-details-full', classId] })
    },
  })
}
