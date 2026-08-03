import React from 'react'
import { Award, Loader2 } from 'lucide-react'
import type { GradeDistributionItem } from '../types/reports.types'

interface GradeDistributionChartProps {
  distribution?: GradeDistributionItem[]
  isLoading?: boolean
}

export const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({
  distribution = [],
  isLoading = false,
}) => {
  const getGradeBarColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-emerald-600'
      case 'A':
        return 'bg-emerald-500'
      case 'B':
        return 'bg-brand-primary'
      case 'C':
        return 'bg-amber-500'
      case 'D':
        return 'bg-orange-500'
      case 'F':
        return 'bg-rose-500'
      default:
        return 'bg-slate-400'
    }
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-urbanist text-slate-900">
            Grade Distribution Breakdown
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Student performance across standard academic grade brackets.
          </p>
        </div>
        <div className="size-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
          <Award className="size-4" />
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-2">
          <Loader2 className="size-6 text-brand-primary animate-spin" />
          <span className="text-xs font-medium">Loading grade distribution...</span>
        </div>
      ) : distribution.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
          No grade distribution data recorded.
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {distribution.map((item) => (
            <div key={item.grade} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="font-urbanist text-slate-900 font-bold">
                  Grade {item.grade}
                </span>
                <div className="flex items-center gap-2 text-slate-500">
                  <span>{item.count} Students</span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getGradeBarColor(
                    item.grade
                  )}`}
                  style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
