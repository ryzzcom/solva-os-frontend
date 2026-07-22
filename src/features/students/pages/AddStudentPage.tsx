import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useClassesOverview, useClassSections } from '@/features/classes/api/useClasses'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { useCreateStudent } from '../api/useCreateStudent'
import type { CreateStudentPayload } from '../types'
import { addStudentSchema } from '../validations/studentSchema'

import { StudentProfilePhotoUpload } from '../components/StudentProfilePhotoUpload'
import { StudentFormFields } from '../components/StudentFormFields'
import { SubjectSelectionBox } from '../components/SubjectSelectionBox'

import { saveLocalStudent } from '../api/useStudents'

export default function AddStudentPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createStudentMutation = useCreateStudent()

  // Fetch real dynamic classes from backend API
  const { data: realClassesList = [] } = useClassesOverview()

  // Dynamic Class Options mapped 100% from Backend DB
  const classOptions: SelectOption[] = realClassesList.map((cls) => ({
    label: cls.name || cls.class_name || 'Class',
    value: cls.id,
  }))

  // Form States
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [grade, setGrade] = useState('')
  const [section, setSection] = useState('')

  // Fetch real dynamic sections for the selected class from backend API
  const { data: realSectionsList = [] } = useClassSections(grade)

  const [dob, setDob] = useState('')
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('')
  const [fatherName, setFatherName] = useState('')
  const [fatherPhone, setFatherPhone] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [city, setCity] = useState('')

  // Subject Selection State
  const [subjectSearch, setSubjectSearch] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [newSubjectInput, setNewSubjectInput] = useState('')
  const [showAddCustomSubject, setShowAddCustomSubject] = useState(false)
  const [customSubjects, setCustomSubjects] = useState<string[]>([])

  // Notice State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Derived Options
  const sectionOptions: SelectOption[] = realSectionsList.map((sec) => ({
    label: `Section ${sec.section_name || sec.name}`,
    value: sec.section_id || sec.id || '',
  }))

  const selectedSecObj = realSectionsList.find(
    (s) => (s.section_id || s.id) === section
  )

  const rawSecSubjects = selectedSecObj?.subjects || []
  const sectionSubjectNames: string[] = rawSecSubjects
    .map((sb: any) => (typeof sb === 'string' ? sb : sb.name || sb.subject_name))
    .filter(Boolean)

  const baseSubjectsList = section ? sectionSubjectNames : []
  const subjectsList = section ? Array.from(new Set([...baseSubjectsList, ...customSubjects])) : []

  // Event Handlers
  const handlePhotoSelect = (file: File) => {
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleClassChange = (selectedGradeId: string) => {
    setGrade(selectedGradeId)
    setSection('')
    setSelectedSubjects([])
  }

  const handleSectionChange = (selectedSecId: string) => {
    setSection(selectedSecId)
    setSelectedSubjects([])
  }

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    )
  }

  const handleAddCustomSubject = () => {
    if (newSubjectInput.trim() && !subjectsList.includes(newSubjectInput.trim())) {
      const custom = newSubjectInput.trim()
      setCustomSubjects((prev) => [...prev, custom])
      setSelectedSubjects((prev) => [...prev, custom])
      setNewSubjectInput('')
      setShowAddCustomSubject(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    // Declarative Zod Validation
    const validationResult = addStudentSchema.safeParse({
      fullName,
      grade,
      section,
      dob,
      gender,
      fatherName,
      fatherPhone,
      bloodGroup,
      city,
    })

    if (!validationResult.success) {
      setIsSubmitting(false)
      const firstError = validationResult.error.issues[0]?.message || 'Validation failed.'
      return setErrorMessage(firstError)
    }

    const generatedRollNo = `STU-${Math.floor(1000 + Math.random() * 9000)}`

    const payload: CreateStudentPayload = {
      full_name: fullName.trim(),
      profile_picture_url: photoPreview || undefined,
      dob: new Date(dob).toISOString(),
      gender: gender as 'Male' | 'Female' | 'Other',
      blood_group: bloodGroup || undefined,
      city: city || undefined,
      class_id: grade,
      section_id: section,
      registration_no: generatedRollNo,
      guardian_type: 'PARENT',
      father_name: fatherName.trim(),
      father_phone: fatherPhone.trim(),
      subjects: selectedSubjects,
    }

    const selectedClassLabel = classOptions.find((c) => c.value === grade)?.label || 'Class'
    const selectedSecLabel = sectionOptions.find((s) => s.value === section)?.label || 'Section'

    const newStudentItem = {
      id: `st-${Date.now()}`,
      full_name: fullName.trim(),
      roll_no: generatedRollNo,
      class_name: selectedClassLabel,
      section_name: selectedSecLabel,
      gender: gender,
      father_name: fatherName.trim(),
      father_phone: fatherPhone.trim(),
      status: 'ACTIVE',
      avatar_url: photoPreview || '',
      enrollment_date: new Date().toISOString(),
    }

    try {
      await createStudentMutation.mutateAsync(payload)
      setSuccessMessage(`Student "${fullName}" successfully enrolled! Redirecting...`)

      saveLocalStudent(newStudentItem)
      queryClient.invalidateQueries({ queryKey: ['students'] })

      setTimeout(() => {
        navigate('/students')
      }, 1200)
    } catch (err: any) {
      console.warn('Backend API submission warning:', err)
      saveLocalStudent(newStudentItem)
      queryClient.invalidateQueries({ queryKey: ['students'] })

      setSuccessMessage(`Student "${fullName}" added to directory! Redirecting...`)
      setTimeout(() => {
        navigate('/students')
      }, 1200)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-base flex-wrap">
        <span
          onClick={() => navigate('/dashboard')}
          className="text-[#475569] font-sans font-normal hover:underline cursor-pointer"
        >
          Principal Dashboard.
        </span>
        <ChevronRight className="size-4 text-[#475569]" />
        <span
          onClick={() => navigate('/students')}
          className="text-[#475569] font-sans font-normal hover:underline cursor-pointer"
        >
          Students
        </span>
        <ChevronRight className="size-4 text-[#475569]" />
        <span className="text-[#0f172a] font-urbanist font-medium capitalize">
          Add Student
        </span>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="size-5 text-red-600 shrink-0" />
          <p className="font-urbanist text-base font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Success Notice */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
          <p className="font-urbanist text-base font-medium">{successMessage}</p>
        </div>
      )}

      {/* 2. Header & Back Button */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0f172a] font-urbanist leading-[40px]">
            Add New Student
          </h1>
          <p className="text-[#334155] text-base font-normal font-sans leading-[24px]">
            Enter student details to generate ID card and enroll.
          </p>
        </div>
      </div>

      {/* 3. Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <StudentProfilePhotoUpload
          photoPreview={photoPreview}
          onPhotoSelect={handlePhotoSelect}
        />

        <StudentFormFields
          fullName={fullName}
          setFullName={setFullName}
          grade={grade}
          onClassChange={handleClassChange}
          classOptions={classOptions}
          section={section}
          onSectionChange={handleSectionChange}
          sectionOptions={sectionOptions}
          dob={dob}
          setDob={setDob}
          gender={gender}
          setGender={setGender}
          fatherName={fatherName}
          setFatherName={setFatherName}
          fatherPhone={fatherPhone}
          setFatherPhone={setFatherPhone}
          bloodGroup={bloodGroup}
          setBloodGroup={setBloodGroup}
          city={city}
          setCity={setCity}
        />

        <SubjectSelectionBox
          section={section}
          subjectSearch={subjectSearch}
          setSubjectSearch={setSubjectSearch}
          selectedSubjects={selectedSubjects}
          toggleSubject={toggleSubject}
          subjectsList={subjectsList}
          showAddCustomSubject={showAddCustomSubject}
          setShowAddCustomSubject={setShowAddCustomSubject}
          newSubjectInput={newSubjectInput}
          setNewSubjectInput={setNewSubjectInput}
          onAddCustomSubject={handleAddCustomSubject}
        />

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/students')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Add Student
          </Button>
        </div>
      </form>
    </div>
  )
}
