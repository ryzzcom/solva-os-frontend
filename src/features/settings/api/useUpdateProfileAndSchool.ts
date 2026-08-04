import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { UpdateSettingsFormData } from '../types/settings.types'

export const useUpdateProfileAndSchool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: UpdateSettingsFormData) => {
      const data = new FormData()

      if (formData.full_name !== undefined) data.append('full_name', formData.full_name)
      if (formData.phone_number !== undefined) data.append('phone_number', formData.phone_number)
      if (formData.school_name !== undefined) data.append('school_name', formData.school_name)
      if (formData.campus_name !== undefined) data.append('campus_name', formData.campus_name)
      if (formData.website_url !== undefined) data.append('website_url', formData.website_url)
      if (formData.school_phone !== undefined) data.append('school_phone', formData.school_phone)
      if (formData.address !== undefined) data.append('address', formData.address)

      if (formData.profile_picture) {
        data.append('profile_picture', formData.profile_picture)
      }
      if (formData.school_logo) {
        data.append('school_logo', formData.school_logo)
      }

      const response = await axiosInstance.patch('/settings/profile-and-school', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-profile-and-school'] })
    },
  })
}
