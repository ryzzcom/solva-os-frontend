import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type {
  StudentProfileSummaryResponse,
  StudentPersonalProfileResponse,
  StudentExamResultsResponse,
  StudentHomeworkResponse,
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

export const fetchStudentResults = async (
  studentId: string
): Promise<StudentExamResultsResponse> => {
  const { data } = await axiosInstance.get(`/students/profile/${studentId}/result`)
  return data?.data || data
}

export const fetchStudentHomework = async (
  studentId: string
): Promise<StudentHomeworkResponse> => {
  const { data } = await axiosInstance.get(`/students/profile/${studentId}/homework`)
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

export const useStudentResults = (studentId: string) => {
  return useQuery<StudentExamResultsResponse, Error>({
    queryKey: ['studentResults', studentId],
    queryFn: () => fetchStudentResults(studentId),
    enabled: !!studentId,
  })
}

export const useStudentHomework = (studentId: string) => {
  return useQuery<StudentHomeworkResponse, Error>({
    queryKey: ['studentHomework', studentId],
    queryFn: () => fetchStudentHomework(studentId),
    enabled: !!studentId,
  })
}


