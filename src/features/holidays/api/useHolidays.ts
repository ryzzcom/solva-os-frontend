import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type {
  HolidayOverviewStatsResponse,
  HolidaysListResponse,
  WeeklyScheduleResponse,
  WeeklyScheduleMap,
} from '../types/holidays.types'
import type { HolidayFormValues } from '../schemas/holidaySchema'

export const useHolidaysStats = () => {
  return useQuery({
    queryKey: ['holidays-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/holidays/stats')
      const payload = response.data?.data || response.data
      return payload as HolidayOverviewStatsResponse
    },
    staleTime: 30 * 1000,
  })
}

export const useHolidaysList = () => {
  return useQuery({
    queryKey: ['holidays-list'],
    queryFn: async () => {
      const response = await axiosInstance.get('/holidays')
      const payload = response.data?.data || response.data
      return payload as HolidaysListResponse
    },
    staleTime: 30 * 1000,
  })
}

export const useWeeklySchedule = () => {
  return useQuery({
    queryKey: ['holidays-weekly-schedule'],
    queryFn: async () => {
      const response = await axiosInstance.get('/holidays/weekly-schedule')
      const payload = response.data?.data || response.data
      return payload as WeeklyScheduleResponse
    },
    staleTime: 30 * 1000,
  })
}

export const useUpdateWeeklySchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (schedule: WeeklyScheduleMap) => {
      const response = await axiosInstance.put('/holidays/weekly-schedule', schedule)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays-weekly-schedule'] })
      queryClient.invalidateQueries({ queryKey: ['holidays-stats'] })
    },
  })
}

export const useCreateHoliday = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: HolidayFormValues) => {
      const response = await axiosInstance.post('/holidays', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays-stats'] })
      queryClient.invalidateQueries({ queryKey: ['holidays-list'] })
    },
  })
}
