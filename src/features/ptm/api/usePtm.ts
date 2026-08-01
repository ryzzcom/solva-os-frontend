import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'
import type { PtmListResponse, PtmQueryParams } from '../types/ptm.types'
import type { PtmFormValues } from '../schemas/ptmSchema'

export const usePtmList = (params?: PtmQueryParams) => {
  return useQuery({
    queryKey: ['ptm-list', params?.search, params?.classId, params?.sectionId, params?.status],
    queryFn: async () => {
      const response = await axiosInstance.get('/ptm', {
        params: {
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.classId ? { classId: params.classId } : {}),
          ...(params?.sectionId ? { sectionId: params.sectionId } : {}),
          ...(params?.status && params.status !== 'ALL' ? { status: params.status } : {}),
        },
      })

      const payload = response.data?.data || response.data
      return payload as PtmListResponse
    },
    staleTime: 30 * 1000,
  })
}

export const useCreatePtm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PtmFormValues) => {
      const response = await axiosInstance.post('/ptm', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ptm-list'] })
    },
  })
}
