import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { useStudentSummary, useStudentPersonalProfile } from '../api/useStudentProfile'
import { StudentProfileHeader } from '../components/StudentProfileHeader'
import { StudentProfileTabs, type ProfileTabType } from '../components/StudentProfileTabs'
import { StudentPersonalTab } from '../components/StudentPersonalTab'
import { StudentAttendanceTab } from '../components/StudentAttendanceTab'
import { StudentResultsTab } from '../components/StudentExamsTab'
import { StudentHomeworkTab } from '../components/StudentHomeworkTab'
import { DeleteStudentModal } from '../components/DeleteStudentModal'
import { Clock } from 'lucide-react'

export default function StudentProfilePage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ProfileTabType>('Profile')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // API Hooks
  const { data: summaryData, isLoading: isSummaryLoading } = useStudentSummary(id)
  const { data: personalData, isLoading: isPersonalLoading } = useStudentPersonalProfile(id)

  return (
    <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Breadcrumb Header Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-base flex-wrap font-sans">
          <span
            onClick={() => navigate('/dashboard')}
            className="text-[#475569] hover:underline cursor-pointer"
          >
            Principal Dashboard.
          </span>
          <ChevronRight className="size-4 text-[#475569]" />
          <span
            onClick={() => navigate('/students')}
            className="text-[#475569] hover:underline cursor-pointer"
          >
            Students
          </span>
          <ChevronRight className="size-4 text-[#475569]" />
          <span className="text-[#0f172a] font-medium font-urbanist capitalize">
            Profile Student
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/students')}
          className="inline-flex items-center gap-2 text-sm font-medium font-urbanist text-[#2e67b1] hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back to Directory
        </button>
      </div>

      {/* 2. Header Banner with 4 KPI Stat Cards */}
      <StudentProfileHeader
        summaryData={summaryData}
        isLoading={isSummaryLoading}
        onEditProfile={() => navigate(`/students/edit/${id}`)}
        onDeleteStudent={() => setIsDeleteModalOpen(true)}
      />

      {/* 3. Navigation Tabs */}
      <StudentProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 4. Active Tab Content View */}
      {activeTab === 'Profile' && (
        <StudentPersonalTab
          personalData={personalData}
          isLoading={isPersonalLoading}
        />
      )}

      {activeTab === 'Attendance' && (
        <StudentAttendanceTab studentId={id} />
      )}

      {activeTab === 'Results' && (
        <StudentResultsTab studentId={id} />
      )}

      {activeTab === 'Homework' && (
        <StudentHomeworkTab studentId={id} />
      )}

      {activeTab === 'Fees' && (
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-12 text-center space-y-4 shadow-xs animate-in fade-in duration-200">
          <div className="size-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Clock className="size-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider font-urbanist mb-1">
              Coming Soon
            </div>
            <h3 className="text-xl font-bold font-urbanist text-[#0f172a]">
              Student Fees Management Module
            </h3>
            <p className="text-sm font-sans text-slate-500">
              The fee ledger, transaction receipts, and payment history modules are currently under active development.
            </p>
          </div>
        </div>
      )}

      {activeTab !== 'Profile' &&
        activeTab !== 'Attendance' &&
        activeTab !== 'Results' &&
        activeTab !== 'Homework' &&
        activeTab !== 'Fees' && (
          <div className="bg-white border border-[#d8dee8] rounded-[16px] p-12 text-center space-y-3 shadow-xs animate-in fade-in duration-200">
            <h3 className="text-xl font-semibold font-urbanist text-[#0f172a]">
              {activeTab} Records
            </h3>
            <p className="text-sm font-sans text-slate-500 max-w-md mx-auto">
              Detailed {(activeTab as string).toLowerCase()} records for this student will be displayed here once connected.
            </p>
          </div>
        )}

      {/* 5. Delete Student Confirmation Modal */}
      <DeleteStudentModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        studentId={id}
        studentName={summaryData?.header?.full_name}
        className={summaryData?.header?.class_name}
        sectionName={summaryData?.header?.section_name}
      />
    </div>
  )
}
