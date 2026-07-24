import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type {
  StudentProfileSummaryResponse,
  StudentPersonalProfileResponse,
} from '../types/profile'

export const fetchStudentSummary = async (
  studentId: string
): Promise<StudentProfileSummaryResponse> => {
  const { data } = await axiosInstance.get(`/students/profile/${studentId}/summary`)
  return data?.data || data
}

export const fetchStudentPersonalProfile = async (
  studentId: string
): Promise<StudentPersonalProfileResponse> => {
  const { data } = await axiosInstance.get(`/students/profile/${studentId}/personal`)
  return data?.data || data
}

export const useStudentSummary = (studentId: string) => {
  return useQuery<StudentProfileSummaryResponse, Error>({
    queryKey: ['studentSummary', studentId],
    queryFn: () => fetchStudentSummary(studentId),
    enabled: !!studentId,
  })
}

export const useStudentPersonalProfile = (studentId: string) => {
  return useQuery<StudentPersonalProfileResponse, Error>({
    queryKey: ['studentPersonal', studentId],
    queryFn: () => fetchStudentPersonalProfile(studentId),
    enabled: !!studentId,
  })
}
