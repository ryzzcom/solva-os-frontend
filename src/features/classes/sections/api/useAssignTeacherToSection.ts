import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface AssignTeacherPayload {
  teacher_id: string
}

export const useAssignTeacherToSection = (sectionId?: string, classId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AssignTeacherPayload) => {
      if (!sectionId) throw new Error('Section ID is required')
      const response = await axiosInstance.patch(`/sections/${sectionId}/assign-teacher`, payload)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes-overview'] })
      queryClient.invalidateQueries({ queryKey: ['classes-overview-full'] })
      queryClient.invalidateQueries({ queryKey: ['section-details', sectionId] })
      queryClient.invalidateQueries({ queryKey: ['section-details-full', sectionId] })
      queryClient.invalidateQueries({ queryKey: ['class-sections'] })
      if (classId) {
        queryClient.invalidateQueries({ queryKey: ['class-sections', classId] })
      }
      queryClient.invalidateQueries({ queryKey: ['class-sections-overview-full'] })
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
