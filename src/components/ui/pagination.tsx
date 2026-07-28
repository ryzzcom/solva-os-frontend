import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  totalCount?: number
  currentCount?: number
  onPageChange: (page: number) => void
}

export const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between text-[#334155] text-[16px] font-sans font-normal pt-4 border-t border-slate-200">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
