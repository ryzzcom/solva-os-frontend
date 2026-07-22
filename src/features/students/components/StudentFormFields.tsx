import React from 'react'
import { CustomSelect } from '@/components/ui/select-dropdown'
import type { SelectOption } from '@/components/ui/select-dropdown'

const GENDER_OPTIONS: SelectOption[] = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
]

const BLOOD_GROUP_OPTIONS: SelectOption[] = [
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
]

interface StudentFormFieldsProps {
  fullName: string
  setFullName: (val: string) => void
  rollNo: string
  setRollNo: (val: string) => void
  grade: string
  onClassChange: (val: string) => void
  classOptions: SelectOption[]
  section: string
  onSectionChange: (val: string) => void
  sectionOptions: SelectOption[]
  dob: string
  setDob: (val: string) => void
  gender: string
  setGender: (val: any) => void
  fatherName: string
  setFatherName: (val: string) => void
  fatherPhone: string
  setFatherPhone: (val: string) => void
  bloodGroup: string
  setBloodGroup: (val: string) => void
  city: string
  setCity: (val: string) => void
}

export const StudentFormFields: React.FC<StudentFormFieldsProps> = ({
  fullName,
  setFullName,
  rollNo,
  setRollNo,
  grade,
  onClassChange,
  classOptions,
  section,
  onSectionChange,
  sectionOptions,
  dob,
  setDob,
  gender,
  setGender,
  fatherName,
  setFatherName,
  fatherPhone,
  setFatherPhone,
  bloodGroup,
  setBloodGroup,
  city,
  setCity,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Full Name */}
      <div className="space-y-2">
        <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
          Full Name *
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your Full name"
          className="w-full h-[52px] bg-white border border-[#e3e7ee] rounded-[10px] px-6 text-[#0f172a] placeholder-[#94a3b8] font-sans text-base focus:outline-none focus:border-[#2e67b1] transition-colors"
        />
      </div>

      {/* Roll No */}
      <div className="space-y-2">
        <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
          Roll No *
        </label>
        <input
          type="text"
          required
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="Enter your Roll no"
          className="w-full h-[52px] bg-white border border-[#e3e7ee] rounded-[10px] px-6 text-[#0f172a] placeholder-[#94a3b8] font-sans text-base focus:outline-none focus:border-[#2e67b1] transition-colors"
        />
      </div>

      {/* Class / Grade */}
      <div className="space-y-2">
        <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
          Class *
        </label>
        <CustomSelect
          options={classOptions}
          value={grade}
          onChange={onClassChange}
          placeholder="Select Class"
          className="w-full"
        />
      </div>

      {/* Section (Disabled until Class is selected) */}
      <div className="space-y-2">
        <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
          Section *
        </label>
        <CustomSelect
          options={sectionOptions}
          value={section}
          onChange={onSectionChange}
          disabled={!grade}
          placeholder={grade ? 'Select Section' : 'Select Class First'}
          className="w-full"
        />
      </div>

      {/* Date Of Birth */}
      <div className="space-y-2">
        <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
          Date Of Birth *
        </label>
        <input
          type="date"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full h-[52px] bg-white border border-[#e3e7ee] rounded-[10px] px-6 text-[#0f172a] font-sans text-base focus:outline-none focus:border-[#2e67b1] transition-colors cursor-pointer"
        />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
          Gender *
        </label>
        <CustomSelect
          options={GENDER_OPTIONS}
          value={gender}
          onChange={(val) => setGender(val as 'Male' | 'Female' | 'Other')}
          placeholder="Select Gender"
          className="w-full"
        />
      </div>

      {/* Father Name */}
      <div className="space-y-2">
        <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
          Father Name *
        </label>
        <input
          type="text"
          required
          value={fatherName}
          onChange={(e) => setFatherName(e.target.value)}
          placeholder="Enter Parent Name"
          className="w-full h-[52px] bg-white border border-[#e3e7ee] rounded-[10px] px-6 text-[#0f172a] placeholder-[#94a3b8] font-sans text-base focus:outline-none focus:border-[#2e67b1] transition-colors"
        />
      </div>

      {/* Father Phone */}
      <div className="space-y-2">
        <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
          Father Phone *
        </label>
        <input
          type="tel"
          required
          value={fatherPhone}
          onChange={(e) => setFatherPhone(e.target.value)}
          placeholder="+92 3001234567"
          className="w-full h-[52px] bg-white border border-[#e3e7ee] rounded-[10px] px-6 text-[#0f172a] placeholder-[#94a3b8] font-sans text-base focus:outline-none focus:border-[#2e67b1] transition-colors"
        />
      </div>

      {/* Blood Group */}
      <div className="space-y-2">
        <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
          Blood Group
        </label>
        <CustomSelect
          options={BLOOD_GROUP_OPTIONS}
          value={bloodGroup}
          onChange={setBloodGroup}
          placeholder="Select Blood Group"
          className="w-full"
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <label className="block text-[18px] font-medium font-urbanist text-[#0f172a]">
          City
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
          className="w-full h-[52px] bg-white border border-[#e3e7ee] rounded-[10px] px-6 text-[#0f172a] placeholder-[#94a3b8] font-sans text-base focus:outline-none focus:border-[#2e67b1] transition-colors"
        />
      </div>
    </div>
  )
}
