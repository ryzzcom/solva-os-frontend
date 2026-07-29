import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Plus, Star, Edit3, Trash2 } from 'lucide-react'
import { useClassesOverviewFull } from '../api/useClasses'
import type { BackendClassItem } from '../api/useClasses'
import { DeleteClassModal } from '../components/DeleteClassModal'

export default function ClassesPage() {
  const navigate = useNavigate()
  const { data: overviewData, isLoading, isError } = useClassesOverviewFull()

  // Modal State for Class Deletion
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedClassForDelete, setSelectedClassForDelete] = useState<BackendClassItem | null>(null)

  const kpiStats = overviewData?.kpi_stats || {
    total_classes: 0,
    total_sections: 0,
    total_students: 0,
    avg_students_per_class: 0,
  }

  const classesList = overviewData?.classes_list || []



  return (
    <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Breadcrumbs Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-base flex-wrap font-sans">
          <span
            onClick={() => navigate('/dashboard')}
            className="text-slate-sub hover:underline cursor-pointer"
          >
            Principal Dashboard.
          </span>
          <ChevronRight className="size-4 text-slate-sub" />
          <span className="text-navy-main font-medium font-urbanist capitalize">
            Classes
          </span>
        </div>
      </div>

      {/* 2. Hero Title & Primary Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-[#0f172a]">
            Classes
          </h1>
          <p className="text-sm md:text-base font-sans text-slate-600">
            Manage academic levels and enrollment distribution.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/classes/add')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white rounded-xl font-urbanist font-medium text-base shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
        >
          <Plus className="size-5" />
          <span>Add Class</span>
        </button>
      </div>

      {/* 3. Top Stats KPI Cards Bar (4 Cards in a Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Classes */}
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#2e67b1] rounded-l-2xl" />
          <span className="text-sm font-sans font-normal text-slate-600 pl-2">
            Total Classes
          </span>
          <p className="text-3xl font-bold font-urbanist text-[#2e67b1] pl-2 mt-2">
            {isLoading ? '...' : kpiStats.total_classes}
          </p>
        </div>

        {/* Card 2: Total Sections */}
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#f97316] rounded-l-2xl" />
          <span className="text-sm font-sans font-normal text-slate-600 pl-2">
            Total Sections
          </span>
          <p className="text-3xl font-bold font-urbanist text-[#f97316] pl-2 mt-2">
            {isLoading ? '...' : kpiStats.total_sections}
          </p>
        </div>

        {/* Card 3: Total Students */}
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#22c55e] rounded-l-2xl" />
          <span className="text-sm font-sans font-normal text-slate-600 pl-2">
            Total Students
          </span>
          <p className="text-3xl font-bold font-urbanist text-[#22c55e] pl-2 mt-2">
            {isLoading ? '...' : kpiStats.total_students}
          </p>
        </div>

        {/* Card 4: Avg. Students/Class */}
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#a855f7] rounded-l-2xl" />
          <span className="text-sm font-sans font-normal text-slate-600 pl-2">
            Avg. Students/Class
          </span>
          <p className="text-3xl font-bold font-urbanist text-[#a855f7] pl-2 mt-2">
            {isLoading ? '...' : kpiStats.avg_students_per_class}
          </p>
        </div>
      </div>

      {/* 4. Classes Bento Cards Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-52 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-center font-sans space-y-2">
            <p className="font-semibold">Failed to load classes overview.</p>
            <p className="text-sm text-rose-600">Please check your network connection and try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classesList.map((cls: BackendClassItem) => (
              <div
                key={cls.id}
                onClick={() => navigate(`/classes/${cls.id}/sections`)}
                className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon Badge & Edit/Delete Action Icons */}
                  <div className="flex items-center justify-between pb-4">
                    <div className="size-11 rounded-xl bg-[#e6effa] text-[#2e67b1] flex items-center justify-center">
                      <Star className="size-5 fill-[#2e67b1]/20 stroke-[#2e67b1]" />
                    </div>

                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/classes/edit/${cls.id}`)
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-[#2e67b1] hover:bg-blue-50 transition-colors"
                        title="Edit Class"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedClassForDelete(cls)
                          setDeleteModalOpen(true)
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Class Title */}
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold font-urbanist text-[#0f172a] group-hover:text-[#2e67b1] transition-colors">
                      {cls.name || cls.class_name}
                    </h3>
                  </div>
                </div>

                {/* Divider & Metrics */}
                <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-xs font-sans text-slate-400 block">Sections</span>
                    <span className="text-base font-bold font-urbanist text-[#0f172a]">
                      {cls.sections_count ?? 0} Sections
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-sans text-slate-400 block">Total Students</span>
                    <span className="text-base font-bold font-urbanist text-[#0f172a]">
                      {cls.total_students ?? 0} Students
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Dashed Add Card: Establish Level */}
            <div
              onClick={() => navigate('/classes/add')}
              className="border-2 border-dashed border-slate-300 hover:border-[#2e67b1] bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-3 min-h-[220px] group"
            >
              <div className="size-12 rounded-full bg-slate-200/70 group-hover:bg-[#2e67b1] text-slate-600 group-hover:text-white flex items-center justify-center transition-colors">
                <Plus className="size-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold font-urbanist text-[#0f172a] group-hover:text-[#2e67b1] transition-colors">
                  Establish Level
                </h4>
                <p className="text-xs font-sans text-slate-500 max-w-xs leading-relaxed">
                  Click to define a new academic grade and sections
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Class Confirmation Portal Modal */}
      <DeleteClassModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedClassForDelete(null)
        }}
        classId={selectedClassForDelete?.id}
        className={selectedClassForDelete?.name || selectedClassForDelete?.class_name}
        sectionsCount={selectedClassForDelete?.sections_count}
        totalStudents={selectedClassForDelete?.total_students}
      />
    </div>
  )
}
