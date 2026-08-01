import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Users,
  BookOpen,
  Edit3,
  Search,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Eye,
  ArrowRightLeft,
} from 'lucide-react'
import { PageBreadcrumb } from '@/components/ui/breadcrumb'
import { KpiStatCard } from '@/components/ui/kpi-card'
import { AttendanceStatusBadge } from '@/components/ui/status-badge'
import { useSectionDetailsFull } from '../api/useSectionDetailsFull'
import type { SectionStudentItem } from '../api/useSectionDetailsFull'
import { AssignTeacherModal } from '../components/AssignTeacherModal'
import { MoveStudentModal } from '@/features/students/components/MoveStudentModal'

export default function SectionDetailPage() {
  const navigate = useNavigate()
  const { sectionId } = useParams<{ sectionId: string }>()

  const { data: sectionData, isLoading, isError } = useSectionDetailsFull(sectionId)

  // Assign Teacher Modal State
  const [assignTeacherModalOpen, setAssignTeacherModalOpen] = useState(false)

  // Move Student Modal State
  const [moveModalOpen, setMoveModalOpen] = useState(false)
  const [selectedStudentForMove, setSelectedStudentForMove] = useState<SectionStudentItem | null>(null)

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const headerInfo = sectionData?.header_info || {
    class_name: 'Class',
    section_name: 'Section',
    total_students: 0,
    max_capacity: 30,
    avg_attendance_percentage: 0,
  }

  const assignedSubjects = sectionData?.assigned_subjects || []
  const studentList = sectionData?.student_list || []

  const classId = headerInfo.class_id || ''
  const className = headerInfo.class_name || 'Class'
  const sectionName = headerInfo.section_name.startsWith('Section')
    ? headerInfo.section_name
    : `Section ${headerInfo.section_name}`

  // Metrics
  const totalStudents = headerInfo.total_students || 0
  const maxCapacity = headerInfo.max_capacity || 30
  const fillRatePercentage = maxCapacity > 0 ? Math.round((totalStudents / maxCapacity) * 100) : 0
  const avgAttendance = headerInfo.avg_attendance_percentage || 0

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return studentList.filter((student: SectionStudentItem) => {
      const matchesSearch =
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registration_id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'ALL' ||
        student.today_status.toUpperCase() === statusFilter.toUpperCase()

      return matchesSearch && matchesStatus
    })
  }, [studentList, searchTerm, statusFilter])



  if (isLoading) {
    return (
      <div className="w-full px-[32px] py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 text-[#2e67b1] animate-spin" />
        <p className="text-slate-600 font-sans font-medium text-base">
          Loading section details...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full px-[32px] py-16 text-center space-y-4">
        <div className="p-8 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl max-w-lg mx-auto space-y-2">
          <AlertCircle className="size-8 text-rose-600 mx-auto" />
          <h3 className="text-lg font-bold font-urbanist">Failed to load section details</h3>
          <p className="text-sm font-sans text-rose-700">
            The requested section profile could not be retrieved.
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
      {/* 1. Breadcrumbs Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageBreadcrumb
          items={[
            { label: 'Principal Dashboard.', href: '/dashboard' },
            { label: 'Classes', href: '/classes' },
            ...(classId
              ? [{ label: `${className} Sections`, href: `/classes/${classId}/sections` }]
              : []),
            { label: `${sectionName} Details` },
          ]}
        />

        <button
          type="button"
          onClick={() =>
            classId ? navigate(`/classes/${classId}/sections`) : navigate('/classes')
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-semibold font-urbanist cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back to Sections
        </button>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#2e67b1] border border-slate-800 text-white rounded-2xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white/10 border border-white/20 text-blue-100 rounded-lg text-xs font-semibold font-urbanist uppercase tracking-wider">
                Academic Section Overview
              </span>
              <span className="text-xs text-slate-300 font-mono">
                ID: {sectionId?.substring(0, 8)}...
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold font-urbanist text-white">
              {className} - {sectionName}
            </h1>
            <p className="text-sm font-sans text-slate-200 max-w-2xl leading-relaxed">
              Section roster, student enrollment capacity, today's attendance log, and academic subject mapping.
            </p>
          </div>

          {/* Right Header Actions & Class Teacher Card */}
          <div className="flex items-center gap-4 shrink-0 flex-wrap">
            {/* Class Teacher Info Box */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-white/20 text-white font-bold text-lg flex items-center justify-center font-urbanist shrink-0">
                  {headerInfo.class_teacher?.name
                    ? headerInfo.class_teacher.name.charAt(0)
                    : 'T'}
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-blue-200 font-sans block">Class Teacher</span>
                  <span className="text-sm font-bold font-urbanist text-white block max-w-[150px] truncate">
                    {headerInfo.class_teacher?.name || 'Not Assigned'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAssignTeacherModalOpen(true)}
                className="text-xs font-bold text-blue-200 hover:text-white hover:underline font-urbanist cursor-pointer shrink-0 ml-2"
              >
                {headerInfo.class_teacher?.name ? 'Change' : 'Assign'}
              </button>
            </div>

            {/* Edit Section Button */}
            <button
              type="button"
              onClick={() =>
                classId
                  ? navigate(`/classes/${classId}/sections/edit/${sectionId}`)
                  : navigate(`/classes/sections/edit/${sectionId}`)
              }
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#0f172a] hover:bg-slate-100 rounded-xl font-urbanist font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <Edit3 className="size-4 text-[#2e67b1]" />
              <span>Edit Section</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Top 4 KPI Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiStatCard
          label="Enrolled Students"
          value={totalStudents}
          subValue={`/ ${maxCapacity}`}
          accentColor="#2e67b1"
          icon={Users}
        />

        <KpiStatCard
          label="Fill Rate"
          value={`${fillRatePercentage}%`}
          accentColor="#f97316"
          progressPercentage={fillRatePercentage}
        />

        <KpiStatCard
          label="Monthly Avg Attendance"
          value={`${avgAttendance}%`}
          accentColor="#22c55e"
          icon={CheckCircle2}
        />

        <KpiStatCard
          label="Assigned Subjects"
          value={assignedSubjects.length}
          subValue="Subjects"
          accentColor="#a855f7"
          icon={BookOpen}
        />
      </div>

      {/* 4. Assigned Subjects Tags Bar */}
      {assignedSubjects.length > 0 && (
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#0f172a] font-semibold font-urbanist text-base">
            <BookOpen className="size-4 text-[#2e67b1]" />
            <span>Assigned Curriculum Subjects</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {assignedSubjects.map((subj, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 bg-[#e6effa] border border-[#2e67b1]/20 text-[#2e67b1] rounded-xl text-xs font-semibold font-urbanist flex items-center gap-1.5"
              >
                <BookOpen className="size-3.5" />
                <span>{subj.subject_name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 5. Enrolled Student Roster Data Table */}
      <div className="bg-white border border-[#d8dee8] rounded-2xl shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-urbanist text-[#0f172a] flex items-center gap-2">
              <GraduationCap className="size-5 text-[#2e67b1]" />
              <span>Section Student Roster</span>
            </h3>
            <p className="text-xs font-sans text-slate-500">
              Active student enrollments and today's real-time attendance logs.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student or ID..."
                className="w-full h-10 pl-9 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 font-sans focus:outline-none focus:border-[#2e67b1]"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['ALL', 'PRESENT', 'ABSENT', 'LATE', 'LEAVE'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-urbanist transition-all cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-white text-[#2e67b1] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Registration ID</th>
                <th className="py-3.5 px-4">Today's Status</th>
                <th className="py-3.5 px-4">Monthly Rate</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student: SectionStudentItem, idx: number) => {
                  const targetStudentId = student.student_id || student.id

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      {/* Student Name */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() =>
                            targetStudentId
                              ? navigate(`/students/${targetStudentId}`)
                              : navigate('/students')
                          }
                          className="flex items-center gap-3 cursor-pointer group/st"
                        >
                          <div className="size-9 rounded-full bg-[#e6effa] text-[#2e67b1] font-bold text-sm flex items-center justify-center font-urbanist shrink-0 group-hover/st:bg-[#2e67b1] group-hover/st:text-white transition-colors">
                            {student.student_name ? student.student_name.charAt(0) : 'S'}
                          </div>
                          <span className="font-semibold text-slate-900 font-urbanist group-hover/st:text-[#2e67b1] transition-colors">
                            {student.student_name}
                          </span>
                        </div>
                      </td>

                      {/* Registration ID */}
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                        {student.registration_id}
                      </td>

                      {/* Today's Status */}
                      <td className="py-3.5 px-4">
                        <AttendanceStatusBadge status={student.today_status} />
                      </td>

                      {/* Monthly Rate */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 max-w-xs">
                          <span className="font-bold text-xs font-urbanist text-slate-800 w-12">
                            {student.monthly_attendance_avg}%
                          </span>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2e67b1] rounded-full"
                              style={{ width: `${Math.min(100, student.monthly_attendance_avg)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Action Icon Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Student Profile */}
                          <button
                            type="button"
                            onClick={() =>
                              targetStudentId
                                ? navigate(`/students/${targetStudentId}`)
                                : navigate('/students')
                            }
                            className="p-2 rounded-lg text-slate-400 hover:text-[#2e67b1] hover:bg-blue-50 transition-colors cursor-pointer"
                            title="View Student Profile"
                          >
                            <Eye className="size-4" />
                          </button>

                          {/* Move Class / Section */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStudentForMove(student)
                              setMoveModalOpen(true)
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Move Class / Section"
                          >
                            <ArrowRightLeft className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Teacher Portal Modal */}
      <AssignTeacherModal
        open={assignTeacherModalOpen}
        onClose={() => setAssignTeacherModalOpen(false)}
        sectionId={sectionId}
        sectionName={sectionName}
        currentTeacherId={headerInfo.class_teacher_id || headerInfo.class_teacher?.id}
        classId={classId}
      />

      {/* Move Student Class / Section Portal Modal */}
      <MoveStudentModal
        open={moveModalOpen}
        onClose={() => {
          setMoveModalOpen(false)
          setSelectedStudentForMove(null)
        }}
        studentId={selectedStudentForMove?.student_id || selectedStudentForMove?.id}
        studentName={selectedStudentForMove?.student_name}
        currentClassName={className}
        currentSectionName={sectionName}
        currentClassId={classId}
        currentSectionId={sectionId}
      />
    </div>
  )
}
