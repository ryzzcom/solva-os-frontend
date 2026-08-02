import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import { useAuthStore } from '@/store/authStore'
import type { StudentsDirectoryResponse, StudentsQueryParams, StudentItem } from '../types'

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

  const resData = data?.data || data
  const students: StudentItem[] = resData?.students || (Array.isArray(resData) ? resData : [])
  const totalCount: number = resData?.totalCount ?? students.length

  return {
    students,
    totalCount,
    page: params.page || 1,
    limit: params.limit || 10,
  }
}

export const useStudents = (params: StudentsQueryParams) => {
  const schoolId = useAuthStore((state) => state.user?.schoolId)
  return useQuery<StudentsDirectoryResponse, Error>({
    queryKey: ['students', schoolId, params],
    queryFn: () => fetchStudents(params),
    placeholderData: (previousData) => previousData,
  })
}
