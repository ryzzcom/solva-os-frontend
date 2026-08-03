import { useState } from 'react'
import { ReportsHeader } from '../components/ReportsHeader'
import { ReportsTabsNav } from '../components/ReportsTabsNav'
// Tab 1 Attendance Imports
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

// Tab 2 Academic Imports
import { AcademicReportFilters } from '../components/AcademicReportFilters'
import { AcademicReportKpis } from '../components/AcademicReportKpis'
import { GradeDistributionChart } from '../components/GradeDistributionChart'
import { SubjectPerformanceSummary } from '../components/SubjectPerformanceSummary'
import { StudentAcademicRosterTable } from '../components/StudentAcademicRosterTable'
import { useAcademicKPIs } from '../api/useAcademicKPIs'
import { useGradeDistribution } from '../api/useGradeDistribution'
import { useSubjectSummary } from '../api/useSubjectSummary'
import { useStudentAcademicRoster } from '../api/useStudentAcademicRoster'
import type { AcademicReportQueryParams, AcademicStatusBadge } from '../types/reports.types'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'academic' | 'analytics'>('attendance')

  /* ==========================================================================
     TAB 1: ATTENDANCE STATE & API HOOKS
     ========================================================================== */
  const [attendanceFilters, setAttendanceFilters] = useState<AttendanceReportQueryParams>({})
  const [attendanceSearch, setAttendanceSearch] = useState('')
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState<'ALL' | RiskStatusBadge>('ALL')
  const [attendancePage, setAttendancePage] = useState(1)

  const attendanceQueryParams: AttendanceReportQueryParams = {
    ...attendanceFilters,
    search: attendanceSearch.trim() || undefined,
    status_filter: attendanceStatusFilter !== 'ALL' ? attendanceStatusFilter : undefined,
    page: attendancePage,
    limit: 10,
  }

  const { data: attendanceKpis, isLoading: isAttendanceKpisLoading } = useAttendanceKPIs(attendanceFilters)
  const { data: attendanceTrends, isLoading: isAttendanceTrendsLoading } = useAttendanceTrends(attendanceFilters)
  const { data: classAttendanceSummary, isLoading: isClassAttendanceLoading } = useClassAttendanceSummary(attendanceFilters)
  const { data: attendanceRosterData, isLoading: isAttendanceRosterLoading } = useStudentAttendanceRoster(attendanceQueryParams)

  /* ==========================================================================
     TAB 2: ACADEMIC STATE & API HOOKS
     ========================================================================== */
  const [academicFilters, setAcademicFilters] = useState<AcademicReportQueryParams>({})
  const [academicSearch, setAcademicSearch] = useState('')
  const [academicStatusFilter, setAcademicStatusFilter] = useState<'ALL' | AcademicStatusBadge>('ALL')
  const [academicPage, setAcademicPage] = useState(1)

  const academicQueryParams: AcademicReportQueryParams = {
    ...academicFilters,
    search: academicSearch.trim() || undefined,
    status_filter: academicStatusFilter !== 'ALL' ? academicStatusFilter : undefined,
    page: academicPage,
    limit: 10,
  }

  const { data: academicKpis, isLoading: isAcademicKpisLoading } = useAcademicKPIs(academicFilters)
  const { data: gradeDistribution, isLoading: isGradeDistributionLoading } = useGradeDistribution(academicFilters)
  const { data: subjectSummary, isLoading: isSubjectSummaryLoading } = useSubjectSummary(academicFilters)
  const { data: academicRosterData, isLoading: isAcademicRosterLoading } = useStudentAcademicRoster(academicQueryParams)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <ReportsHeader
        activeTab={activeTab}
        attendanceFilters={attendanceFilters}
        academicFilters={academicFilters}
      />

      {/* Main 3 Tabs Navigation */}
      <ReportsTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* TAB 1: Student Attendance Reports */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <AttendanceReportFilters
            onApplyFilters={(f) => {
              setAttendanceFilters(f)
              setAttendancePage(1)
            }}
          />

          <AttendanceReportKpis kpiData={attendanceKpis} isLoading={isAttendanceKpisLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceTrendsChart trends={attendanceTrends} isLoading={isAttendanceTrendsLoading} />
            <ClassAttendanceSummary classesSummary={classAttendanceSummary} isLoading={isClassAttendanceLoading} />
          </div>

          <StudentAttendanceRosterTable
            roster={attendanceRosterData?.roster || []}
            isLoading={isAttendanceRosterLoading}
            search={attendanceSearch}
            setSearch={setAttendanceSearch}
            statusFilter={attendanceStatusFilter}
            setStatusFilter={setAttendanceStatusFilter}
            page={attendancePage}
            setPage={setAttendancePage}
            pagination={attendanceRosterData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }}
          />
        </div>
      )}

      {/* TAB 2: Academic Performance Reports */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          <AcademicReportFilters
            onApplyFilters={(f) => {
              setAcademicFilters(f)
              setAcademicPage(1)
            }}
          />

          <AcademicReportKpis kpiData={academicKpis} isLoading={isAcademicKpisLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GradeDistributionChart distribution={gradeDistribution} isLoading={isGradeDistributionLoading} />
            <SubjectPerformanceSummary subjectSummary={subjectSummary} isLoading={isSubjectSummaryLoading} />
          </div>

          <StudentAcademicRosterTable
            roster={academicRosterData?.roster || []}
            isLoading={isAcademicRosterLoading}
            search={academicSearch}
            setSearch={setAcademicSearch}
            statusFilter={academicStatusFilter}
            setStatusFilter={setAcademicStatusFilter}
            page={academicPage}
            setPage={setAcademicPage}
            pagination={academicRosterData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }}
          />
        </div>
      )}
    </div>
  )
}
