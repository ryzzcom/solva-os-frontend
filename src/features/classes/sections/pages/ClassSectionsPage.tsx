import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Edit3, Trash2, Users, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { PageBreadcrumb } from '@/components/ui/breadcrumb'
import { KpiStatCard } from '@/components/ui/kpi-card'
import { useClassSectionsOverview } from '../api/useClassSectionsOverview'
import type { SectionOverviewItem } from '../api/useClassSectionsOverview'
import { DeleteSectionModal } from '../components/DeleteSectionModal'

export default function ClassSectionsPage() {
  const navigate = useNavigate()
  const { id: classId } = useParams<{ id: string }>()

  const { data: classSectionsData, isLoading, isError } = useClassSectionsOverview(classId)

  // Modal State for Section Deletion
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedSectionForDelete, setSelectedSectionForDelete] = useState<SectionOverviewItem | null>(null)

  const className = classSectionsData?.class_name || 'Grade Sections'
  const sections = classSectionsData?.sections || []

  // KPI Calculations
  const totalSectionsCount = sections.length
  const totalStudentsCount = sections.reduce((acc, s) => acc + (s.current_students || 0), 0)
  const totalMaxCapacity = sections.reduce((acc, s) => acc + (s.max_capacity || 0), 0)
  const fillRatePercentage = totalMaxCapacity > 0
    ? Math.round((totalStudentsCount / totalMaxCapacity) * 100)
    : 0

  // Helper to extract class grade badge number (e.g. "Grade 10" -> "10")
  const getGradeBadge = (name: string) => {
    const match = name.match(/\d+/)
    return match ? match[0] : 'CL'
  }

  // Capacity Progress Bar Color Helper
  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return { bar: 'bg-[#e11d48]', text: 'text-[#e11d48]' }
    if (percentage >= 70) return { bar: 'bg-amber-500', text: 'text-amber-600' }
    return { bar: 'bg-emerald-500', text: 'text-emerald-600' }
  }

  if (isLoading) {
    return (
      <div className="w-full px-[32px] py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 text-[#2e67b1] animate-spin" />
        <p className="text-slate-600 font-sans font-medium text-base">
          Loading class sections...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full px-[32px] py-16 text-center space-y-4">
        <div className="p-8 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl max-w-lg mx-auto space-y-2">
          <AlertCircle className="size-8 text-rose-600 mx-auto" />
          <h3 className="text-lg font-bold font-urbanist">Failed to load sections</h3>
          <p className="text-sm font-sans text-rose-700">
            Could not fetch section details for this class.
          </p>
          <button
            type="button"
            onClick={() => navigate('/classes')}
            className="mt-2 px-4 py-2 bg-white border border-rose-300 text-rose-800 rounded-xl text-sm font-semibold font-urbanist hover:bg-rose-100 transition-colors"
          >
            Back to Classes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Breadcrumb Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageBreadcrumb
          items={[
            { label: 'Principal Dashboard.', href: '/dashboard' },
            { label: 'Classes', href: '/classes' },
            { label: `${className} Sections` },
          ]}
        />

        <button
          type="button"
          onClick={() => navigate('/classes')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-semibold font-urbanist cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back to Classes
        </button>
      </div>

      {/* 2. Hero Header Card matching Figma 191-5097 */}
      <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Grade Badge */}
          <div className="size-16 rounded-2xl bg-[#e6effa] text-[#2e67b1] font-urbanist font-bold text-2xl flex items-center justify-center shrink-0 shadow-xs">
            {getGradeBadge(className)}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-[#0f172a]">
              {className}
            </h1>
            <p className="text-sm font-sans text-slate-600 max-w-xl">
              Academic year secondary education focusing on core curriculum and section distribution.
            </p>
          </div>
        </div>

        {/* Primary Action Button: Add Section */}
        <button
          type="button"
          onClick={() => navigate(`/classes/${classId}/sections/add`)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white rounded-xl font-urbanist font-medium text-base shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
        >
          <Plus className="size-5" />
          <span>Add Section</span>
        </button>
      </div>

      {/* 3. Top 3 KPI Stats Bar matching Figma 191-5097 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KpiStatCard
          label="Sections"
          value={totalSectionsCount}
          accentColor="#2e67b1"
        />

        <KpiStatCard
          label="Students"
          value={totalStudentsCount}
          accentColor="#f97316"
        />

        <KpiStatCard
          label="Fill Rate"
          value={`${fillRatePercentage}%`}
          accentColor="#22c55e"
        />
      </div>

      {/* 4. Section Bento Cards Grid matching Figma 191-5097 */}
      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="p-12 bg-slate-50 border border-slate-200 rounded-2xl text-center font-sans space-y-3">
            <p className="text-slate-600 font-semibold text-base">
              No active sections found for {className}.
            </p>
            <button
              type="button"
              onClick={() => navigate(`/classes/edit/${classId}`)}
              className="px-5 py-2.5 bg-[#2e67b1] text-white rounded-xl text-sm font-semibold font-urbanist hover:bg-[#2e67b1]/90 transition-colors"
            >
              Configure Sections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((sec: SectionOverviewItem) => {
              const progress = Math.min(100, Math.round(sec.progress_percentage || 0))
              const colors = getCapacityColor(progress)
              const secDisplayName = sec.section_name.startsWith('Section')
                ? sec.section_name
                : `Section ${sec.section_name}`

              return (
                <div
                  key={sec.section_id}
                  onClick={() => navigate(`/classes/sections/${sec.section_id}`)}
                  className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Section Name & Action Icons */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold font-urbanist text-[#0f172a] group-hover:text-[#2e67b1] transition-colors">
                        {secDisplayName}
                      </h3>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/classes/${classId}/sections/edit/${sec.section_id}`)
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#2e67b1] hover:bg-blue-50 transition-colors"
                          title="Edit Section"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSectionForDelete(sec)
                            setDeleteModalOpen(true)
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Section"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Enrollment Ratio */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-sans">
                      <Users className="size-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {sec.current_students} / {sec.max_capacity} Students
                      </span>
                    </div>

                    {/* Progress Bar Section */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-slate-500 font-medium">Capacity</span>
                        <span className={`font-bold ${colors.text}`}>{progress}%</span>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Row: Class Teacher Info */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-xs text-slate-400 font-sans block">
                        Class Teacher
                      </span>
                      <span className="text-sm font-bold font-urbanist text-[#0f172a] block truncate max-w-[180px]">
                        {sec.class_teacher?.full_name || 'Not assigned'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/classes/${classId}/sections/edit/${sec.section_id}`)}
                      className="text-xs font-semibold text-[#2e67b1] hover:underline font-urbanist cursor-pointer shrink-0"
                    >
                      {sec.class_teacher ? 'Change' : 'Assign'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Section Confirmation Portal Modal */}
      <DeleteSectionModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedSectionForDelete(null)
        }}
        sectionId={selectedSectionForDelete?.section_id}
        sectionName={
          selectedSectionForDelete?.section_name
            ? selectedSectionForDelete.section_name.startsWith('Section')
              ? selectedSectionForDelete.section_name
              : `Section ${selectedSectionForDelete.section_name}`
            : 'Section'
        }
        className={className}
        currentStudents={selectedSectionForDelete?.current_students}
        classId={classId}
      />
    </div>
  )
}
