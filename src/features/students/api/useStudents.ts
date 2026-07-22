import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import type { StudentsDirectoryResponse, StudentsQueryParams } from '../types'

export const fetchStudents = async (
  params: StudentsQueryParams
): Promise<StudentsDirectoryResponse> => {
  const { data } = await axiosInstance.get('/students', {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || undefined,
      class_id: params.class_id || undefined,
      section_id: params.section_id || undefined,
      status: params.status || undefined,
    },
  })
  // Handle backend wrapper { status: 'success', data: { students, totalCount, page, limit } }
  return data?.data || data
}

export const useStudents = (params: StudentsQueryParams) => {
  return useQuery<StudentsDirectoryResponse, Error>({
    queryKey: ['students', params],
    queryFn: () => fetchStudents(params),
    placeholderData: (previousData) => previousData,
  })
}
