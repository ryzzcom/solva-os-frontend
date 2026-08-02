import React, { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useClassesOverviewFull } from '@/features/classes/api/useClasses'

interface AnnouncementsFilterBarProps {
  onApplyFilters: (filters: {
    search: string
    class_id: string
    section_id: string
  }) => void
}

export const AnnouncementsFilterBar: React.FC<AnnouncementsFilterBarProps> = ({
  onApplyFilters,
}) => {
  const [search, setSearch] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('ALL')
  const [selectedSectionId, setSelectedSectionId] = useState('ALL')

  const { data: classesOverview } = useClassesOverviewFull()
  const classesList = classesOverview?.classes_list || []

  // Find sections for the selected class
  const currentSelectedClass = classesList.find((c) => (c.id || (c as any).class_id) === selectedClassId)
  const sectionsList = currentSelectedClass?.sections || []

  const handleApply = () => {
    onApplyFilters({
      search,
      class_id: selectedClassId,
      section_id: selectedSectionId,
    })
  }

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedClassId(val)
    setSelectedSectionId('ALL') // reset section when class changes
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center gap-4">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name, Rollno Or Status"
          className="pl-10 h-11 rounded-xl border border-slate-200 focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 bg-white text-sm"
        />
      </div>

      {/* Grade / Class Dropdown */}
      <div className="relative w-full md:w-44">
        <select
          value={selectedClassId}
          onChange={handleClassChange}
          className="w-full h-11 pl-4 pr-9 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-sm font-semibold text-slate-700 appearance-none cursor-pointer focus:outline-none focus:border-brand-primary transition-all"
        >
          <option value="ALL">All Grade</option>
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

      {/* Section Dropdown */}
      <div className="relative w-full md:w-44">
        <select
          value={selectedSectionId}
          onChange={(e) => setSelectedSectionId(e.target.value)}
          disabled={selectedClassId === 'ALL'}
          className="w-full h-11 pl-4 pr-9 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-sm font-semibold text-slate-700 appearance-none cursor-pointer focus:outline-none focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <option value="ALL">All Section</option>
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

      {/* Apply Button */}
      <Button
        onClick={handleApply}
        className="w-full md:w-auto h-11 px-8 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-all shadow-sm"
      >
        Apply
      </Button>
    </div>
  )
}

export default AnnouncementsFilterBar
