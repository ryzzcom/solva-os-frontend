import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { UpdateStudentPayload } from '../types/profile'

export const updateStudentApi = async (
  studentId: string,
  payload: UpdateStudentPayload
) => {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'profile_picture' && value instanceof File) {
        formData.append('profile_picture', value)
      } else if (key !== 'profile_picture') {
        formData.append(key, String(value))
      }
    }
  })

  const { data } = await axiosInstance.patch(`/students/${studentId}`, formData)
  return data
}

export const useUpdateStudent = (studentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateStudentPayload) =>
      updateStudentApi(studentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentSummary', studentId] })
      queryClient.invalidateQueries({ queryKey: ['studentPersonal', studentId] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}
