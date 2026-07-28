import React from 'react'
import { DataTablePagination } from '@/components/ui/pagination'
import type { DataTablePaginationProps } from '@/components/ui/pagination'

export type TeachersPaginationProps = DataTablePaginationProps

export const TeachersPagination: React.FC<TeachersPaginationProps> = (props) => {
  return <DataTablePagination {...props} />
}
