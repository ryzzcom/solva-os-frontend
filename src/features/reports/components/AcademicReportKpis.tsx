import React from 'react'
import { Award, CheckCircle2, Trophy, FileSpreadsheet, AlertTriangle, Loader2 } from 'lucide-react'
import type { AcademicKPIsData } from '../types/reports.types'

interface AcademicReportKpisProps {
  kpiData?: AcademicKPIsData
  isLoading?: boolean
}

export const AcademicReportKpis: React.FC<AcademicReportKpisProps> = ({
  kpiData,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-center h-28"
          >
            <Loader2 className="size-6 text-brand-primary animate-spin" />
          </div>
        ))}
      </div>
    )
  }

  const avgPercentage = kpiData?.average_percentage ?? 0
  const passRate = kpiData?.pass_rate ?? 0
  const highestMarks = kpiData?.highest_marks ?? 0
  const totalRecords = kpiData?.total_records ?? 0
  const needsSupportCount = kpiData?.needs_support_count ?? 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* 1. School Average Percentage */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 font-urbanist uppercase tracking-wider">
            Overall Average %
          </span>
          <div className="size-8 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
            <Award className="size-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-urbanist text-slate-900">{avgPercentage}%</span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Target 80%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
          <div
            className="bg-brand-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, avgPercentage))}%` }}
          />
        </div>
      </div>

      {/* 2. Pass Rate % */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 font-urbanist uppercase tracking-wider">
            Overall Pass Rate
          </span>
          <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold font-urbanist text-slate-900">{passRate}%</span>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Passed exam benchmarks</p>
        </div>
      </div>

      {/* 3. Highest Score */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 font-urbanist uppercase tracking-wider">
            Highest Score Achieved
          </span>
          <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="size-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold font-urbanist text-slate-900">
            {highestMarks.toLocaleString()}
          </span>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Top score in selection</p>
        </div>
      </div>

      {/* 4. Total Exam Records */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 font-urbanist uppercase tracking-wider">
            Total Results Evaluated
          </span>
          <div className="size-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileSpreadsheet className="size-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold font-urbanist text-slate-900">
            {totalRecords.toLocaleString()}
          </span>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Submitted marks</p>
        </div>
      </div>

      {/* 5. Needs Academic Support (<50%) */}
      <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-800 font-urbanist uppercase tracking-wider">
            Needs Support
          </span>
          <div className="size-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="size-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-urbanist text-rose-900">{needsSupportCount}</span>
            <span className="text-xs font-semibold text-rose-700 font-sans">&lt; 50% avg</span>
          </div>
          <p className="text-xs text-rose-600/80 font-sans mt-0.5">Academic intervention</p>
        </div>
      </div>
    </div>
  )
}
