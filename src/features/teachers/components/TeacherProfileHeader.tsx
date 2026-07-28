import React from 'react'
import { Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react'
import type { TeacherHeaderData } from '../api/useTeacherProfile'

interface TeacherProfileHeaderProps {
  headerData?: TeacherHeaderData
  isLoading?: boolean
  onEditProfile?: () => void
  onDeleteAccount?: () => void
  onAssignClass?: () => void
}

export const TeacherProfileHeader: React.FC<TeacherProfileHeaderProps> = ({
  headerData,
  isLoading,
  onEditProfile,
  onDeleteAccount,
  onAssignClass,
}) => {
  if (isLoading || !headerData) {
    return (
      <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 animate-pulse space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex gap-6 items-start">
            <div className="w-[192px] h-[240px] bg-slate-200 rounded-[8px] shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-6 w-32 bg-slate-200 rounded-md" />
              <div className="h-8 w-64 bg-slate-200 rounded-md" />
              <div className="h-4 w-96 bg-slate-200 rounded-md" />
            </div>
          </div>
          <div className="h-44 w-full md:w-72 bg-slate-100 rounded-xl" />
        </div>
      </div>
    )
  }

  const initials = headerData.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-8">
      {/* 1. Profile Banner Header Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
        {/* Left Profile Details Group */}
        <div className="flex flex-col sm:flex-row gap-8 items-start flex-1">
          {/* Avatar Container with Backdrop and Floating Badge */}
          <div className="relative shrink-0 pt-4 pl-4">
            {/* Background Accent Decorative Circle */}
            <div className="absolute top-0 left-0 size-24 bg-[#e6effa] rounded-[24px] -z-0" />

            {/* Profile Image Frame */}
            <div className="relative z-10 w-[192px] h-[240px] rounded-[8px] bg-gradient-to-br from-[#2e67b1] to-[#1e3a8a] text-white flex items-center justify-center font-bold text-4xl font-urbanist shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden">
              {headerData.profile_picture ? (
                <img
                  src={headerData.profile_picture}
                  alt={headerData.full_name}
                  className="size-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            {/* Floating Role Badge */}
            <div className="absolute z-20 bottom-4 -right-4 bg-[#2e67b1] text-[#dbe6ff] text-base font-urbanist font-medium px-4 py-2 rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] uppercase whitespace-nowrap">
              SENIOR FACULTY
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-2 pt-4 flex-1">
            {/* Dept Badge + ID Tag */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-[#e7e8ee] text-[#1e293b] rounded-[8px] text-sm font-sans font-normal">
                {headerData.department_name || 'Humanities Dept'}
              </span>
              <div className="flex items-center gap-1.5 text-sm text-[#334155] font-sans">
                <CheckCircle2 className="size-3.5 text-[#2e67b1]" />
                <span>ID: {headerData.employee_id || 'N/A'}</span>
              </div>
            </div>

            {/* Teacher Name Heading */}
            <h1 className="text-2xl md:text-[32px] font-semibold text-[#0f172a] font-urbanist leading-[40px]">
              {headerData.full_name}
            </h1>

            {/* Summary Text */}
            <p className="text-[#334155] text-base font-sans leading-[24px] max-w-[576px] pt-1">
              {headerData.summary}
            </p>
          </div>
        </div>

        {/* Right Administrative Actions Sidebar */}
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 shadow-xs flex flex-col gap-3 w-full lg:w-72 shrink-0">
          <h3 className="text-xl font-semibold text-[#0f172a] font-urbanist pb-1">
            Administrative Actions
          </h3>

          <button
            type="button"
            onClick={onAssignClass}
            className="w-full h-[52px] bg-[#2e67b1] hover:bg-[#2e67b1]/95 text-white text-[18px] font-medium font-urbanist rounded-[8px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="size-5" />
            <span>Assign New Class</span>
          </button>

          <button
            type="button"
            onClick={onEditProfile}
            className="w-full h-[52px] border border-[#2e67b1] text-[#2e67b1] hover:bg-blue-50/70 text-[18px] font-medium font-urbanist rounded-[8px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Edit3 className="size-5" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={onDeleteAccount}
            className="w-full h-[52px] text-[#dc2626] hover:bg-rose-50/70 text-[18px] font-medium font-urbanist rounded-[8px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="size-5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Info KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Class Teacher */}
        <div className="bg-[#f3f3fa] border border-[#d8dee8] rounded-[8px] p-4 flex flex-col gap-1">
          <span className="text-[#1e293b] text-base font-sans font-normal">Class Teacher :</span>
          <p className="text-[18px] font-medium text-[#1e293b] font-urbanist capitalize truncate">
            {headerData.kpi_class_leader || 'N/A'}
          </p>
        </div>

        {/* Card 2: Email Address */}
        <div className="bg-[#f3f3fa] border border-[#d8dee8] rounded-[8px] p-4 flex flex-col gap-1">
          <span className="text-[#334155] text-base font-sans font-normal">Email Address</span>
          <p className="text-[18px] font-medium text-[#1e293b] font-urbanist truncate" title={headerData.email}>
            {headerData.email || 'N/A'}
          </p>
        </div>

        {/* Card 3: Phone Number */}
        <div className="bg-[#f3f3fa] border border-[#d8dee8] rounded-[8px] p-4 flex flex-col gap-1">
          <span className="text-[#334155] text-base font-sans font-normal">Phone Number</span>
          <p className="text-[18px] font-medium text-[#1e293b] font-urbanist truncate">
            {headerData.phone_number || 'N/A'}
          </p>
        </div>

        {/* Card 4: Avg Student Rating */}
        <div className="bg-[#f3f3fa] border border-[#d8dee8] rounded-[8px] p-4 flex flex-col gap-1">
          <span className="text-[#334155] text-base font-sans font-normal">Avg. Student Rating</span>
          <p className="text-[18px] font-medium text-[#1e293b] font-urbanist truncate">
            {headerData.kpi_avg_student_attendance || '98.4%'}
          </p>
        </div>
      </div>
    </div>
  )
}
