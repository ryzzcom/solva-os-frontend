import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface MoveStudentsPayload {
  student_ids: string[]
  target_class_id: string
  target_section_id: string
}

export const useMoveStudents = (currentSectionId?: string, currentClassId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: MoveStudentsPayload) => {
      const response = await axiosInstance.post('/students/move', payload)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes-overview'] })
      queryClient.invalidateQueries({ queryKey: ['classes-overview-full'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['student-profile'] })
      queryClient.invalidateQueries({ queryKey: ['class-sections'] })
      if (currentSectionId) {
        queryClient.invalidateQueries({ queryKey: ['section-details', currentSectionId] })
        queryClient.invalidateQueries({ queryKey: ['section-details-full', currentSectionId] })
      }
      if (currentClassId) {
        queryClient.invalidateQueries({ queryKey: ['class-sections', currentClassId] })
      }
      queryClient.invalidateQueries({ queryKey: ['class-sections-overview-full'] })
    },
  })
}
