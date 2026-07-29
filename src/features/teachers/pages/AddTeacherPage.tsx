import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageBreadcrumb } from '@/components/ui/breadcrumb'
import { FormAlert } from '@/components/ui/form-alert'
import { useClassesOverview, useClassSections } from '@/features/classes/api/useClasses'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { useCreateTeacher } from '../api/useCreateTeacher'
import type { CreateTeacherPayload } from '../types'
import { addTeacherSchema } from '../schemas/teacherSchema'
import { TeacherFormFields } from '../components/TeacherFormFields'

export default function AddTeacherPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createTeacherMutation = useCreateTeacher()

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

    // Zod Schema Validation
    const validationResult = addTeacherSchema.safeParse({
      fullName: fullName.trim(),
      email: email.trim(),
      cnicNumber: cnicNumber.trim(),
      phone: phone.trim(),
      dob,
      gender: gender || undefined,
      department: department || undefined,
      designation: designation.trim() || undefined,
      joiningDate: joiningDate || undefined,
      salary: salary || undefined,
      grade: grade || undefined,
      section: section || undefined,
    })

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Please fill in all required fields correctly.'
      setErrorMessage(firstError)
      setIsSubmitting(false)
      return
    }

    const payload: CreateTeacherPayload = {
      full_name: fullName.trim(),
      email: email.trim(),
      cnic_number: cnicNumber.trim(),
      phone_number: phone.trim() || undefined,
      dob: dob ? new Date(dob).toISOString() : undefined,
      gender: gender || undefined,
      department_name: department || undefined,
      designation: designation.trim() || undefined,
      joining_date: joiningDate ? new Date(joiningDate).toISOString() : undefined,
      monthly_salary: salary ? Number(salary) : undefined,
      class_id: grade || undefined,
      section_id: section || undefined,
      registration_no: teacherIdNumber.trim() ? `SOL-${teacherIdNumber.trim()}` : undefined,
    }

    try {
      const response = await createTeacherMutation.mutateAsync(payload)
      const empId = response?.employee_id || response?.registration_no || 'TCH'
      setSuccessMessage(`Faculty member onboarded successfully! Employee ID: ${empId}. Redirecting...`)
      queryClient.invalidateQueries({ queryKey: ['teachers'] })

      setTimeout(() => {
        navigate('/teachers')
      }, 1500)
    } catch (err: any) {
      const backendError =
        err?.response?.data?.message || err?.message || 'Failed to onboard faculty member.'
      setErrorMessage(backendError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageBreadcrumb
          items={[
            { label: 'Principal Dashboard.', href: '/dashboard' },
            { label: 'Teachers', href: '/teachers' },
            { label: 'Add Teacher' },
          ]}
        />

        <button
          type="button"
          onClick={() => navigate('/teachers')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-semibold font-urbanist cursor-pointer"
        >
          <span>Back to Teachers</span>
        </button>
      </div>

      {/* Notices */}
      <FormAlert error={errorMessage} success={successMessage} />

      {/* 2. Header Banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-navy-main font-urbanist leading-[40px]">
          Onboard Faculty
        </h1>
        <p className="text-slate-body text-base font-normal font-sans leading-[24px]">
          Initialize a new academic profile. This will create institutional credentials and system access.
        </p>
      </div>

      {/* 3. Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/teachers')}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Onboarding...
              </>
            ) : (
              'Onboard Faculty'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
