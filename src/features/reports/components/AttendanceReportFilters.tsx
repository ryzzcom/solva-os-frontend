import React, { useState } from 'react'
import { Calendar, ChevronDown, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useClassesOverviewFull } from '@/features/classes/api/useClasses'
import type { AttendanceReportQueryParams } from '../types/reports.types'

interface AttendanceReportFiltersProps {
  onApplyFilters: (filters: AttendanceReportQueryParams) => void
}

export const AttendanceReportFilters: React.FC<AttendanceReportFiltersProps> = ({
  onApplyFilters,
}) => {
  // Default to start of current month
  const now = new Date()
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const defaultEnd = now.toISOString().split('T')[0]

  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [selectedClassId, setSelectedClassId] = useState('ALL')
  const [selectedSectionId, setSelectedSectionId] = useState('ALL')

  const { data: classesOverview } = useClassesOverviewFull()
  const classesList = classesOverview?.classes_list || []

  // Find sections for selected class
  const currentSelectedClass = classesList.find((c) => (c.id || (c as any).class_id) === selectedClassId)
  const sectionsList = currentSelectedClass?.sections || []

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedClassId(val)
    setSelectedSectionId('ALL')
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    onApplyFilters({
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      class_id: selectedClassId !== 'ALL' ? selectedClassId : undefined,
      section_id: selectedSectionId !== 'ALL' ? selectedSectionId : undefined,
    })
  }

  return (
    <form
      onSubmit={handleApply}
      className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-xs space-y-4 mb-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Start Date */}
        <div className="space-y-1.5">
          <label htmlFor="start_date" className="text-xs font-semibold text-slate-700">
            Start Date
          </label>
          <div className="relative">
            <Input
              id="start_date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white text-xs pr-8"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <label htmlFor="end_date" className="text-xs font-semibold text-slate-700">
            End Date
          </label>
          <div className="relative">
            <Input
              id="end_date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white text-xs pr-8"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Target Class */}
        <div className="space-y-1.5">
          <label htmlFor="class_id" className="text-xs font-semibold text-slate-700">
            Grade / Class
          </label>
          <div className="relative">
            <select
              id="class_id"
              value={selectedClassId}
              onChange={handleClassChange}
              className="w-full h-11 pl-3.5 pr-8 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 appearance-none cursor-pointer focus:outline-none focus:border-brand-primary transition-all"
            >
              <option value="ALL">All Classes</option>
              {classesList.map((cls) => {
                const classId = cls.id || (cls as any).class_id
                const className = cls.name || cls.class_name || 'Class'
                return (
                  <option key={classId} value={classId}>
                    {className}
                  </option>
                )
              })}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Section */}
        <div className="space-y-1.5">
          <label htmlFor="section_id" className="text-xs font-semibold text-slate-700">
            Section
          </label>
          <div className="relative">
            <select
              id="section_id"
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              disabled={!selectedClassId || selectedClassId === 'ALL'}
              className="w-full h-11 pl-3.5 pr-8 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 appearance-none cursor-pointer focus:outline-none focus:border-brand-primary disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
            >
              <option value="ALL">All Sections</option>
              {sectionsList.map((sec) => {
                const secId = sec.id || (sec as any).section_id
                const secName = sec.name || (sec as any).section_name || ''
                return (
                  <option key={secId} value={secId}>
                    Sec {secName}
                  </option>
                )
              })}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Apply Filters Submit Button */}
        <div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Filter className="size-3.5" />
            <span>Apply Filters</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
