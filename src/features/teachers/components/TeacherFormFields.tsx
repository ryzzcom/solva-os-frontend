import React from 'react'
import { CustomSelect } from '@/components/ui/select-dropdown'
import type { SelectOption } from '@/components/ui/select-dropdown'

interface TeacherFormFieldsProps {
  fullName: string
  setFullName: (val: string) => void
  email: string
  setEmail: (val: string) => void
  cnicNumber: string
  setCnicNumber: (val: string) => void
  phone: string
  setPhone: (val: string) => void
  dob: string
  setDob: (val: string) => void
  gender: 'Male' | 'Female' | 'Other' | ''
  setGender: (val: 'Male' | 'Female' | 'Other' | '') => void
  teacherIdPrefix?: string
  teacherIdNumber: string
  setTeacherIdNumber: (val: string) => void
  department: string
  setDepartment: (val: string) => void
  designation: string
  setDesignation: (val: string) => void
  joiningDate: string
  setJoiningDate: (val: string) => void
  salary: string
  setSalary: (val: string) => void
  grade: string
  onClassChange: (val: string) => void
  classOptions: SelectOption[]
  section: string
  onSectionChange: (val: string) => void
  sectionOptions: SelectOption[]
}

const DEPARTMENT_OPTIONS: SelectOption[] = [
  { label: 'Mathematics & Physics', value: 'Mathematics & Physics' },
  { label: 'Science & Chemistry', value: 'Science & Chemistry' },
  { label: 'Humanities & Social Sciences', value: 'Humanities & Social Sciences' },
  { label: 'Languages & Literature', value: 'Languages & Literature' },
  { label: 'Computer Science & IT', value: 'Computer Science & IT' },
  { label: 'Arts & Physical Education', value: 'Arts & Physical Education' },
]

export const TeacherFormFields: React.FC<TeacherFormFieldsProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  cnicNumber,
  setCnicNumber,
  phone,
  setPhone,
  dob,
  setDob,
  gender,
  setGender,
  teacherIdPrefix = 'SOL-',
  teacherIdNumber,
  setTeacherIdNumber,
  department,
  setDepartment,
  designation,
  setDesignation,
  joiningDate,
  setJoiningDate,
  salary,
  setSalary,
  grade,
  onClassChange,
  classOptions,
  section,
  onSectionChange,
  sectionOptions,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Section: Personal Details */}
      <div className="bg-white border border-[#d8dee8] rounded-[16px] shadow-xs relative flex">
        <div className="w-2 bg-[#2e67b1] shrink-0 rounded-l-[16px]" />
        <div className="p-6 md:p-8 flex-1 space-y-6">
          <h2 className="text-xl font-bold font-urbanist text-[#0f172a]">
            Personal Details
          </h2>

          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your Full name"
                className="w-full h-12 bg-white border border-[#e3e7ee] rounded-[10px] px-4 text-base text-[#0f172a] placeholder-[#94a3b8] font-sans focus:outline-none focus:border-[#2e67b1] transition-colors"
              />
            </div>

            {/* DOB & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-12 bg-white border border-[#e3e7ee] rounded-[10px] px-4 text-base text-[#0f172a] font-sans focus:outline-none focus:border-[#2e67b1] transition-colors"
                />
              </div>

              {/* Gender Radio Group */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                  Gender
                </label>
                <div className="flex items-center gap-6 h-12 pt-1">
                  {(['Male', 'Female', 'Other'] as const).map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-2 cursor-pointer select-none group"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={() => setGender(g)}
                        className="size-4 accent-[#2e67b1] cursor-pointer"
                      />
                      <span className="text-sm font-medium font-urbanist text-[#0f172a]">
                        {g}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full h-12 bg-white border border-[#e3e7ee] rounded-[10px] px-4 text-base text-[#0f172a] placeholder-[#94a3b8] font-sans focus:outline-none focus:border-[#2e67b1] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarafat@gmail.com"
                  className="w-full h-12 bg-white border border-[#e3e7ee] rounded-[10px] px-4 text-base text-[#0f172a] placeholder-[#94a3b8] font-sans focus:outline-none focus:border-[#2e67b1] transition-colors"
                />
              </div>
            </div>

            {/* CNIC Number */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                CNIC / National ID Number *
              </label>
              <input
                type="text"
                required
                value={cnicNumber}
                onChange={(e) => setCnicNumber(e.target.value)}
                placeholder="42101-1234567-1"
                className="w-full h-12 bg-white border border-[#e3e7ee] rounded-[10px] px-4 text-base text-[#0f172a] placeholder-[#94a3b8] font-sans focus:outline-none focus:border-[#2e67b1] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Section: School Detail */}
      <div className="bg-white border border-[#d8dee8] rounded-[16px] shadow-xs relative flex">
        <div className="w-2 bg-[#F36F26] shrink-0 rounded-l-[16px]" />
        <div className="p-6 md:p-8 flex-1 space-y-6">
          <h2 className="text-xl font-bold font-urbanist text-[#0f172a]">
            School Detail
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teacher ID */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                Teacher ID (Optional Registration No)
              </label>
              <div className="flex items-center border border-[#e3e7ee] rounded-[10px] overflow-hidden focus-within:border-[#2e67b1] transition-colors">
                <span className="bg-slate-100 border-r border-[#e3e7ee] px-4 py-3 text-base font-semibold font-urbanist text-[#0f172a]">
                  {teacherIdPrefix}
                </span>
                <input
                  type="text"
                  value={teacherIdNumber}
                  onChange={(e) => setTeacherIdNumber(e.target.value)}
                  placeholder="1058-45 (Auto-generated if blank)"
                  className="w-full h-12 bg-white px-4 text-base text-[#0f172a] placeholder-[#94a3b8] font-sans focus:outline-none"
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                Department
              </label>
              <CustomSelect
                options={DEPARTMENT_OPTIONS}
                value={department}
                onChange={setDepartment}
                placeholder="Select Department"
                className="w-full h-12"
              />
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Senior Faculty"
                className="w-full h-12 bg-white border border-[#e3e7ee] rounded-[10px] px-4 text-base text-[#0f172a] placeholder-[#94a3b8] font-sans focus:outline-none focus:border-[#2e67b1] transition-colors"
              />
            </div>

            {/* Joining Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                Joining Date
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full h-12 bg-white border border-[#e3e7ee] rounded-[10px] px-4 text-base text-[#0f172a] font-sans focus:outline-none focus:border-[#2e67b1] transition-colors"
              />
            </div>

            {/* Monthly Salary */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                Monthly Salary ($ / PKR)
              </label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="75000"
                className="w-full h-12 bg-white border border-[#e3e7ee] rounded-[10px] px-4 text-base text-[#0f172a] placeholder-[#94a3b8] font-sans focus:outline-none focus:border-[#2e67b1] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section: Class Teacher */}
      <div className="bg-white border border-[#d8dee8] rounded-[16px] shadow-xs relative flex">
        <div className="w-2 bg-[#F36F26] shrink-0 rounded-l-[16px]" />
        <div className="p-6 md:p-8 flex-1 space-y-6">
          <h2 className="text-xl font-bold font-urbanist text-[#0f172a]">
            Class Teacher
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Class */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                Select Class
              </label>
              <CustomSelect
                options={classOptions}
                value={grade}
                onChange={onClassChange}
                placeholder="Select Class"
                className="w-full h-12"
              />
            </div>

            {/* Select Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold font-urbanist text-[#0f172a]">
                Select Section
              </label>
              <CustomSelect
                options={sectionOptions}
                value={section}
                onChange={onSectionChange}
                disabled={!grade || sectionOptions.length === 0}
                placeholder={!grade ? 'Select Class first' : 'Select Section'}
                className="w-full h-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
