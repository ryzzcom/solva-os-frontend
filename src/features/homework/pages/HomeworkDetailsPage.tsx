import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  UserCheck,
} from 'lucide-react'
import { useHomeworkDetails } from '../api/useHomeworkDetails'
import type { HomeworkSubmissionStatus, HomeworkDetailsStudentSubmission } from '../types/homework.types'

export const HomeworkDetailsPage: React.FC = () => {
  const { homeworkId } = useParams<{ homeworkId: string }>()
  const navigate = useNavigate()

  // Filter tab state ('ALL', 'SUBMITTED', 'PENDING')
  const [activeTab, setActiveTab] = useState<'ALL' | 'SUBMITTED' | 'PENDING'>('ALL')

  const {
    data: detailsData,
    isLoading,
    isError,
    refetch,
  } = useHomeworkDetails(homeworkId, activeTab)

  const homeworkTitle = detailsData?.title || 'Assignment Details'
  const subject = detailsData?.subject || 'General'
  const description = detailsData?.description || 'No detailed instructions provided.'
  const teacherName = detailsData?.teacher_name || 'Faculty Member'
  const dueDate = detailsData?.due_date || 'N/A'
  const classSection = detailsData?.class_section || 'Class Roster'

  const progressStats = detailsData?.progress_stats || {
    total_students: 40,
    submitted: 32,
    pending: 8,
    completion_rate: 80.0,
  }

  const submissionsList = detailsData?.student_submissions || []

  // Render status badge pill
  const renderStatusBadge = (status: HomeworkSubmissionStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="px-3.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold font-sans">
            Submitted
          </span>
        )
      case 'LATE':
        return (
          <span className="px-3.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold font-sans">
            Late
          </span>
        )
      case 'PENDING':
      default:
        return (
          <span className="px-3.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold font-sans">
            Pending
          </span>
        )
    }
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Breadcrumb Navigation */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs md:text-sm font-sans text-slate-500">
          <button
            type="button"
            onClick={() => navigate('/homework')}
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            Principal Dashboard.
          </button>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-semibold text-navy-main font-urbanist">
            Homework Details
          </span>
        </div>
      </div>

      {/* 2. Hero Assignment Card */}
      <div className="bg-white border-l-4 border-l-brand-primary border border-card-border rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold font-urbanist">
            {subject}
          </span>

          <button
            type="button"
            onClick={() => navigate('/homework')}
            className="flex items-center gap-1 text-xs font-semibold font-urbanist text-slate-600 hover:text-brand-primary transition-colors"
          >
            <ChevronLeft className="size-4" />
            <span>Back to Homework</span>
          </button>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-navy-main leading-tight">
            {homeworkTitle}
          </h1>
          <p className="text-sm font-sans text-slate-600 leading-relaxed max-w-4xl">
            {description}
          </p>
        </div>

        {/* Metadata Row (3 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-100 pt-6">
          <div className="space-y-1">
            <span className="text-xs font-sans text-slate-500 block">Teacher</span>
            <p className="text-sm font-bold font-urbanist text-navy-main">{teacherName}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-sans text-slate-500 block">Due Date</span>
            <p className="text-sm font-bold font-urbanist text-navy-main">{dueDate}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-sans text-slate-500 block">Class & Sec</span>
            <p className="text-sm font-bold font-urbanist text-navy-main">{classSection}</p>
          </div>
        </div>
      </div>

      {/* 3. Top Bento Grid Progress Stats Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Students */}
        <div className="bg-white border-l-4 border-l-brand-primary border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Total Students
          </span>
          <p className="text-3xl font-bold font-urbanist text-brand-primary mt-2">
            {isLoading ? '...' : progressStats.total_students}
          </p>
        </div>

        {/* Card 2: Submitted */}
        <div className="bg-white border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Submitted
          </span>
          <p className="text-3xl font-bold font-urbanist text-navy-main mt-2">
            {isLoading ? '...' : progressStats.submitted}
          </p>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Pending
          </span>
          <p className="text-3xl font-bold font-urbanist text-navy-main mt-2">
            {isLoading ? '...' : progressStats.pending}
          </p>
        </div>

        {/* Card 4: Completion Rate */}
        <div className="bg-white border-l-4 border-l-accent-orange border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Completion Rate
          </span>
          <p className="text-3xl font-bold font-urbanist text-accent-orange mt-2">
            {isLoading ? '...' : `${progressStats.completion_rate}%`}
          </p>
        </div>
      </div>

      {/* 4. Student Submissions Roster Section */}
      <div className="space-y-6">
        {/* Filter Toolbar Header */}
        <div className="bg-white border border-card-border rounded-2xl p-5 md:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold font-urbanist text-navy-main">
            Student Submissions
          </h2>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {(['ALL', 'SUBMITTED', 'PENDING'] as const).map((tab) => {
              const isActive = activeTab === tab
              const label = tab === 'ALL' ? 'All' : tab === 'SUBMITTED' ? 'Submitted' : 'Pending'

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold font-urbanist rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-navy-main shadow-xs'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Submissions Roster Table Container */}
        <div className="bg-white border border-card-border rounded-2xl shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-3">
              <Loader2 className="size-8 text-brand-primary animate-spin" />
              <span>Loading student submissions...</span>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-rose-700 font-sans space-y-3">
              <AlertCircle className="size-8 text-rose-600 mx-auto" />
              <p className="font-semibold text-sm">Failed to load submission roster.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : submissionsList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-sans text-sm space-y-2">
              <UserCheck className="size-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No student submissions found for this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-card-border bg-slate-50/70 text-xs font-bold font-urbanist text-slate-600 uppercase tracking-wider">
                    <th className="py-4 px-6">Student Info</th>
                    <th className="py-4 px-6">Turned In</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Grade</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissionsList.map((item: HomeworkDetailsStudentSubmission) => {
                    const initials = item.name
                      ? item.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()
                      : 'ST'

                    return (
                      <tr
                        key={item.student_id}
                        onClick={() => navigate(`/students/${item.student_id}`)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        {/* 1. Student Info Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-brand-soft text-brand-primary font-bold text-sm flex items-center justify-center font-urbanist shrink-0">
                              {initials}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <p className="font-bold text-sm font-urbanist text-navy-main group-hover:text-brand-primary transition-colors truncate">
                                {item.name}
                              </p>
                              <p className="text-xs font-sans text-slate-500 truncate">
                                ID: #{item.registration_id || item.student_id.substring(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 2. Turned In Column */}
                        <td className="py-4 px-6">
                          <span className="text-xs font-medium font-sans text-slate-600">
                            {item.submitted_at || '-'}
                          </span>
                        </td>

                        {/* 3. Status Column */}
                        <td className="py-4 px-6">
                          {renderStatusBadge(item.status)}
                        </td>

                        {/* 4. Grade Column */}
                        <td className="py-4 px-6">
                          <span className="text-sm font-bold font-urbanist text-slate-800">
                            {item.grade || '-'}
                          </span>
                        </td>

                        {/* 5. Action Column */}
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/students/${item.student_id}`)
                            }}
                            className="p-2 rounded-xl text-slate-400 group-hover:text-brand-primary group-hover:bg-brand-soft transition-all"
                            title="View Student Profile"
                          >
                            <ChevronRight className="size-5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeworkDetailsPage
