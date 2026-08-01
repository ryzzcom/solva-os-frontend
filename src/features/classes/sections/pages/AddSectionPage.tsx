import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Minus, ArrowLeft, Check, Loader2, BookOpen, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomSelect } from '@/components/ui/select-dropdown'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { PageBreadcrumb } from '@/components/ui/breadcrumb'
import { FormAlert } from '@/components/ui/form-alert'
import { SubjectSelectionBox } from '@/features/students/components/SubjectSelectionBox'
import { useTeachers } from '@/features/teachers/api/useTeachers'
import { useClassSectionsOverview } from '../api/useClassSectionsOverview'
import { useCreateSection } from '../api/useCreateSection'

export default function AddSectionPage() {
  const navigate = useNavigate()
  const { id: classId } = useParams<{ id: string }>()

  // 1. Queries and Mutations
  const { data: classSectionsData } = useClassSectionsOverview(classId)
  const createSectionMutation = useCreateSection(classId)

  const { data: teachersData } = useTeachers({ page: 1, limit: 100 })
  const teacherList = teachersData?.teachers || []

  const className = classSectionsData?.class_name || 'Class'

  const teacherOptions: SelectOption[] = teacherList.map((t) => {
    const isAssignedElsewhere = t.assigned_classes && t.assigned_classes.length > 0
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
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics',
    'English Literature',
  ])
  const [customSubject, setCustomSubject] = useState('')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Teacher conflict checker helper
  const getTeacherConflictMessage = (teacherId: string) => {
    if (!teacherId) return null
    const teacherObj = teacherList.find((t) => t.id === teacherId)
    if (teacherObj?.assigned_classes && teacherObj.assigned_classes.length > 0) {
      return `This teacher is already assigned to another class section (${teacherObj.assigned_classes.join(', ')}).`
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
      setErrorMessage('Section name is required.')
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

    createSectionMutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMessage(`Successfully created ${sectionName} for ${className}! Redirecting...`)
        setTimeout(() => {
          navigate(`/classes/${classId}/sections`)
        }, 1500)
      },
      onError: (err: any) => {
        const rawMessage =
          err?.response?.data?.message || err?.message || 'Failed to create new section.'
        setErrorMessage(rawMessage)
      },
    })
  }

  return (
    <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-16 max-w-5xl mx-auto">
      {/* 1. Breadcrumb Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageBreadcrumb
          items={[
            { label: 'Principal Dashboard.', href: '/dashboard' },
            { label: 'Classes', href: '/classes' },
            { label: `${className} Sections`, href: `/classes/${classId}/sections` },
            { label: 'Add Section' },
          ]}
        />

        <button
          type="button"
          onClick={() => navigate(`/classes/${classId}/sections`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-semibold font-urbanist cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back to Sections
        </button>
      </div>

      {/* 2. Hero Header Card */}
      <div className="bg-white border border-card-border rounded-2xl p-6 md:p-8 space-y-2 shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-navy-main">
          Add New Section for {className}
        </h1>
        <p className="text-sm font-sans text-slate-600">
          Configure section parameters, assigned teacher, student capacity, and subjects for {className}.
        </p>
      </div>

      {/* 3. Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Alerts */}
        <FormAlert error={errorMessage} success={successMessage} />

        {/* Card 1: Section Details */}
        <div className="bg-white border border-card-border rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 text-navy-main font-semibold font-urbanist text-lg border-b border-slate-100 pb-3">
            <BookOpen className="size-5 text-brand-primary" />
            <span>Section Details</span>
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
                placeholder="Section Name (e.g. Section G)"
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
            onClick={() => navigate(`/classes/${classId}/sections`)}
            className="px-8 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createSectionMutation.isPending}
            variant="primary"
            leftIcon={
              createSectionMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )
            }
            className="px-10 bg-brand-primary hover:bg-brand-hover text-white"
          >
            {createSectionMutation.isPending ? 'Creating Section...' : 'Save Section'}
          </Button>
        </div>
      </form>
    </div>
  )
}
