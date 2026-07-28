import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useTeacherProfileHeader } from '../api/useTeacherProfile'
import { TeacherProfileHeader } from '../components/TeacherProfileHeader'
import { TeacherProfileTabs } from '../components/TeacherProfileTabs'
import { DeleteTeacherModal } from '../components/DeleteTeacherModal'

export default function TeacherProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { data: headerData, isLoading: isHeaderLoading, isError } = useTeacherProfileHeader(id)

  const handleEditProfile = () => {
    if (id) {
      navigate(`/teachers/edit/${id}`)
    }
  }

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true)
  }

  const handleAssignClass = () => {
    if (id) {
      navigate(`/teachers/${id}/assign-schedule`)
    }
  }

  if (isError) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-urbanist space-y-2">
        <h2 className="text-xl font-bold">Teacher Profile Not Found</h2>
        <p className="text-sm text-red-600 font-sans">
          Could not load details for this teacher ID. It may have been deleted or moved.
        </p>
        <button
          onClick={() => navigate('/teachers')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Back to Teachers Directory
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* 1. Breadcrumb Header */}
      <div className="flex items-center gap-2 text-base">
        <span
          onClick={() => navigate('/dashboard')}
          className="text-slate-sub font-sans font-normal hover:underline cursor-pointer"
        >
          Principal Dashboard.
        </span>
        <ChevronRight className="size-4 text-slate-sub" />
        <span
          onClick={() => navigate('/teachers')}
          className="text-slate-sub font-sans font-normal hover:underline cursor-pointer"
        >
          Teachers
        </span>
        <ChevronRight className="size-4 text-slate-sub" />
        <span className="text-navy-main font-urbanist font-medium capitalize">
          Teacher profile
        </span>
      </div>

      {/* 2. Teacher Profile Header Summary Card */}
      <TeacherProfileHeader
        headerData={headerData}
        isLoading={isHeaderLoading}
        onEditProfile={handleEditProfile}
        onDeleteAccount={handleDeleteAccount}
        onAssignClass={handleAssignClass}
      />

      {/* 3. Multi-Tab Details Section */}
      <TeacherProfileTabs teacherId={id} />

      {/* 4. Delete Teacher Confirmation Modal */}
      <DeleteTeacherModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        teacherId={id}
        teacherName={headerData?.full_name}
        departmentName={headerData?.department_name}
      />
    </div>
  )
}
