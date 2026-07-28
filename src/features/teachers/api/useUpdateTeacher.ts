import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface UpdateTeacherPayload {
  full_name?: string
  email?: string
  cnic_number?: string
  phone_number?: string
  dob?: string
  gender?: 'Male' | 'Female' | 'Other' | ''
  department_name?: string
  designation?: string
  joining_date?: string
  monthly_salary?: number
  class_id?: string
  section_id?: string
}

export const useUpdateTeacher = (teacherId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateTeacherPayload) => {
      const { data } = await axiosInstance.patch(`/teachers/${teacherId}`, payload)
      return data?.data || data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-profile-header', teacherId] })
      queryClient.invalidateQueries({ queryKey: ['teacher-profile-tab', teacherId] })
      queryClient.invalidateQueries({ queryKey: ['teacher-schedule-tab', teacherId] })
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
