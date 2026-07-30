import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export const useDeleteSection = (classId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (sectionId: string) => {
      const response = await axiosInstance.delete(`/sections/${sectionId}`)
      return response.data?.data || response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes-overview'] })
      queryClient.invalidateQueries({ queryKey: ['classes-overview-full'] })
      queryClient.invalidateQueries({ queryKey: ['class-sections'] })
      if (classId) {
        queryClient.invalidateQueries({ queryKey: ['class-sections', classId] })
      }
      queryClient.invalidateQueries({ queryKey: ['class-sections-overview-full'] })
    },
  })
}
