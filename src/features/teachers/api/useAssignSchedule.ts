import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

export interface ScheduleItemInput {
  day: string
  start_time: string
  end_time: string
}

export interface AssignSchedulePayload {
  class_id: string
  section_id: string
  subject_id: string
  schedule_items: ScheduleItemInput[]
}

export const useAssignSchedule = (teacherId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AssignSchedulePayload) => {
      const response = await axiosInstance.post(`/teachers/${teacherId}/assign-schedule`, payload)
      return response.data
    },
    onSuccess: () => {
      // Invalidate profile queries so newly assigned classes show up instantly in profile & schedule tabs
      queryClient.invalidateQueries({ queryKey: ['teacher-profile-header', teacherId] })
      queryClient.invalidateQueries({ queryKey: ['teacher-profile-tab', teacherId] })
      queryClient.invalidateQueries({ queryKey: ['teacher-schedule-tab', teacherId] })
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
