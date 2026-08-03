import React, { useState } from 'react'
import { ChevronDown, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useClassesOverviewFull } from '@/features/classes/api/useClasses'
import { useExamsList } from '../api/useExamsList'
import type { AcademicReportQueryParams } from '../types/reports.types'

interface AcademicReportFiltersProps {
  onApplyFilters: (filters: AcademicReportQueryParams) => void
}

export const AcademicReportFilters: React.FC<AcademicReportFiltersProps> = ({
  onApplyFilters,
}) => {
  const [selectedExamId, setSelectedExamId] = useState('ALL')
  const [selectedClassId, setSelectedClassId] = useState('ALL')
  const [selectedSubject, setSelectedSubject] = useState('ALL')

  const { data: classesOverview } = useClassesOverviewFull()
  const { data: examsData } = useExamsList()

  const classesList = classesOverview?.classes_list || []
  const examsList = Array.isArray(examsData) ? examsData : (examsData as any)?.exams || []

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    onApplyFilters({
      exam_id: selectedExamId !== 'ALL' ? selectedExamId : undefined,
      class_id: selectedClassId !== 'ALL' ? selectedClassId : undefined,
      subject: selectedSubject !== 'ALL' ? selectedSubject : undefined,
    })
  }

  return (
    <form
      onSubmit={handleApply}
      className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-xs space-y-4 mb-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Exam Selector */}
        <div className="space-y-1.5">
          <label htmlFor="exam_id" className="text-xs font-semibold text-slate-700">
            Target Exam
          </label>
          <div className="relative">
            <select
              id="exam_id"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full h-11 pl-3.5 pr-8 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 appearance-none cursor-pointer focus:outline-none focus:border-brand-primary transition-all"
            >
              <option value="ALL">All Exams</option>
              {examsList.map((ex: any) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Grade / Class Selector */}
        <div className="space-y-1.5">
          <label htmlFor="academic_class_id" className="text-xs font-semibold text-slate-700">
            Grade / Class
          </label>
          <div className="relative">
            <select
              id="academic_class_id"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
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

        {/* Subject Filter */}
        <div className="space-y-1.5">
          <label htmlFor="subject_filter" className="text-xs font-semibold text-slate-700">
            Subject
          </label>
          <div className="relative">
            <select
              id="subject_filter"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full h-11 pl-3.5 pr-8 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 appearance-none cursor-pointer focus:outline-none focus:border-brand-primary transition-all"
            >
              <option value="ALL">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Science">Science</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Computer Science">Computer Science</option>
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
