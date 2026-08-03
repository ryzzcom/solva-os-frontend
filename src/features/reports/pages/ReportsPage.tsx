import { useState } from 'react'
import { ReportsHeader } from '../components/ReportsHeader'
import { ReportsTabsNav } from '../components/ReportsTabsNav'
import { AttendanceReportFilters } from '../components/AttendanceReportFilters'
import { AttendanceReportKpis } from '../components/AttendanceReportKpis'
import { AttendanceTrendsChart } from '../components/AttendanceTrendsChart'
import { ClassAttendanceSummary } from '../components/ClassAttendanceSummary'
import { StudentAttendanceRosterTable } from '../components/StudentAttendanceRosterTable'
import { useAttendanceKPIs } from '../api/useAttendanceKPIs'
import { useAttendanceTrends } from '../api/useAttendanceTrends'
import { useClassAttendanceSummary } from '../api/useClassAttendanceSummary'
import { useStudentAttendanceRoster } from '../api/useStudentAttendanceRoster'
import type { AttendanceReportQueryParams, RiskStatusBadge } from '../types/reports.types'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'academic' | 'analytics'>('attendance')

  // Filter state
  const [filters, setFilters] = useState<AttendanceReportQueryParams>({})
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | RiskStatusBadge>('ALL')
  const [page, setPage] = useState(1)

  // Consolidated query parameters
  const queryParams: AttendanceReportQueryParams = {
    ...filters,
    search: search.trim() || undefined,
    status_filter: statusFilter !== 'ALL' ? statusFilter : undefined,
    page,
    limit: 10,
  }

  // TanStack Query API calls
  const { data: kpisData, isLoading: isKpisLoading } = useAttendanceKPIs(filters)
  const { data: trendsData, isLoading: isTrendsLoading } = useAttendanceTrends(filters)
  const { data: classSummaryData, isLoading: isClassSummaryLoading } = useClassAttendanceSummary(filters)
  const { data: rosterData, isLoading: isRosterLoading } = useStudentAttendanceRoster(queryParams)

  const handleApplyFilters = (newFilters: AttendanceReportQueryParams) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <ReportsHeader filters={filters} />

      {/* Main 3 Tabs Navigation */}
      <ReportsTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab 1 Content: Student Attendance Reports */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Global Date & Class/Section Filter Toolbar */}
          <AttendanceReportFilters onApplyFilters={handleApplyFilters} />

          {/* 5 KPI Metric Cards */}
          <AttendanceReportKpis kpiData={kpisData} isLoading={isKpisLoading} />

          {/* Grid: Trends Chart & Class Comparison Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceTrendsChart trends={trendsData} isLoading={isTrendsLoading} />
            <ClassAttendanceSummary classesSummary={classSummaryData} isLoading={isClassSummaryLoading} />
          </div>

          {/* Student Roster & At-Risk Tracking Table */}
          <StudentAttendanceRosterTable
            roster={rosterData?.roster || []}
            isLoading={isRosterLoading}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            page={page}
            setPage={setPage}
            pagination={rosterData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }}
          />
        </div>
      )}
    </div>
  )
}
