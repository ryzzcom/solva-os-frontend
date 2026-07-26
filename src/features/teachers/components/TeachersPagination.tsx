import React from 'react'
import { DataTablePagination } from '@/components/ui/pagination'

interface TeachersPaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  currentCount: number
  onPageChange: (page: number) => void
}

export const TeachersPagination: React.FC<TeachersPaginationProps> = (props) => {
  return <DataTablePagination {...props} entityName="faculty members" />
}

