import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { SectionStudentsAttendanceResponse } from '../types/attendance.types'

export const useSectionStudentsAttendance = (sectionId?: string, date?: string) => {
  return useQuery({
    queryKey: ['section-students-attendance', sectionId, date],
    queryFn: async () => {
      if (!sectionId) throw new Error('Section ID is required')
      const response = await axiosInstance.get(`/attendance/sections/${sectionId}/students`, {
        params: {
          ...(date ? { date } : {}),
        },
      })

      const payload = response.data?.data || response.data
      return payload as SectionStudentsAttendanceResponse
    },
    enabled: Boolean(sectionId),
    staleTime: 30 * 1000, // 30 seconds
  })
}
