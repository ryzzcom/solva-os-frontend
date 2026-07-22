export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message?: string
  data: T
}

export interface PaginatedData<T> {
  items: T[]
  totalCount: number
  page: number
  limit: number
  totalPages?: number
}

export interface ApiErrorResponse {
  status: 'error'
  message: string
  errors?: Record<string, string[]> | string[]
}
