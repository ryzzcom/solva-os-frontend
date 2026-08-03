import React, { useState } from 'react'
import { ChevronRight, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { axiosInstance } from '@/lib/axios'
import type { AttendanceReportQueryParams } from '../types/reports.types'

interface ReportsHeaderProps {
  filters: AttendanceReportQueryParams
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({ filters }) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = async () => {
    try {
      setIsExporting(true)
      const response = await axiosInstance.get('/reports/attendance/export-csv', {
        params: filters,
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'student_attendance_report.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Failed to download CSV report:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <span>Principal Dashboard.</span>
        <ChevronRight className="size-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">Reports & Analytics</span>
      </div>

      {/* Main Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-urbanist">
            Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl font-sans">
            Gain actionable insights into student attendance, academic trends, class metrics, and risk monitoring.
          </p>
        </div>

        {/* Export CSV Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="h-11 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="size-4 text-brand-primary animate-spin" />
            ) : (
              <Download className="size-4 text-brand-primary" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export CSV Report'}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
