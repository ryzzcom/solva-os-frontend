import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Minus, ArrowLeft, Check, Loader2, BookOpen, AlertCircle, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomSelect } from '@/components/ui/select-dropdown'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { PageBreadcrumb } from '@/components/ui/breadcrumb'
import { FormAlert } from '@/components/ui/form-alert'
import { SubjectSelectionBox } from '@/features/students/components/SubjectSelectionBox'
import { useTeachers } from '@/features/teachers/api/useTeachers'
import { useSectionDetails } from '../api/useSectionDetails'
import { useUpdateSection } from '../api/useUpdateSection'

export default function EditSectionPage() {
  const navigate = useNavigate()
  const { classId: routeClassId, sectionId } = useParams<{ classId?: string; sectionId: string }>()

  // 1. Queries and Mutations
  const { data: sectionDetails, isLoading, isError } = useSectionDetails(sectionId)
  const updateSectionMutation = useUpdateSection(sectionId)

  const { data: teachersData } = useTeachers({ page: 1, limit: 100 })
  const teacherList = teachersData?.teachers || []

  const classId = routeClassId || sectionDetails?.class_id || ''
  const className = sectionDetails?.class_name || 'Class'

  const teacherOptions: SelectOption[] = teacherList.map((t) => {
    const isAssignedElsewhere =
      t.assigned_classes &&
      t.assigned_classes.length > 0 &&
      (sectionDetails?.class_teacher_id || sectionDetails?.class_teacher?.id) !== t.id
    const assignedLabel = isAssignedElsewhere ? ` [Assigned: ${t.assigned_classes.join(', ')}]` : ''
    return {
      label: `${t.full_name}${t.department ? ` (${t.department})` : ''}${assignedLabel}`,
      value: t.id,
    }
  })

  // Form States
  const [sectionName, setSectionName] = useState('')
  const [classTeacherId, setClassTeacherId] = useState('')
  const [maxCapacity, setMaxCapacity] = useState<number>(30)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [customSubject, setCustomSubject] = useState('')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Pre-fill form when section details load
  useEffect(() => {
    if (sectionDetails) {
      setSectionName(sectionDetails.name || '')
      const teacherId = sectionDetails.class_teacher_id || sectionDetails.class_teacher?.id || ''
      setClassTeacherId(teacherId)
      setMaxCapacity(sectionDetails.max_capacity || 30)

      if (Array.isArray(sectionDetails.subjects)) {
        setSelectedSubjects(sectionDetails.subjects)
      }
    }
  }, [sectionDetails])

  // Teacher conflict checker helper
  const getTeacherConflictMessage = (teacherId: string) => {
    const currentTeacherId = sectionDetails?.class_teacher_id || sectionDetails?.class_teacher?.id
    if (!teacherId || teacherId === currentTeacherId) return null
    const teacherObj = teacherList.find((t) => t.id === teacherId)
    if (teacherObj?.assigned_classes && teacherObj.assigned_classes.length > 0) {
      return `This teacher is already assigned to another class section (${teacherObj.assigned_classes.join(', ')}). Assigning them here will transfer their class teacher access and automatically unassign them from their previous section.`
    }
    return null
  }

  const handleCapacityStep = (delta: number) => {
    setMaxCapacity((prev) => Math.max(1, prev + delta))
  }

  // Handlers for Subjects
  const toggleSubject = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subjectName))
    } else {
      setSelectedSubjects([...selectedSubjects, subjectName])
    }
  }

  const handleAddCustomSubject = () => {
    const trimmed = customSubject.trim()
    if (trimmed && !selectedSubjects.includes(trimmed)) {
      setSelectedSubjects([...selectedSubjects, trimmed])
      setCustomSubject('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!sectionName.trim()) {
      setErrorMessage('Section name cannot be empty.')
      return
    }

    if (classTeacherId) {
      const conflictMsg = getTeacherConflictMessage(classTeacherId)
      if (conflictMsg) {
        setErrorMessage(conflictMsg)
        return
      }
    }

    const payload = {
      section_name: sectionName.trim(),
      class_teacher_id: classTeacherId || null,
      max_capacity: maxCapacity,
      new_subjects: selectedSubjects,
    }

    updateSectionMutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMessage(`Successfully updated ${sectionName}! Redirecting...`)
        setTimeout(() => {
          if (classId) {
            navigate(`/classes/${classId}/sections`)
          } else {
            navigate('/classes')
          }
        }, 1500)
      },
      onError: (err: any) => {
        const rawMessage =
          err?.response?.data?.message || err?.message || 'Failed to update section details.'
        setErrorMessage(rawMessage)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="w-full px-[32px] py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 text-brand-primary animate-spin" />
        <p className="text-slate-600 font-sans font-medium text-base">
          Loading section details...
        </p>
      </div>
    )
  }

  if (isError || !sectionDetails) {
    return (
      <div className="w-full px-[32px] py-16 text-center space-y-4">
        <div className="p-8 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl max-w-lg mx-auto space-y-2">
          <AlertCircle className="size-8 text-rose-600 mx-auto" />
          <h3 className="text-lg font-bold font-urbanist">Failed to load section</h3>
          <p className="text-sm font-sans text-rose-700">
            The requested section could not be found or failed to load.
          </p>
          <Button
            onClick={() => navigate('/classes')}
            variant="outline"
            className="mt-2 border-rose-300 text-rose-800 hover:bg-rose-100"
          >
            Back to Classes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-16 max-w-5xl mx-auto">
      {/* 1. Breadcrumb Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageBreadcrumb
          items={[
            { label: 'Principal Dashboard.', href: '/dashboard' },
            { label: 'Classes', href: '/classes' },
            ...(classId
              ? [{ label: `${className} Sections`, href: `/classes/${classId}/sections` }]
              : []),
            { label: 'Edit Section' },
          ]}
        />

        <button
          type="button"
          onClick={() =>
            classId ? navigate(`/classes/${classId}/sections`) : navigate('/classes')
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-semibold font-urbanist cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back to Sections
        </button>
      </div>

      {/* 2. Hero Header Card (Distinct Dark Navy Gradient styling for Edit) */}
      <div className="bg-gradient-to-r from-navy-main to-brand-dark border border-slate-800 text-white rounded-2xl p-6 md:p-8 space-y-3 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-200 rounded-lg text-xs font-semibold font-urbanist uppercase tracking-wider">
                Edit Academic Section Profile
              </span>
              <span className="text-xs text-slate-300 font-mono">ID: {sectionId?.substring(0, 8)}...</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-white">
              Edit {sectionDetails.name || 'Section'} ({className})
            </h1>
            <p className="text-sm font-sans text-slate-300">
              Update section parameters, assigned class teacher, student capacity, and subject distribution.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold font-urbanist text-blue-100">
            <Edit3 className="size-4 text-blue-300" />
            <span>Editing Section Profile</span>
          </div>
        </div>
      </div>

      {/* 3. Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Alerts */}
        <FormAlert error={errorMessage} success={successMessage} />

        {/* Card 1: Section Details */}
        <div className="bg-white border border-card-border rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 text-navy-main font-semibold font-urbanist text-lg border-b border-slate-100 pb-3">
            <BookOpen className="size-5 text-brand-primary" />
            <span>Section Parameters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 font-sans">
                Section Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="Section Name (e.g. Section A)"
                className="w-full h-12 px-4 bg-white border border-card-border rounded-xl text-base text-slate-900 placeholder:text-slate-400 font-sans focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>

            {/* Assign Teacher */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 font-sans">
                Assign Class Teacher
              </label>
              <CustomSelect
                options={teacherOptions}
                value={classTeacherId}
                onChange={(val) => setClassTeacherId(val)}
                placeholder="Select Teacher (Optional)"
              />
              {classTeacherId && (() => {
                const conflictMsg = getTeacherConflictMessage(classTeacherId)
                return conflictMsg ? (
                  <p className="text-xs text-rose-600 font-sans font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>{conflictMsg}</span>
                  </p>
                ) : null
              })()}
            </div>
          </div>

          {/* Max Capacity Stepper */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-semibold text-slate-800 font-sans block">
              Max Capacity
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Math.max(1, Number(e.target.value) || 1))}
                className="w-full md:w-48 h-12 px-4 bg-white border border-card-border rounded-xl text-base text-slate-900 font-sans focus:outline-none focus:border-brand-primary"
              />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCapacityStep(-1)}
                  className="size-11 rounded-xl border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                >
                  <Minus className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCapacityStep(1)}
                  className="size-11 rounded-xl border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Unified Subject Selection Box */}
        <SubjectSelectionBox
          subjectSearch={customSubject}
          setSubjectSearch={setCustomSubject}
          selectedSubjects={selectedSubjects}
          toggleSubject={toggleSubject}
          subjectsList={selectedSubjects}
          onDeleteSubject={(subjToDelete) => {
            setSelectedSubjects((prev) => prev.filter((s) => s !== subjToDelete))
          }}
          newSubjectInput={customSubject}
          setNewSubjectInput={setCustomSubject}
          onAddCustomSubject={handleAddCustomSubject}
        />

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              classId ? navigate(`/classes/${classId}/sections`) : navigate('/classes')
            }
            className="px-8 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={updateSectionMutation.isPending}
            variant="primary"
            leftIcon={
              updateSectionMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )
            }
            className="px-10 bg-brand-primary hover:bg-brand-hover text-white"
          >
            {updateSectionMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
