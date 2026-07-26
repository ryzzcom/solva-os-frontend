import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { TeachersDirectoryResponse, TeachersQueryParams } from '../types'

export const fetchTeachers = async (
  params: TeachersQueryParams
): Promise<TeachersDirectoryResponse> => {
  const { data } = await axiosInstance.get('/teachers', { params })
  const result = data?.data || data

  return {
    teachers: result?.teachers || [],
    pagination: {
      total: result?.pagination?.total ?? result?.totalCount ?? 0,
      page: result?.pagination?.page ?? params.page ?? 1,
      limit: result?.pagination?.limit ?? params.limit ?? 10,
      totalPages: result?.pagination?.totalPages ?? 1,
    },
    totalCount: result?.pagination?.total ?? result?.totalCount ?? 0,
  }
}

export const useTeachers = (params: TeachersQueryParams) => {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => fetchTeachers(params),
  })
}
