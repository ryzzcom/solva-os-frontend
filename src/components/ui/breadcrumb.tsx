import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[]
}

export const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ items }) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2 text-base flex-wrap font-sans">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="size-4 text-slate-sub shrink-0" />}
            {isLast || !item.href ? (
              <span className="text-navy-main font-medium font-urbanist capitalize">
                {item.label}
              </span>
            ) : (
              <span
                onClick={() => navigate(item.href!)}
                className="text-slate-sub hover:underline cursor-pointer transition-colors"
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
