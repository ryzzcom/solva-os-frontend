import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { CustomSelect } from '@/components/ui/select-dropdown'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { Button } from '@/components/ui/button'
import { useClassesOverview } from '@/features/classes/api/useClasses'

interface TeachersFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  classId: string
  onClassIdChange: (val: string) => void
  status: string
  onStatusChange: (val: string) => void
  onApplyFilters: () => void
}

const STATUS_OPTIONS: SelectOption[] = [
  { label: 'All Status', value: '' },
  { label: 'Present', value: 'Present' },
  { label: 'Absent', value: 'Absent' },
  { label: 'On Leave', value: 'On Leave' },
  { label: 'Not Marked', value: 'Not Marked' },
]

export const TeachersFilterBar: React.FC<TeachersFilterBarProps> = ({
  search,
  onSearchChange,
  classId,
  onClassIdChange,
  status,
  onStatusChange,
  onApplyFilters,
}) => {
  const [localSearch, setLocalSearch] = useState(search)
  const [localClassId, setLocalClassId] = useState(classId)
  const [localStatus, setLocalStatus] = useState(status)

  // Fetch real dynamic classes from backend API
  const { data: realClassesList = [] } = useClassesOverview()

  const classOptions: SelectOption[] = [
    { label: 'All Classes', value: '' },
    ...realClassesList.map((cls) => ({
      label: cls.name || cls.class_name || 'Class',
      value: cls.id,
    })),
  ]

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearch)
    onClassIdChange(localClassId)
    onStatusChange(localStatus)
    onApplyFilters()
  }

  return (
    <form
      onSubmit={handleApply}
      className="bg-white border border-card-border rounded-[8px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs"
    >
      {/* Search Bar */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-muted" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search by teacher name, employee ID, or email"
          className="w-full bg-white border border-card-border rounded-[8px] pl-11 pr-4 py-2 text-base md:text-lg text-navy-main placeholder-slate-muted font-urbanist focus:outline-none focus:border-brand-primary transition-colors"
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        <CustomSelect
          options={classOptions}
          value={localClassId}
          onChange={setLocalClassId}
          placeholder="All Classes"
          className="w-40 md:w-44"
        />

        <CustomSelect
          options={STATUS_OPTIONS}
          value={localStatus}
          onChange={setLocalStatus}
          placeholder="All Status"
          className="w-36 md:w-40"
        />

        <Button type="submit" variant="primary">
          Apply
        </Button>
      </div>
    </form>
  )
}
