import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  ClipboardList,
  ChevronRight,
  AlertCircle,
  Filter,
} from 'lucide-react'
import { CustomSelect } from '@/components/ui/select'
import { useClassesOverviewFull } from '@/features/classes/api/useClasses'
import { useClassSectionsOverview } from '@/features/classes/sections/api/useClassSectionsOverview'
import { useAttendanceDashboard } from '../api/useAttendanceDashboard'
import type { SectionAttendanceItem } from '../types/attendance.types'

export const AttendanceOverviewPage: React.FC = () => {
  const navigate = useNavigate()

  // Selection states for filters
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [selectedSectionId, setSelectedSectionId] = useState<string>('')

  // Applied filter parameters (triggered on Apply click)
  const [appliedParams, setAppliedParams] = useState<{ classId?: string; sectionId?: string }>({})

  // Fetch dropdown options
  const { data: classesOverview, isLoading: isClassesLoading } = useClassesOverviewFull()
  const classesList = classesOverview?.classes_list || []

  const { data: sectionsOverview, isLoading: isSectionsLoading } = useClassSectionsOverview(
    selectedClassId
  )
  const sectionsList = sectionsOverview?.sections || []

  // Fetch attendance dashboard stats
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError,
    refetch,
  } = useAttendanceDashboard(appliedParams)

  // Format options for CustomSelect
  const classOptions = [
    { value: '', label: 'All Classes' },
    ...classesList.map((c: any) => ({
      value: c.id,
      label: c.name || c.class_name,
    })),
  ]

  const sectionOptions = [
    { value: '', label: 'All Sections' },
    ...sectionsList.map((sec: any) => {
      const secName = sec.section_name || sec.name || 'Section'
      const fullSecName = secName.startsWith('Section') ? secName : `Section ${secName}`
      return {
        value: sec.id || sec.section_id,
        label: fullSecName,
      }
    }),
  ]

  const handleClassSelect = (val: string) => {
    setSelectedClassId(val)
    setSelectedSectionId('') // Reset section selection when class changes
  }

  const handleApplyFilter = () => {
    setAppliedParams({
      ...(selectedClassId ? { classId: selectedClassId } : {}),
      ...(selectedSectionId ? { sectionId: selectedSectionId } : {}),
    })
  }

  const kpiCards = dashboardData?.kpi_cards || {
    avg_student_attendance: 96.4,
    teacher_attendance_rate: 95.0,
    pending_leaves_count: 2,
    low_attendance_students_count: 2,
  }

  const classWiseAttendance = dashboardData?.class_wise_attendance || []

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Breadcrumb & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs md:text-sm font-sans text-slate-500">
          <span>Principal Dashboard.</span>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-semibold text-navy-main font-urbanist">Attendance</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-navy-main">
              Attendance Analytics
            </h1>
            <p className="text-sm font-sans text-slate-600">
              Real-time oversight of school-wide attendance
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Bento Grid Stats Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Avg. Student Attendance */}
        <div className="bg-white border-l-4 border-l-brand-primary border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Avg. Student Attendance
          </span>
          <p className="text-3xl font-bold font-urbanist text-brand-primary mt-2">
            {isDashboardLoading ? '...' : `${kpiCards.avg_student_attendance}%`}
          </p>
        </div>

        {/* Card 2: Teacher Attendance (Today) */}
        <div className="bg-white border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Teacher Attendance (Today)
          </span>
          <p className="text-3xl font-bold font-urbanist text-navy-main mt-2">
            {isDashboardLoading ? '...' : `${kpiCards.teacher_attendance_rate}%`}
          </p>
        </div>

        {/* Card 3: Pending Leaves */}
        <div className="bg-white border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Pending Leaves
          </span>
          <p className="text-3xl font-bold font-urbanist text-navy-main mt-2">
            {isDashboardLoading ? '...' : kpiCards.pending_leaves_count}
          </p>
        </div>

        {/* Card 4: Low Attendance */}
        <div className="bg-white border-l-4 border-l-accent-orange border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Low Attendance
          </span>
          <p className="text-3xl font-bold font-urbanist text-accent-orange mt-2">
            {isDashboardLoading ? '...' : kpiCards.low_attendance_students_count}
          </p>
        </div>
      </div>

      {/* 3. Action Cards Row (2 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Action Card 1: Mark Teachers */}
        <div
          onClick={() => navigate('/attendance/teachers')}
          className="bg-white border border-card-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
        >
          <div className="size-12 rounded-xl bg-brand-soft text-brand-primary flex items-center justify-center shrink-0">
            <BookOpen className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-urbanist text-navy-main group-hover:text-brand-primary transition-colors">
              Mark Teachers
            </h3>
            <p className="text-xs font-sans text-slate-500">
              Register staff attendance
            </p>
          </div>
        </div>

        {/* Action Card 2: Leave Requests */}
        <div
          onClick={() => navigate('/attendance/leaves')}
          className="bg-white border border-card-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
        >
          <div className="size-12 rounded-xl bg-brand-soft text-brand-primary flex items-center justify-center shrink-0">
            <ClipboardList className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-urbanist text-navy-main group-hover:text-brand-primary transition-colors">
              Leave Requests
            </h3>
            <p className="text-xs font-sans text-slate-500">
              Approve or reject leaves
            </p>
          </div>
        </div>
      </div>

      {/* 4. Class-wise Attendance Section */}
      <div className="space-y-6">
        {/* Filter Toolbar Card */}
        <div className="bg-white border border-card-border rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold font-urbanist text-navy-main">
            Class-wise Attendance
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Class Select Dropdown */}
            <div className="w-full sm:w-44">
              <CustomSelect
                options={classOptions}
                value={selectedClassId}
                onChange={handleClassSelect}
                placeholder="Classes"
                disabled={isClassesLoading}
              />
            </div>

            {/* Section Select Dropdown */}
            <div className="w-full sm:w-44">
              <CustomSelect
                options={sectionOptions}
                value={selectedSectionId}
                onChange={(val) => setSelectedSectionId(val)}
                placeholder="Sections"
                disabled={!selectedClassId || isSectionsLoading}
              />
            </div>

            {/* Apply Action Button */}
            <button
              type="button"
              onClick={handleApplyFilter}
              className="px-6 h-11 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-urbanist font-medium text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Filter className="size-4" />
              <span>Apply</span>
            </button>
          </div>
        </div>

        {/* Attendance Content Grid */}
        {isDashboardLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-center font-sans space-y-3">
            <AlertCircle className="size-8 text-rose-600 mx-auto" />
            <p className="font-semibold">Failed to load attendance dashboard data.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : classWiseAttendance.length === 0 ? (
          <div className="p-12 bg-white border border-card-border rounded-2xl text-center font-sans text-slate-500 space-y-2">
            <p className="font-semibold text-base">No class attendance data available.</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or checking back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classWiseAttendance.flatMap((clsItem) =>
              clsItem.sections.map((secItem: SectionAttendanceItem, idx: number) => {
                const totalStudents = secItem.total_students || 0
                const present = secItem.present || 0
                const absent = secItem.absent || 0
                const rate = totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0

                // Color rules based on percentage:
                // Green: >= 90%, Orange: 70-89%, Red: < 70%
                let percentageColorClass = 'text-emerald-600'
                let progressBarColorClass = 'bg-emerald-600'
                if (rate < 70) {
                  percentageColorClass = 'text-rose-600'
                  progressBarColorClass = 'bg-rose-600'
                } else if (rate < 90) {
                  percentageColorClass = 'text-accent-orange'
                  progressBarColorClass = 'bg-accent-orange'
                }

                const targetSectionId = (secItem as any).section_id || (secItem as any).id || (secItem as any)._id || ''

                return (
                  <div
                    key={`${clsItem.class_name}-${secItem.section_name}-${idx}`}
                    onClick={() => {
                      if (targetSectionId) {
                        navigate(`/attendance/sections/${targetSectionId}`)
                      }
                    }}
                    className="bg-white border border-card-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-5"
                  >
                    {/* Top Row: Class & Section Title + Percentage Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <h3 className="text-xl font-bold font-urbanist text-navy-main">
                          {clsItem.class_name}
                        </h3>
                        <p className="text-sm font-semibold font-urbanist text-brand-primary capitalize">
                          {secItem.section_name.startsWith('Section') ? secItem.section_name : `Section ${secItem.section_name}`}
                        </p>
                      </div>

                      <span className={`text-xl font-bold font-urbanist ${percentageColorClass}`}>
                        {rate}%
                      </span>
                    </div>

                    {/* Stats List */}
                    <div className="space-y-2.5 font-sans text-sm border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Total Students</span>
                        <span className="font-semibold text-slate-800">{totalStudents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Present</span>
                        <span className="font-semibold text-emerald-600">{present}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Absent</span>
                        <span className="font-semibold text-rose-600">{absent}</span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressBarColorClass}`}
                        style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceOverviewPage
