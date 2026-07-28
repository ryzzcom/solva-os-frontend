import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronRight, AlertCircle, ArrowLeft, Loader2, Check, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useClassesOverview, useClassSections } from '@/features/classes/api/useClasses'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { useTeacherProfileHeader, useTeacherProfileTab } from '../api/useTeacherProfile'
import { useUpdateTeacher } from '../api/useUpdateTeacher'
import type { UpdateTeacherPayload } from '../api/useUpdateTeacher'
import { TeacherFormFields } from '../components/TeacherFormFields'

export default function EditTeacherPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch current teacher data
  const { data: headerData, isLoading: isHeaderLoading } = useTeacherProfileHeader(id)
  const { data: profileTabData, isLoading: isTabLoading } = useTeacherProfileTab(id)

  const updateTeacherMutation = useUpdateTeacher(id)

  // Dynamic Class Options
  const { data: realClassesList = [] } = useClassesOverview()
  const classOptions: SelectOption[] = realClassesList.map((cls) => ({
    label: cls.name || cls.class_name || 'Class',
    value: cls.id,
  }))

  // Form States
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [cnicNumber, setCnicNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('')
  const [teacherIdNumber, setTeacherIdNumber] = useState('')
  const [department, setDepartment] = useState('')
  const [designation, setDesignation] = useState('')
  const [joiningDate, setJoiningDate] = useState('')
  const [salary, setSalary] = useState('')

  const [grade, setGrade] = useState('')
  const [section, setSection] = useState('')

  // Fetch sections for chosen class
  const { data: realSectionsList = [] } = useClassSections(grade)
  const sectionOptions: SelectOption[] = realSectionsList.map((sec) => ({
    label: `Section ${sec.section_name || sec.name}`,
    value: sec.section_id || sec.id || '',
  }))

  // Notice States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pre-fill form when backend data is loaded
  useEffect(() => {
    if (headerData) {
      setFullName(headerData.full_name || '')
      setEmail(headerData.email || '')
      setDepartment(headerData.department_name || '')
      setTeacherIdNumber(headerData.employee_id || '')
      if (headerData.phone_number) setPhone(headerData.phone_number)
    }

    if (profileTabData?.personal_info) {
      const info = profileTabData.personal_info
      if (info.cnic_number) setCnicNumber(info.cnic_number)
      if (info.dob) {
        // Format YYYY-MM-DD for date input
        const parsedDob = new Date(info.dob)
        if (!isNaN(parsedDob.getTime())) {
          setDob(parsedDob.toISOString().split('T')[0])
        }
      }
      if (info.gender) {
        const val = info.gender.charAt(0).toUpperCase() + info.gender.slice(1).toLowerCase()
        if (['Male', 'Female', 'Other'].includes(val)) {
          setGender(val as any)
        }
      }
      if (info.joining_date) {
        const parsedJoining = new Date(info.joining_date)
        if (!isNaN(parsedJoining.getTime())) {
          setJoiningDate(parsedJoining.toISOString().split('T')[0])
        }
      }
      if (info.salary) {
        const cleanSalary = String(info.salary).replace(/[^0-9.]/g, '')
        setSalary(cleanSalary)
      }
    }
  }, [headerData, profileTabData])

  const handleClassChange = (selectedGradeId: string) => {
    setGrade(selectedGradeId)
    setSection('')
  }

  const handleSectionChange = (selectedSecId: string) => {
    setSection(selectedSecId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.')
      setIsSubmitting(false)
      return
    }

    if (!email.trim()) {
      setErrorMessage('Email address is required.')
      setIsSubmitting(false)
      return
    }

    const payload: UpdateTeacherPayload = {
      full_name: fullName.trim(),
      email: email.trim(),
      cnic_number: cnicNumber.trim() || undefined,
      phone_number: phone.trim() || undefined,
      dob: dob ? new Date(dob).toISOString() : undefined,
      gender: gender || undefined,
      department_name: department || undefined,
      designation: designation.trim() || undefined,
      joining_date: joiningDate ? new Date(joiningDate).toISOString() : undefined,
      monthly_salary: salary ? Number(salary) : undefined,
      class_id: grade || undefined,
      section_id: section || undefined,
    }

    try {
      await updateTeacherMutation.mutateAsync(payload)
      setSuccessMessage('Teacher profile updated successfully! Redirecting...')
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      queryClient.invalidateQueries({ queryKey: ['teacher-profile-header', id] })
      queryClient.invalidateQueries({ queryKey: ['teacher-profile-tab', id] })

      setTimeout(() => {
        navigate(`/teachers/${id}`)
      }, 1400)
    } catch (err: any) {
      const backendError =
        err?.response?.data?.message || err?.message || 'Failed to update teacher profile.'
      setErrorMessage(backendError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoadingInitial = isHeaderLoading || isTabLoading

  if (isLoadingInitial) {
    return (
      <div className="w-full px-[32px] py-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <Loader2 className="size-10 text-[#2e67b1] animate-spin" />
        <p className="text-slate-500 font-sans text-base">Loading teacher profile details...</p>
      </div>
    )
  }

  return (
    <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-base flex-wrap font-sans">
          <span
            onClick={() => navigate('/dashboard')}
            className="text-slate-sub hover:underline cursor-pointer"
          >
            Principal Dashboard.
          </span>
          <ChevronRight className="size-4 text-slate-sub" />
          <span
            onClick={() => navigate('/teachers')}
            className="text-slate-sub hover:underline cursor-pointer"
          >
            Teachers
          </span>
          <ChevronRight className="size-4 text-slate-sub" />
          <span
            onClick={() => navigate(`/teachers/${id}`)}
            className="text-slate-sub hover:underline cursor-pointer"
          >
            {headerData?.full_name || 'Teacher Profile'}
          </span>
          <ChevronRight className="size-4 text-slate-sub" />
          <span className="text-navy-main font-medium font-urbanist capitalize">
            Edit Profile
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/teachers/${id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-semibold font-urbanist cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back to Profile
        </button>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/5 via-blue-800/5 to-transparent p-6 rounded-2xl border border-blue-100 flex items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2e67b1]/10 rounded-xl text-[#2e67b1]">
              <Edit3 className="size-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-[#0f172a]">
              Edit Teacher Profile
            </h1>
          </div>
          <p className="text-sm font-sans text-slate-600 pl-11">
            Update personal information, academic department, and administrative details for{' '}
            <span className="font-semibold text-slate-900">{headerData?.full_name}</span>.
          </p>
        </div>
      </div>

      {/* 3. Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-sans flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="size-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-sans flex items-center gap-3 animate-in fade-in duration-200">
            <Check className="size-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Form Fields Component */}
        <TeacherFormFields
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          cnicNumber={cnicNumber}
          setCnicNumber={setCnicNumber}
          phone={phone}
          setPhone={setPhone}
          dob={dob}
          setDob={setDob}
          gender={gender}
          setGender={setGender}
          teacherIdNumber={teacherIdNumber}
          setTeacherIdNumber={setTeacherIdNumber}
          department={department}
          setDepartment={setDepartment}
          designation={designation}
          setDesignation={setDesignation}
          joiningDate={joiningDate}
          setJoiningDate={setJoiningDate}
          salary={salary}
          setSalary={setSalary}
          grade={grade}
          onClassChange={handleClassChange}
          classOptions={classOptions}
          section={section}
          onSectionChange={handleSectionChange}
          sectionOptions={sectionOptions}
        />

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/teachers/${id}`)}
            className="px-6 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            leftIcon={
              isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )
            }
            className="px-8 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
