import React from 'react'
import { Edit3, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StudentProfileSummaryResponse } from '../types/profile'
import { Skeleton } from '@/components/ui/skeleton'

interface StudentProfileHeaderProps {
  summaryData?: StudentProfileSummaryResponse
  isLoading: boolean
  onEditProfile?: () => void
  onDeleteStudent?: () => void
}

export const StudentProfileHeader: React.FC<StudentProfileHeaderProps> = ({
  summaryData,
  isLoading,
  onEditProfile,
  onDeleteStudent,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[#f0f5fb] border border-[#dce6f2] rounded-[16px] p-6 space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-[100px] rounded-[14px] bg-slate-300" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 bg-slate-300 rounded" />
              <Skeleton className="h-4 w-36 bg-slate-300 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-28 bg-slate-300 rounded-lg" />
            <Skeleton className="h-10 w-32 bg-slate-300 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl bg-slate-300" />
          ))}
        </div>
      </div>
    )
  }

  const header = summaryData?.header
  const kpis = summaryData?.kpis

  return (
    <div className="bg-[#eaf1fb] border border-[#d0e0f5] rounded-[16px] p-6 space-y-6">
      {/* Top Main Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Avatar & Info */}
        <div className="flex items-center gap-5">
          <div className="relative size-[100px] md:size-[110px] rounded-[16px] bg-[#2e67b1] overflow-hidden shrink-0 border-2 border-white shadow-sm flex items-center justify-center">
            {header?.profile_picture_url ? (
              <img
                src={header.profile_picture_url}
                alt={header.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1e4880] flex items-center justify-center text-white">
                <User className="size-12 opacity-80" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold font-urbanist text-[#0f172a]">
              {header?.full_name || 'Student Name'}
            </h1>
            <p className="text-sm md:text-base font-sans text-[#475569]">
              ID: <span className="font-semibold text-[#0f172a]">{header?.registration_no || 'N/A'}</span>
              <span className="mx-2 text-slate-300">|</span>
              Class <span className="font-semibold text-[#0f172a]">{header?.class_name}-{header?.section_name}</span>
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onEditProfile}
            leftIcon={<Edit3 className="size-4 text-[#2e67b1]" />}
            className="bg-white text-[#2e67b1] border-[#2e67b1]/30 hover:bg-[#2e67b1]/5 font-urbanist"
          >
            Edit Profile
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onDeleteStudent}
            leftIcon={<Trash2 className="size-4 text-red-600" />}
            className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-urbanist"
          >
            Delete Student
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards Grid matching Figma 91:2071 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
        {/* KPI 1: Attendance */}
        <div className="bg-white border border-slate-100 rounded-[12px] p-4 space-y-1 shadow-xs">
          <span className="text-xs md:text-sm text-[#64748b] font-sans font-medium">
            Attendance
          </span>
          <p className="text-xl md:text-2xl font-bold font-urbanist text-[#2e67b1]">
            {kpis?.attendance_percentage != null ? `${kpis.attendance_percentage}%` : '0%'}
          </p>
        </div>

        {/* KPI 2: Academic Rank */}
        <div className="bg-white border border-slate-100 rounded-[12px] p-4 space-y-1 shadow-xs">
          <span className="text-xs md:text-sm text-[#64748b] font-sans font-medium">
            Academic Rank
          </span>
          <p className="text-xl md:text-2xl font-bold font-urbanist text-[#0f172a]">
            {kpis?.academic_rank || 'N/A'}
          </p>
        </div>

        {/* KPI 3: Pending Fees */}
        <div className="bg-white border border-slate-100 rounded-[12px] p-4 space-y-1 shadow-xs">
          <span className="text-xs md:text-sm text-[#64748b] font-sans font-medium">
            Pending Fees
          </span>
          <p className="text-xl md:text-2xl font-bold font-urbanist text-emerald-600">
            ${kpis?.pending_fees != null ? kpis.pending_fees : 0}
          </p>
        </div>

        {/* KPI 4: Pending Work */}
        <div className="bg-white border border-slate-100 rounded-[12px] p-4 space-y-1 shadow-xs">
          <span className="text-xs md:text-sm text-[#64748b] font-sans font-medium">
            Pending Work
          </span>
          <p className="text-xl md:text-2xl font-bold font-urbanist text-[#0f172a]">
            {kpis?.pending_homework != null ? kpis.pending_homework : 0}
          </p>
        </div>
      </div>
    </div>
  )
}
