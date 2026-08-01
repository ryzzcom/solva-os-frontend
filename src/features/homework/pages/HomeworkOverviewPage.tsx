import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Calendar,
  Filter,
  AlertCircle,
  BookOpenCheck,
} from 'lucide-react'
import { CustomSelect } from '@/components/ui/select'
import { useClassesOverviewFull } from '@/features/classes/api/useClasses'
import { useClassSectionsOverview } from '@/features/classes/sections/api/useClassSectionsOverview'
import { useHomeworkOverview } from '../api/useHomeworkOverview'
import type { HomeworkOverviewItem } from '../types/homework.types'

export const HomeworkOverviewPage: React.FC = () => {
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

  // Fetch homework overview stats
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError,
    refetch,
  } = useHomeworkOverview(appliedParams)

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
        value: sec.section_id || sec.id,
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

  const kpiCards = overviewData?.kpi_cards || {
    total_active_homework: 128,
    completed: 1042,
    pending: 232,
    submission_rate: 84.0,
  }

  const homeworkList = overviewData?.homework_list || []

  // Format current date display string
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Breadcrumb & Title */}
      <div className="space-y-4">
        {/* Breadcrumb Row */}
        <div className="flex items-center gap-2 text-xs md:text-sm font-sans text-slate-500">
          <span>Principal Dashboard.</span>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-semibold text-navy-main font-urbanist">Homework</span>
        </div>

        {/* Title Banner & Date Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-navy-main">
              Homework Dashboard
            </h1>
            <p className="text-sm font-sans text-slate-600">
              Monitor homework across classes and stay updated with daily activity.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-card-border rounded-xl text-xs font-bold font-urbanist text-slate-700 shadow-xs shrink-0">
            <Calendar className="size-4 text-brand-primary" />
            <span>{currentDateStr}</span>
          </div>
        </div>
      </div>

      {/* 2. Top Bento Grid Stats Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Homework */}
        <div className="bg-white border-l-4 border-l-brand-primary border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Total Homework
          </span>
          <p className="text-3xl font-bold font-urbanist text-brand-primary mt-2">
            {isOverviewLoading ? '...' : kpiCards.total_active_homework}
          </p>
        </div>

        {/* Card 2: Completed */}
        <div className="bg-white border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Completed
          </span>
          <p className="text-3xl font-bold font-urbanist text-navy-main mt-2">
            {isOverviewLoading ? '...' : kpiCards.completed.toLocaleString()}
          </p>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Pending
          </span>
          <p className="text-3xl font-bold font-urbanist text-navy-main mt-2">
            {isOverviewLoading ? '...' : kpiCards.pending.toLocaleString()}
          </p>
        </div>

        {/* Card 4: Submission Rate */}
        <div className="bg-white border-l-4 border-l-accent-orange border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Submission Rate
          </span>
          <p className="text-3xl font-bold font-urbanist text-accent-orange mt-2">
            {isOverviewLoading ? '...' : `${kpiCards.submission_rate}%`}
          </p>
        </div>
      </div>

      {/* 3. Homework Overview Section */}
      <div className="space-y-6">
        {/* Filter Toolbar Card */}
        <div className="bg-white border border-card-border rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold font-urbanist text-navy-main">
            Homework Overview
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

        {/* Homework Content Grid */}
        {isOverviewLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-center font-sans space-y-3">
            <AlertCircle className="size-8 text-rose-600 mx-auto" />
            <p className="font-semibold">Failed to load homework overview data.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : homeworkList.length === 0 ? (
          <div className="p-12 bg-white border border-card-border rounded-2xl text-center font-sans text-slate-500 space-y-2">
            <BookOpenCheck className="size-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No homework records found.</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeworkList.map((item: HomeworkOverviewItem) => {
              const stats = item.progress_stats || {
                total_students: 40,
                submitted: 32,
                pending: 8,
                submission_percentage: 80.0,
              }

              const rate = Math.round(stats.submission_percentage)

              // Dynamic percentage color
              let pctColorClass = 'text-emerald-600'
              let barColorClass = 'bg-emerald-600'
              if (rate < 60) {
                pctColorClass = 'text-rose-600'
                barColorClass = 'bg-rose-600'
              } else if (rate < 80) {
                pctColorClass = 'text-accent-orange'
                barColorClass = 'bg-accent-orange'
              }

              return (
                <div
                  key={item.homework_id}
                  onClick={() => navigate(`/homework/${item.homework_id}`)}
                  className="bg-white border border-card-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-5"
                >
                  {/* Card Header: Subject Pill & Due Date */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="px-3.5 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold font-urbanist">
                      {item.subject || 'General'}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs font-medium font-sans text-slate-500">
                      <Calendar className="size-3.5 text-slate-400" />
                      <span>{item.due_date}</span>
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-urbanist text-navy-main line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold font-urbanist text-brand-primary">
                      {item.class_section} • <span className="font-normal text-slate-600">{item.teacher_name}</span>
                    </p>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold font-urbanist">
                      <span className="text-slate-500 font-sans font-normal">Progress</span>
                      <span className={pctColorClass}>{rate}%</span>
                    </div>

                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
                        style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
                      />
                    </div>
                  </div>

                  {/* Sub-metrics 3 Boxes Row */}
                  <div className="grid grid-cols-3 gap-3 text-center font-urbanist">
                    {/* Total Box */}
                    <div className="p-3 bg-slate-100/80 rounded-xl space-y-0.5">
                      <span className="text-[11px] font-sans text-slate-500 block">Total</span>
                      <span className="text-base font-bold text-slate-800">{stats.total_students}</span>
                    </div>

                    {/* Done Box */}
                    <div className="p-3 bg-emerald-100 rounded-xl space-y-0.5">
                      <span className="text-[11px] font-sans text-emerald-700 block">Done</span>
                      <span className="text-base font-bold text-emerald-700">{stats.submitted}</span>
                    </div>

                    {/* Wait Box */}
                    <div className="p-3 bg-rose-100 rounded-xl space-y-0.5">
                      <span className="text-[11px] font-sans text-rose-700 block">Wait</span>
                      <span className="text-base font-bold text-rose-700">{stats.pending}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeworkOverviewPage
