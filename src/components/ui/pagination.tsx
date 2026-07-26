import React from 'react'

export interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  currentCount: number
  entityName?: string
  onPageChange: (page: number) => void
}

export const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  currentCount,
  entityName = 'items',
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('-')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }

      if (currentPage < totalPages - 2) pages.push('-')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      {/* Items count summary */}
      <p className="text-slate-body text-base font-normal font-sans">
        Showing <span className="font-semibold">{currentCount}</span> of{' '}
        <span className="font-semibold">{totalCount}</span> {entityName}
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="bg-bg-neutral disabled:opacity-50 text-slate-800 font-medium font-urbanist rounded-[8px] px-4 py-2 text-base hover:bg-slate-200 transition-colors disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>

        {getPageNumbers().map((num, idx) => {
          if (num === '-') {
            return (
              <span key={`dash-${idx}`} className="px-2 text-slate-400 font-urbanist">
                -
              </span>
            )
          }

          const pageNum = num as number
          const isActive = pageNum === currentPage

          return (
            <button
              type="button"
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`rounded-[8px] px-4 py-2 text-base font-medium font-urbanist transition-colors cursor-pointer ${
                isActive
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-white border border-divider text-slate-800 hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="bg-bg-neutral disabled:opacity-50 text-navy-main font-medium font-urbanist rounded-[8px] px-4 py-2 text-base hover:bg-slate-200 transition-colors disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  )
}
