import React from 'react'
import { BookOpen, Loader2 } from 'lucide-react'
import type { ClassAttendanceSummaryItem } from '../types/reports.types'

interface ClassAttendanceSummaryProps {
  classesSummary?: ClassAttendanceSummaryItem[]
  isLoading?: boolean
}

export const ClassAttendanceSummary: React.FC<ClassAttendanceSummaryProps> = ({
  classesSummary = [],
  isLoading = false,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-urbanist text-slate-900">
            Class-by-Class Attendance Comparison
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Comparative attendance performance per grade.
          </p>
        </div>
        <div className="size-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
          <BookOpen className="size-4" />
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-2">
          <Loader2 className="size-6 text-brand-primary animate-spin" />
          <span className="text-xs font-medium">Loading class summary...</span>
        </div>
      ) : classesSummary.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
          No class summary metrics found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {classesSummary.map((c) => (
            <div
              key={c.class_id}
              className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3.5 space-y-2 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-urbanist text-slate-900">{c.class_name}</span>
                <span className="text-xs font-bold text-brand-primary bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {c.average_attendance_rate}% Rate
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
                <span>{c.total_students} Students</span>
                <span className="text-emerald-700 font-semibold">{c.present_count} Present</span>
                <span className="text-rose-700 font-semibold">{c.absent_count} Absences</span>
              </div>

              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-primary h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, c.average_attendance_rate))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
