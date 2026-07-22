import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { CustomSelect } from '@/components/ui/select-dropdown'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { Button } from '@/components/ui/button'
import { useClassesOverview, useClassSections } from '@/features/classes/api/useClasses'

interface StudentsFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  classId: string
  onClassIdChange: (val: string) => void
  sectionId: string
  onSectionIdChange: (val: string) => void
  onApplyFilters: () => void
}

export const StudentsFilterBar: React.FC<StudentsFilterBarProps> = ({
  search,
  onSearchChange,
  classId,
  onClassIdChange,
  sectionId,
  onSectionIdChange,
  onApplyFilters,
}) => {
  const [localSearch, setLocalSearch] = useState(search)
  const [localClassId, setLocalClassId] = useState(classId)
  const [localSectionId, setLocalSectionId] = useState(sectionId)

  // Fetch real dynamic classes from backend API
  const { data: realClassesList = [] } = useClassesOverview()

  // Dynamic Class Options mapped 100% from Backend DB
  const classOptions: SelectOption[] = realClassesList.map((cls) => ({
    label: cls.name || cls.class_name || 'Class',
    value: cls.id,
  }))

  // Fetch real dynamic sections for localClassId from backend API
  const { data: realSectionsList = [] } = useClassSections(localClassId)

  // Compute Section Options strictly from backend API
  const sectionOptions: SelectOption[] = realSectionsList.map((sec) => ({
    label: `Section ${sec.section_name || sec.name}`,
    value: sec.section_id || sec.id || '',
  }))

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearch)
    onClassIdChange(localClassId)
    onSectionIdChange(localSectionId)
    onApplyFilters()
  }

  return (
    <form
      onSubmit={handleApply}
      className="bg-white border border-[#d8dee8] rounded-[8px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs"
    >
      {/* Search Capsule */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#94a3b8]" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Name, rollno or status"
          className="w-full bg-white border border-[#d8dee8] rounded-[8px] pl-11 pr-4 py-2 text-base md:text-lg text-[#0f172a] placeholder-[#94a3b8] font-urbanist focus:outline-none focus:border-[#2e67b1] transition-colors"
        />
      </div>

      {/* Filter Action Capsule */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        {/* Class / Grade Dropdown */}
        <CustomSelect
          options={classOptions}
          value={localClassId}
          onChange={setLocalClassId}
          placeholder="All Grade"
          className="w-36 md:w-40"
        />

        {/* Section Dropdown */}
        <CustomSelect
          options={sectionOptions}
          value={localSectionId}
          onChange={setLocalSectionId}
          placeholder="All Section"
          className="w-36 md:w-40"
        />

        {/* Apply Button using Figma Button Component */}
        <Button type="submit" variant="primary">
          Apply
        </Button>
      </div>
    </form>
  )
}
