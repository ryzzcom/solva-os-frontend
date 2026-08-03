import React from 'react'
import { TrendingUp, CheckCircle2, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import type { AttendanceKPIsData } from '../types/reports.types'

interface AttendanceReportKpisProps {
  kpiData?: AttendanceKPIsData
  isLoading?: boolean
}

export const AttendanceReportKpis: React.FC<AttendanceReportKpisProps> = ({
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

  const rate = kpiData?.average_attendance_rate ?? 0
  const totalPresent = kpiData?.total_present ?? 0
  const totalAbsent = kpiData?.total_absent ?? 0
  const totalLate = kpiData?.total_late ?? 0
  const atRiskCount = kpiData?.at_risk_students_count ?? 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* 1. Average Attendance Rate */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 font-urbanist uppercase tracking-wider">
            Avg Attendance Rate
          </span>
          <div className="size-8 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
            <TrendingUp className="size-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-urbanist text-slate-900">{rate}%</span>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Target 95%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
          <div
            className="bg-brand-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
          />
        </div>
      </div>

      {/* 2. Total Present Markings */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 font-urbanist uppercase tracking-wider">
            Total Present
          </span>
          <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold font-urbanist text-slate-900">
            {totalPresent.toLocaleString()}
          </span>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Markings recorded</p>
        </div>
      </div>

      {/* 3. Total Absent Markings */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 font-urbanist uppercase tracking-wider">
            Total Absences
          </span>
          <div className="size-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="size-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold font-urbanist text-slate-900">
            {totalAbsent.toLocaleString()}
          </span>
          <p className="text-xs text-slate-400 font-sans mt-0.5 font-medium">Unexcused & Excused</p>
        </div>
      </div>

      {/* 4. Total Late Markings */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 font-urbanist uppercase tracking-wider">
            Total Late Arrival
          </span>
          <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="size-4" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-bold font-urbanist text-slate-900">
            {totalLate.toLocaleString()}
          </span>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Tardy records</p>
        </div>
      </div>

      {/* 5. Students At Risk (<75%) */}
      <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-800 font-urbanist uppercase tracking-wider">
            Students At Risk
          </span>
          <div className="size-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="size-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-urbanist text-rose-900">{atRiskCount}</span>
            <span className="text-xs font-semibold text-rose-700 font-sans">&lt; 75% rate</span>
          </div>
          <p className="text-xs text-rose-600/80 font-sans mt-0.5">Needs intervention</p>
        </div>
      </div>
    </div>
  )
}
