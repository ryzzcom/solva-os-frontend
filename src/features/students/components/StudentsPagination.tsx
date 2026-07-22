import React from 'react'

interface StudentsPaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  currentCount: number
  onPageChange: (page: number) => void
}

export const StudentsPagination: React.FC<StudentsPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  currentCount,
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
      <p className="text-[#334155] text-base font-normal font-sans">
        Showing <span className="font-semibold">{currentCount}</span> of{' '}
        <span className="font-semibold">{totalCount}</span> students
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-[#f3f4f6] disabled:opacity-50 text-[#1e293b] font-medium font-urbanist rounded-[8px] px-4 py-2 text-base hover:bg-slate-200 transition-colors disabled:cursor-not-allowed"
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
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`rounded-[8px] px-4 py-2 text-base font-medium font-urbanist transition-colors ${
                isActive
                  ? 'bg-[#1f3a8a] text-white shadow-xs'
                  : 'bg-white border border-[#e2e8f0] text-[#1e293b] hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="bg-[#f3f4f6] disabled:opacity-50 text-[#0f172a] font-medium font-urbanist rounded-[8px] px-4 py-2 text-base hover:bg-slate-200 transition-colors disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
