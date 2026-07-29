import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronRight, AlertCircle, ArrowLeft, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useClassesOverview, useClassSections } from '@/features/classes/api/useClasses'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { useStudentSummary, useStudentPersonalProfile } from '../api/useStudentProfile'
import { useUpdateStudent } from '../api/useUpdateStudent'
import type { UpdateStudentPayload } from '../types/profile'

import { StudentProfilePhotoUpload } from '../components/StudentProfilePhotoUpload'
import { StudentFormFields } from '../components/StudentFormFields'
import { SubjectSelectionBox } from '../components/SubjectSelectionBox'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditStudentPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // API Queries for Existing Student Data
  const { data: summaryData, isLoading: isSummaryLoading } = useStudentSummary(id)
  const { data: personalData, isLoading: isPersonalLoading } = useStudentPersonalProfile(id)

  // API Mutation for Updating
  const updateStudentMutation = useUpdateStudent(id)

  // Fetch real dynamic classes from backend API
  const { data: realClassesList = [] } = useClassesOverview()

  // Dynamic Class Options
  const classOptions: SelectOption[] = realClassesList.map((cls) => ({
    label: cls.name || cls.class_name || 'Class',
    value: cls.id,
  }))

  // Form States
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [grade, setGrade] = useState('')
  const [section, setSection] = useState('')

  // Fetch real dynamic sections for selected class
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

  // Pre-fill form when student data loads
  useEffect(() => {
    if (personalData || summaryData) {
      const pInfo = personalData?.personal_information
      const header = summaryData?.header
      const gDetails = personalData?.guardian_details
      const academic = personalData?.academic_enrollment

      setFullName(pInfo?.full_name || header?.full_name || '')

      if (pInfo?.dob) {
        try {
          const dateObj = new Date(pInfo.dob)
          if (!isNaN(dateObj.getTime())) {
            setDob(dateObj.toISOString().split('T')[0])
          } else {
            setDob(pInfo.dob)
          }
        } catch {
          setDob(pInfo.dob || '')
        }
      }

      const genderVal = pInfo?.gender
      if (genderVal === 'Male' || genderVal === 'Female' || genderVal === 'Other') {
        setGender(genderVal)
      } else {
        setGender('Male')
      }
      setBloodGroup(pInfo?.blood_group || '')
      setCity(pInfo?.city || '')
      setPhotoPreview(header?.profile_picture_url || null)

      if (gDetails?.guardian_name) {
        setFatherName(gDetails.guardian_name)
      }
      if (gDetails?.guardian_phone) {
        setFatherPhone(gDetails.guardian_phone)
      }

      if (academic?.assigned_subjects && Array.isArray(academic.assigned_subjects)) {
        setSelectedSubjects(academic.assigned_subjects)
      }
    }
  }, [personalData, summaryData])

  // Pre-fill Class (grade) from realClassesList matching class_name / class_id
  useEffect(() => {
    if (realClassesList.length > 0 && !grade) {
      const targetClassName =
        personalData?.academic_enrollment?.class_name || summaryData?.header?.class_name
      const targetClassId = personalData?.academic_enrollment?.class_id

      const foundClass = realClassesList.find(
        (c) =>
          (targetClassId && c.id === targetClassId) ||
          (c.name && targetClassName && c.name.toLowerCase() === targetClassName.toLowerCase()) ||
          (c.class_name && targetClassName && c.class_name.toLowerCase() === targetClassName.toLowerCase())
      )

      if (foundClass) {
        setGrade(foundClass.id)
      }
    }
  }, [realClassesList, personalData, summaryData, grade])

  // Pre-fill Section from realSectionsList matching section_name / section_id
  useEffect(() => {
    if (realSectionsList.length > 0 && !section) {
      const targetSectionName =
        personalData?.academic_enrollment?.section_name || summaryData?.header?.section_name
      const targetSectionId = personalData?.academic_enrollment?.section_id

      const foundSection = realSectionsList.find(
        (s) =>
          (targetSectionId && (s.section_id || s.id) === targetSectionId) ||
          (s.section_name &&
            targetSectionName &&
            s.section_name.toLowerCase() === targetSectionName.toLowerCase()) ||
          (s.name &&
            targetSectionName &&
            s.name.toLowerCase() === targetSectionName.toLowerCase())
      )

      if (foundSection) {
        setSection(foundSection.section_id || foundSection.id || '')
      }
    }
  }, [realSectionsList, personalData, summaryData, section])

  // Derived Options for Sections
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

  const initialAssigned = personalData?.academic_enrollment?.assigned_subjects || []
  const subjectsList = Array.from(
    new Set([...sectionSubjectNames, ...initialAssigned, ...selectedSubjects, ...customSubjects])
  )


  // Handlers
  const handlePhotoSelect = (file: File) => {
    setSelectedFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleClassChange = (selectedGradeId: string) => {
    setGrade(selectedGradeId)
    setSection('')
  }

  const handleSectionChange = (selectedSecId: string) => {
    setSection(selectedSecId)
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

    const payload: UpdateStudentPayload = {
      full_name: fullName.trim(),
      dob: dob ? new Date(dob).toISOString() : undefined,
      gender: gender as 'Male' | 'Female' | 'Other',
      blood_group: bloodGroup || undefined,
      city: city || undefined,
      guardian_type: 'PARENT',
      father_name: fatherName.trim(),
      father_phone: fatherPhone.trim(),
      profile_picture: selectedFile || undefined,
    }

    if (grade) payload.class_id = grade
    if (section) payload.section_id = section

    try {
      await updateStudentMutation.mutateAsync(payload)
      setSuccessMessage(`Student profile updated successfully! Redirecting...`)
      queryClient.invalidateQueries({ queryKey: ['studentSummary', id] })
      queryClient.invalidateQueries({ queryKey: ['studentPersonal', id] })
      queryClient.invalidateQueries({ queryKey: ['students'] })

      setTimeout(() => {
        navigate(`/students/${id}`)
      }, 1200)
    } catch (err: any) {
      const backendError =
        err?.response?.data?.message || err?.message || 'Failed to update student profile.'
      setErrorMessage(backendError)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSummaryLoading || isPersonalLoading) {
    return (
      <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-pulse pb-16">
        <Skeleton className="h-6 w-72 rounded-md" />
        <Skeleton className="h-10 w-64 rounded-md" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-base flex-wrap font-sans">
          <span
            onClick={() => navigate('/dashboard')}
            className="text-[#475569] hover:underline cursor-pointer"
          >
            Principal Dashboard.
          </span>
          <ChevronRight className="size-4 text-[#475569]" />
          <span
            onClick={() => navigate('/students')}
            className="text-[#475569] hover:underline cursor-pointer"
          >
            Students
          </span>
          <ChevronRight className="size-4 text-[#475569]" />
          <span
            onClick={() => navigate(`/students/${id}`)}
            className="text-[#475569] hover:underline cursor-pointer"
          >
            Profile Student
          </span>
          <ChevronRight className="size-4 text-[#475569]" />
          <span className="text-[#0f172a] font-medium font-urbanist capitalize">
            Edit Student
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/students/${id}`)}
          className="inline-flex items-center gap-2 text-sm font-medium font-urbanist text-[#2e67b1] hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back to Profile
        </button>
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
          <Check className="size-5 text-emerald-600 shrink-0" />
          <p className="font-urbanist text-base font-medium">{successMessage}</p>
        </div>
      )}

      {/* 2. Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0f172a] font-urbanist leading-[40px]">
            Edit Student Profile
          </h1>
          <p className="text-[#334155] text-base font-normal font-sans leading-[24px]">
            Update student personal details, class enrollment, and guardian information.
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
          disabled={!section && selectedSubjects.length === 0}
          subjectSearch={subjectSearch}
          setSubjectSearch={setSubjectSearch}
          selectedSubjects={selectedSubjects}
          toggleSubject={toggleSubject}
          subjectsList={subjectsList}
          onDeleteSubject={(subjToDelete) => {
            setSelectedSubjects((prev: string[]) => prev.filter((s: string) => s !== subjToDelete))
          }}
          showAddCustomSubject={showAddCustomSubject}
          setShowAddCustomSubject={setShowAddCustomSubject}
          newSubjectInput={newSubjectInput}
          setNewSubjectInput={setNewSubjectInput}
          onAddCustomSubject={handleAddCustomSubject}
        />

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/students/${id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
