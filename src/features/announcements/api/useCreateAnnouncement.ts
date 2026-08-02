import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { CreateAnnouncementInput } from '../schemas/announcementSchema'

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAnnouncementInput) => {
      const payload = {
        title: data.title,
        description: data.description,
        audience: data.audience,
        date: data.date,
        target_class_id: data.target_class_id && data.target_class_id !== 'ALL' ? data.target_class_id : null,
        target_section_id: data.target_section_id && data.target_section_id !== 'ALL' ? data.target_section_id : null,
      }

      const response = await axiosInstance.post('/announcements/create-notice', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
    },
  })
}
