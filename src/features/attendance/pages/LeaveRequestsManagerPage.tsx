import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  AlertTriangle,
  Check,
  X,
  Loader2,
  AlertCircle,
  FileCheck2,
} from 'lucide-react'
import { HasRole } from '@/components/auth/HasRole'
import { useLeaveRequestsList, useUpdateLeaveStatus } from '../api/useLeaveRequests'
import type { LeaveRequestItem } from '../types/attendance.types'

export const LeaveRequestsManagerPage: React.FC = () => {
  const navigate = useNavigate()

  // Status Filter Tab state (default to PENDING)
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING')

  const {
    data: leavesList = [],
    isLoading,
    isError,
    refetch,
  } = useLeaveRequestsList(activeTab)

  const updateStatusMutation = useUpdateLeaveStatus()

  const handleUpdateStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    updateStatusMutation.mutate({ id, status })
  }

  // Render status badge pill
  const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase()
    if (s === 'APPROVED') {
      return (
        <span className="px-3.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold font-sans uppercase">
          APPROVED
        </span>
      )
    }
    if (s === 'REJECTED') {
      return (
        <span className="px-3.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold font-sans uppercase">
          REJECTED
        </span>
      )
    }
    return (
      <span className="px-3.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold font-sans capitalize">
        Pending
      </span>
    )
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Breadcrumb & Title */}
      <div className="space-y-4">
        {/* Breadcrumb Row */}
        <div className="flex items-center gap-2 text-xs md:text-sm font-sans text-slate-500">
          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="hover:text-brand-primary transition-colors cursor-pointer"
          >
            Principal Dashboard.
          </button>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-semibold text-navy-main font-urbanist">
            Leave Requests
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-navy-main flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/attendance')}
                className="p-1.5 rounded-xl border border-card-border hover:bg-slate-100 text-slate-600 transition-colors"
                title="Back to Attendance Overview"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span>Leave Requests Manager</span>
            </h1>
          </div>
        </div>
      </div>

      {/* 2. Status Filter Tabs Toolbar */}
      <div className="flex items-center gap-2 border-b border-card-border pb-1 overflow-x-auto">
        {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => {
          const isActive = activeTab === tab
          const label = tab === 'PENDING' ? 'Pending' : tab === 'APPROVED' ? 'Approved' : tab === 'REJECTED' ? 'Rejected' : 'All Requests'

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-bold font-urbanist rounded-xl transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* 3. Leave Requests Card Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="size-8 text-brand-primary animate-spin" />
          <span>Loading leave requests...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-rose-700 font-sans space-y-3 bg-white border border-card-border rounded-2xl">
          <AlertCircle className="size-8 text-rose-600 mx-auto" />
          <p className="font-semibold text-sm">Failed to load leave requests.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : leavesList.length === 0 ? (
        <div className="p-12 bg-white border border-card-border rounded-2xl text-center text-slate-500 font-sans text-sm space-y-2">
          <FileCheck2 className="size-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No {activeTab.toLowerCase()} leave requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {leavesList.map((item: LeaveRequestItem) => {
            const isStudent = item.user_type === 'STUDENT'
            const roleBadgeClass = isStudent
              ? 'bg-blue-100 text-blue-700'
              : 'bg-indigo-100 text-indigo-700'

            const formattedDateRange =
              item.start_date === item.end_date
                ? item.start_date
                : `${item.start_date} to ${item.end_date}`

            const isPending = item.status?.toUpperCase() === 'PENDING'

            return (
              <div
                key={item.id}
                className="bg-white border border-card-border rounded-2xl p-6 shadow-xs space-y-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Card Top Row: Role Pill & Status Pill */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-bold font-urbanist ${roleBadgeClass}`}>
                      {isStudent ? 'Student' : 'Teacher'}
                    </span>

                    {renderStatusBadge(item.status)}
                  </div>

                  {/* Applicant Info */}
                  <div className="space-y-0.5 pt-1">
                    <h3 className="text-xl font-bold font-urbanist text-navy-main">
                      {item.name || 'Anonymous User'}
                    </h3>
                    <p className="text-xs font-sans text-slate-500">
                      ID: #{item.ref_id || item.id.substring(0, 8)}
                    </p>
                  </div>

                  {/* Metadata Grid (Leave Date & Reason Type) */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] font-sans text-slate-500 block">
                        Leave Date
                      </span>
                      <div className="flex items-center gap-2 text-xs font-semibold font-urbanist text-navy-main">
                        <Calendar className="size-4 text-brand-primary shrink-0" />
                        <span className="truncate">{formattedDateRange}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 space-y-1">
                      <span className="text-[11px] font-sans text-slate-500 block">
                        Reason Type
                      </span>
                      <div className="flex items-center gap-2 text-xs font-semibold font-urbanist text-navy-main">
                        <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                        <span className="truncate">{item.reason_type || 'Personal'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-sans text-slate-500 block">
                      Description
                    </span>
                    <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl text-xs font-sans text-slate-700 italic leading-relaxed">
                      "{item.description || 'No detailed reason provided.'}"
                    </div>
                  </div>
                </div>

                {/* Card Action Row (For PENDING status) */}
                {isPending && (
                  <HasRole allowedRoles={['SUPER_ADMIN', 'PRINCIPAL']}>
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleUpdateStatus(item.id, 'APPROVED')}
                        className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-urbanist font-medium text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4 stroke-[2.5]" />
                        )}
                        <span>APPROVE</span>
                      </button>

                      <button
                        type="button"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                        className="flex-1 py-2.5 bg-white border border-brand-primary text-brand-primary hover:bg-brand-soft rounded-xl font-urbanist font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <X className="size-4 stroke-[2.5]" />
                        )}
                        <span>Reject</span>
                      </button>
                    </div>
                  </HasRole>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LeaveRequestsManagerPage
