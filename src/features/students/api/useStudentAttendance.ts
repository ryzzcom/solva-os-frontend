import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { StudentAttendanceProfileResponse } from '../types/attendance'

export const fetchStudentAttendanceProfile = async (
  studentId: string,
  year: number,
  month: number
): Promise<StudentAttendanceProfileResponse> => {
  const { data } = await axiosInstance.get(
    `/students/profile/${studentId}/attendance`,
    {
      params: { year, month },
    }
  )
  return data?.data || data
}

export const useStudentAttendance = (
  studentId: string,
  year: number,
  month: number
) => {
  return useQuery<StudentAttendanceProfileResponse, Error>({
    queryKey: ['studentAttendance', studentId, year, month],
    queryFn: () => fetchStudentAttendanceProfile(studentId, year, month),
    enabled: !!studentId,
    placeholderData: keepPreviousData, // Keeps previous calendar data rendered seamlessly during month switching
  })
}
