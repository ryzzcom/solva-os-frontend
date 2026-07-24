import React from 'react'
import {
  Users,
  GraduationCap,
  UserCheck,
  Download,
  Printer,
  ShieldCheck,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { StudentPersonalProfileResponse } from '../types/profile'
import { useAuthStore } from '@/store/authStore'

interface StudentPersonalTabProps {
  personalData?: StudentPersonalProfileResponse
  isLoading: boolean
}

export const StudentPersonalTab: React.FC<StudentPersonalTabProps> = ({
  personalData,
  isLoading,
}) => {
  const schoolName = useAuthStore((state) => state.user?.school?.name) || 'Solva OS School'
  const schoolLogo = useAuthStore((state) => state.user?.school?.logo_url)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-[16px] bg-slate-200" />
          <Skeleton className="h-64 w-full rounded-[16px] bg-slate-200" />
        </div>
        <div>
          <Skeleton className="h-96 w-full rounded-[16px] bg-slate-200" />
        </div>
      </div>
    )
  }

  const info = personalData?.personal_information
  const academic = personalData?.academic_enrollment
  const guardian = personalData?.guardian_details

  const handlePrintIDCard = () => {
    window.print()
  }

  const handleDownloadIDCard = () => {
    if (personalData?.id_card_url) {
      window.open(personalData.id_card_url, '_blank')
    } else {
      window.print()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 animate-in fade-in duration-300">
      {/* Left Main Content Column (2 Cols wide on LG) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Card 1: Personal Information */}
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 space-y-6 shadow-xs">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-[#2e67b1]/10 text-[#2e67b1] rounded-lg">
              <Users className="size-5" />
            </div>
            <h2 className="text-xl font-semibold font-urbanist text-[#0f172a]">
              Personal Information
            </h2>
          </div>

          {/* 2-Column Key Value Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 font-sans">
            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Full Name</span>
              <p className="text-base font-semibold text-[#0f172a] font-urbanist">
                {info?.full_name || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Registration ID</span>
              <p className="text-base font-semibold text-[#0f172a]">
                {info?.registration_no || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Gender</span>
              <p className="text-base text-[#334155]">
                {info?.gender || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Date of Birth</span>
              <p className="text-base text-[#334155]">
                {info?.dob || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Blood Group</span>
              <p className="text-base font-bold text-red-500">
                {info?.blood_group || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Phone Number</span>
              <p className="text-base text-[#334155]">
                {info?.phone_number || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Email Address</span>
              <p className="text-base text-[#334155]">
                {info?.email || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">City</span>
              <p className="text-base text-[#334155]">
                {info?.city || 'N/A'}
              </p>
            </div>

            <div className="sm:col-span-2">
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Address</span>
              <p className="text-base text-[#334155]">
                {info?.address || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Academic Enrollment */}
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 space-y-6 shadow-xs">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-[#2e67b1]/10 text-[#2e67b1] rounded-lg">
              <GraduationCap className="size-5" />
            </div>
            <h2 className="text-xl font-semibold font-urbanist text-[#0f172a]">
              Academic Enrollment
            </h2>
          </div>

          {/* 2-Column Key Value Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 font-sans">
            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Academic Year</span>
              <p className="text-base font-semibold text-[#0f172a]">
                {academic?.academic_year || '2023 - 2024'}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Class & Section</span>
              <p className="text-base font-semibold text-[#0f172a]">
                {academic?.class_name} - {academic?.section_name}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Roll Number</span>
              <p className="text-base text-[#334155]">
                {academic?.roll_number || info?.registration_no || 'N/A'}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748b] block mb-0.5 font-medium">Class Teacher</span>
              <p className="text-base text-[#2e67b1] font-medium hover:underline cursor-pointer">
                {academic?.class_teacher || 'Ms. Sarah Jenkins'}
              </p>
            </div>
          </div>

          {/* Assigned Subjects Sub-container */}
          <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
            <span className="text-sm font-semibold font-urbanist text-[#0f172a] block">
              Assigned Subjects
            </span>
            <div className="flex flex-wrap gap-2.5">
              {academic?.assigned_subjects && academic.assigned_subjects.length > 0 ? (
                academic.assigned_subjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-slate-200 text-[#334155] px-4 py-1.5 rounded-full text-sm font-medium font-sans shadow-2xs"
                  >
                    {sub}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-sm italic">No subjects assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Guardian Details */}
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 space-y-6 shadow-xs">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-[#2e67b1]/10 text-[#2e67b1] rounded-lg">
              <UserCheck className="size-5" />
            </div>
            <h2 className="text-xl font-semibold font-urbanist text-[#0f172a]">
              Guardian Details
            </h2>
          </div>

          {/* Guardian Info Capsule Box matching Figma */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4">
            <div className="size-12 rounded-full bg-blue-100 text-[#2e67b1] flex items-center justify-center shrink-0">
              <User className="size-6" />
            </div>
            <div>
              <span className="text-xs text-[#64748b] font-medium block">
                {guardian?.relation || 'Father'}
              </span>
              <p className="text-base font-semibold font-urbanist text-[#0f172a]">
                {guardian?.guardian_name || 'N/A'}
              </p>
              <p className="text-xs text-[#475569] font-sans">
                {guardian?.guardian_phone || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Column: ID Card Preview Card */}
      <div className="space-y-6">
        <div className="bg-white border border-[#d8dee8] rounded-[16px] p-6 space-y-5 shadow-xs sticky top-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold font-urbanist text-[#0f172a]">
              ID Card Preview
            </h2>
            <span className="bg-blue-100 text-[#2e67b1] text-xs font-bold font-sans px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="size-3.5" />
              OFFICIAL
            </span>
          </div>

          {/* ID Card Graphic Box */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
            {/* Header Banner */}
            <div className="bg-[#2e67b1] p-4 text-white text-center flex flex-col items-center justify-center gap-1">
              {schoolLogo ? (
                <img src={schoolLogo} alt={schoolName} className="h-8 object-contain mb-1" />
              ) : (
                <div className="size-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
              )}
              <span className="text-sm font-semibold font-urbanist tracking-wide truncate max-w-full">
                {schoolName}
              </span>
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col items-center text-center space-y-3 bg-slate-50/40">
              <div className="size-20 rounded-full border-2 border-[#2e67b1] overflow-hidden bg-white shadow-xs">
                {personalData?.personal_information.full_name ? (
                  <div className="w-full h-full bg-[#2e67b1] text-white flex items-center justify-center text-2xl font-bold font-urbanist">
                    {personalData.personal_information.full_name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User className="w-full h-full text-slate-400 p-3" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold font-urbanist text-[#0f172a]">
                  {info?.full_name || 'Student Name'}
                </h3>
                <p className="text-xs font-semibold text-amber-600 font-sans mt-0.5">
                  {academic?.class_name} - Sec {academic?.section_name}
                </p>
              </div>

              <div className="w-full pt-2 border-t border-slate-200 text-xs font-sans space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Roll No:</span>
                  <span className="font-semibold text-slate-800">{info?.registration_no || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">DOB:</span>
                  <span className="font-semibold text-slate-800">{info?.dob || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Blood Grp:</span>
                  <span className="font-bold text-red-500">{info?.blood_group || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons below ID Card */}
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              variant="primary"
              onClick={handleDownloadIDCard}
              className="w-full bg-[#2e67b1] hover:bg-[#255694] h-11"
              leftIcon={<Download className="size-4" />}
            >
              Download ID Card
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handlePrintIDCard}
              className="w-full border-slate-300 text-[#0f172a] hover:bg-slate-50 h-11 font-urbanist"
              leftIcon={<Printer className="size-4 text-slate-500" />}
            >
              Print ID Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
