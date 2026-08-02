import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/announcements/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}
