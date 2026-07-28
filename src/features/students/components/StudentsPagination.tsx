import React from 'react'
import { DataTablePagination } from '@/components/ui/pagination'
import type { DataTablePaginationProps } from '@/components/ui/pagination'

export type StudentsPaginationProps = DataTablePaginationProps

export const StudentsPagination: React.FC<StudentsPaginationProps> = (props) => {
  return <DataTablePagination {...props} />
}
