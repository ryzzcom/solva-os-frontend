import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Plus,
  Search,
  Calendar,
  Clock,
  Filter,
  AlertCircle,
  Users,
  SquarePen,
  Trash2,
  ArrowRight,
} from 'lucide-react'
import { CustomSelect } from '@/components/ui/select'
import { HasRole } from '@/components/auth/HasRole'
import { useClassesOverviewFull } from '@/features/classes/api/useClasses'
import { useClassSectionsOverview } from '@/features/classes/sections/api/useClassSectionsOverview'
import { usePtmList } from '../api/usePtm'
import type { PtmItem, PtmStatus } from '../types/ptm.types'
import { PtmDetailsModal } from '../components/PtmDetailsModal'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Status' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
]

export const PtmManagementPage: React.FC = () => {
  const navigate = useNavigate()

  // Selected PTM ID for modal view
  const [activeModalPtmId, setActiveModalPtmId] = useState<string | null>(null)

  // Filter input states
  const [searchInput, setSearchInput] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Applied query params (triggered on Apply click)
  const [appliedParams, setAppliedParams] = useState<{
    search?: string
    classId?: string
    sectionId?: string
    status?: string
  }>({})

  // Fetch dropdown options
  const { data: classesOverview, isLoading: isClassesLoading } = useClassesOverviewFull()
  const classesList = classesOverview?.classes_list || []

  const { data: sectionsOverview, isLoading: isSectionsLoading } = useClassSectionsOverview(
    selectedClassId
  )
  const sectionsList = sectionsOverview?.sections || []

  // Fetch PTM meetings list
  const {
    data: ptmData,
    isLoading: isPtmLoading,
    isError,
    refetch,
  } = usePtmList(appliedParams)

  const classOptions = [
    { value: '', label: 'All Grade' },
    ...classesList.map((c: any) => ({
      value: c.id,
      label: c.name || c.class_name,
    })),
  ]

  const sectionOptions = [
    { value: '', label: 'All Section' },
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
      ...(searchInput.trim() ? { search: searchInput.trim() } : {}),
      ...(selectedClassId ? { classId: selectedClassId } : {}),
      ...(selectedSectionId ? { sectionId: selectedSectionId } : {}),
      ...(selectedStatus && selectedStatus !== 'ALL' ? { status: selectedStatus } : {}),
    })
  }

  const ptmList = ptmData?.ptm_list || []

  // Render status badge pill
  const renderStatusBadge = (status: PtmStatus | string) => {
    const normStatus = (status || '').toLowerCase()

    if (normStatus === 'completed') {
      return (
        <span className="px-3.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold font-sans">
          Completed
        </span>
      )
    }

    if (normStatus === 'cancelled') {
      return (
        <span className="px-3.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold font-sans">
          Cancelled
        </span>
      )
    }

    return (
      <span className="px-3.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold font-sans">
        Upcoming
      </span>
    )
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Breadcrumb Navigation & Title */}
      <div className="space-y-4">
        {/* Breadcrumb Row */}
        <div className="flex items-center gap-2 text-xs md:text-sm font-sans text-slate-500">
          <span>Principal Dashboard.</span>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-semibold text-navy-main font-urbanist">PTM</span>
        </div>

        {/* Title Banner & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-navy-main">
              PTM Management
            </h1>
            <p className="text-sm font-sans text-slate-600">
              Schedule and monitor parent-teacher interactions
            </p>
          </div>

          {/* Schedule PTM Primary Action Button guarded with HasRole */}
          <HasRole allowedRoles={['SUPER_ADMIN', 'PRINCIPAL']}>
            <button
              type="button"
              onClick={() => navigate('/ptm/schedule')}
              className="px-5 h-11 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-urbanist font-semibold text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Schedule PTM</span>
            </button>
          </HasRole>
        </div>
      </div>

      {/* 2. Filter Toolbar Card */}
      <div className="bg-white border border-card-border rounded-2xl p-5 md:p-6 shadow-xs space-y-4 md:space-y-0 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
            placeholder="Name, Rollno Or Status"
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-card-border bg-white text-sm font-sans text-slate-800 focus:outline-none focus:border-brand-primary transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Dropdowns & Apply Button Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Grade/Class Select */}
          <div className="w-full sm:w-40">
            <CustomSelect
              options={classOptions}
              value={selectedClassId}
              onChange={handleClassSelect}
              placeholder="All Grade"
              disabled={isClassesLoading}
            />
          </div>

          {/* Section Select */}
          <div className="w-full sm:w-40">
            <CustomSelect
              options={sectionOptions}
              value={selectedSectionId}
              onChange={(val) => setSelectedSectionId(val)}
              placeholder="All Section"
              disabled={!selectedClassId || isSectionsLoading}
            />
          </div>

          {/* Status Select */}
          <div className="w-full sm:w-36">
            <CustomSelect
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              placeholder="Status"
            />
          </div>

          {/* Apply Button */}
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

      {/* 3. PTM Meetings Cards Grid (2 Columns Grid) */}
      {isPtmLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-center font-sans space-y-3">
          <AlertCircle className="size-8 text-rose-600 mx-auto" />
          <p className="font-semibold text-sm">Failed to load PTM meetings list.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : ptmList.length === 0 ? (
        <div className="p-12 bg-white border border-card-border rounded-2xl text-center font-sans text-slate-500 space-y-2">
          <Users className="size-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No Parent-Teacher Meetings found.</p>
          <p className="text-xs text-slate-400">Try adjusting your filter parameters or schedule a new PTM.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ptmList.map((item: PtmItem) => (
            <div
              key={item.ptm_id}
              className="bg-white border border-card-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              {/* Card Top Row: Status Badge & Action Controls */}
              <div className="flex items-center justify-between gap-3">
                {renderStatusBadge(item.status)}

                <HasRole allowedRoles={['SUPER_ADMIN', 'PRINCIPAL']}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-brand-primary transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
                      title="Edit PTM"
                    >
                      <SquarePen className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
                      title="Delete PTM"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </HasRole>
              </div>

              {/* Title & Class Section */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-urbanist text-navy-main line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold font-urbanist text-slate-500">
                  {item.class_section}
                </p>
              </div>

              {/* Date & Time Row */}
              <div className="flex items-center gap-6 text-xs font-medium font-sans text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-4 text-brand-primary" />
                  <span>{item.date}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="size-4 text-brand-primary" />
                  <span>{item.start_time}</span>
                </div>
              </div>

              {/* Full Width Action Button */}
              <button
                type="button"
                onClick={() => setActiveModalPtmId(item.ptm_id)}
                className="w-full py-2.5 bg-white border border-brand-primary text-brand-primary hover:bg-brand-soft rounded-xl font-urbanist font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>View Full Details</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PTM Details Modal */}
      <PtmDetailsModal
        ptmId={activeModalPtmId}
        isOpen={Boolean(activeModalPtmId)}
        onClose={() => setActiveModalPtmId(null)}
      />
    </div>
  )
}

export default PtmManagementPage
