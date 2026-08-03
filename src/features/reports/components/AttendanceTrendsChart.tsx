import React from 'react'
import { Calendar, Loader2 } from 'lucide-react'
import type { AttendanceTrendItem } from '../types/reports.types'

interface AttendanceTrendsChartProps {
  trends?: AttendanceTrendItem[]
  isLoading?: boolean
}

export const AttendanceTrendsChart: React.FC<AttendanceTrendsChartProps> = ({
  trends = [],
  isLoading = false,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-urbanist text-slate-900">
            Attendance Time-Series Trend
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Daily student presence rates across selected date range.
          </p>
        </div>
        <div className="size-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
          <Calendar className="size-4" />
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-2">
          <Loader2 className="size-6 text-brand-primary animate-spin" />
          <span className="text-xs font-medium">Loading trends...</span>
        </div>
      ) : trends.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
          No attendance markings recorded for selected range.
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {trends.slice(0, 7).map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span className="font-sans font-semibold text-slate-800">{item.date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    <strong className="text-slate-900">{item.present}</strong> Present /{' '}
                    <strong className="text-slate-900">{item.absent}</strong> Absent
                  </span>
                  <span className="font-bold text-brand-primary bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-brand-primary h-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
                <div
                  className="bg-rose-500 h-full transition-all"
                  style={{
                    width: `${item.total > 0 ? ((item.absent / item.total) * 100).toFixed(1) : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
