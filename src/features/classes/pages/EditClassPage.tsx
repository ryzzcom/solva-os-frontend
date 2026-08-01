import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Plus,
  Trash2,
  AlertCircle,
  Check,
  Loader2,
  ArrowLeft,
  BookOpen,
  Minus,
  Edit3,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomSelect } from '@/components/ui/select-dropdown'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { PageBreadcrumb } from '@/components/ui/breadcrumb'
import { FormAlert } from '@/components/ui/form-alert'
import { SubjectSelectionBox } from '@/features/students/components/SubjectSelectionBox'
import { useTeachers } from '@/features/teachers/api/useTeachers'
import { useClassDetailsFull } from '../api/useClasses'
import { useUpdateClass } from '../api/useUpdateClass'

interface EditSectionFormState {
  id?: string
  section_name: string
  class_teacher_id: string
  max_capacity: number
  current_students?: number
}

export default function EditClassPage() {
  const navigate = useNavigate()
  const { id: classId } = useParams<{ id: string }>()

  // 1. Queries and Mutations
  const { data: classDetails, isLoading: isDetailsLoading, isError: isDetailsError } = useClassDetailsFull(classId)
  const updateClassMutation = useUpdateClass(classId)

  const { data: teachersData } = useTeachers({ page: 1, limit: 100 })
  const teacherList = teachersData?.teachers || []

  const teacherOptions: SelectOption[] = teacherList.map((t) => {
    const isAssignedElsewhere = t.assigned_classes && t.assigned_classes.length > 0
    const assignedLabel = isAssignedElsewhere ? ` [Assigned: ${t.assigned_classes.join(', ')}]` : ''
    return {
      label: `${t.full_name}${t.department ? ` (${t.department})` : ''}${assignedLabel}`,
      value: t.id,
    }
  })

  // Form States
  const [className, setClassName] = useState('')
  const [sections, setSections] = useState<EditSectionFormState[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [customSubject, setCustomSubject] = useState('')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // 2. Pre-fill form when backend data loads
  useEffect(() => {
    if (classDetails) {
      setClassName(classDetails.class_name || '')

      if (classDetails.sections && classDetails.sections.length > 0) {
        const loadedSections: EditSectionFormState[] = classDetails.sections.map((s) => ({
          id: s.section_id || s.id,
          section_name: s.section_name || s.name || 'Section A',
          class_teacher_id: s.class_teacher?.id || '',
          max_capacity: s.max_capacity || 30,
          current_students: s.current_students || 0,
        }))
        setSections(loadedSections)

        // Extract pre-assigned subjects from sections
        const extractedSubjects: string[] = []
        classDetails.sections.forEach((s) => {
          if (Array.isArray(s.subjects)) {
            s.subjects.forEach((subj) => {
              const name = typeof subj === 'string' ? subj : subj.name || subj.subject_name
              if (name && !extractedSubjects.includes(name)) {
                extractedSubjects.push(name)
              }
            })
          }
        })

        if (extractedSubjects.length > 0) {
          setSelectedSubjects(extractedSubjects)
        } else {
          setSelectedSubjects(['Mathematics', 'English Literature'])
        }
      } else {
        setSections([{ section_name: 'Section A', class_teacher_id: '', max_capacity: 30 }])
        setSelectedSubjects(['Mathematics', 'English Literature'])
      }
    }
  }, [classDetails])

  // Teacher conflict checker helper
  const getTeacherConflictMessage = (teacherId: string, currentSecIdx: number) => {
    if (!teacherId) return null

    // 1. Check duplicate within current form
    const duplicateSecIndex = sections.findIndex(
      (s, i) => i !== currentSecIdx && s.class_teacher_id === teacherId
    )
    if (duplicateSecIndex !== -1) {
      const otherSecName = sections[duplicateSecIndex].section_name || `Section #${duplicateSecIndex + 1}`
      return `This teacher is already selected for ${otherSecName} in this class.`
    }

    // 2. Check existing backend assignment (excluding if assigned to this exact section)
    const teacherObj = teacherList.find((t) => t.id === teacherId)
    if (teacherObj?.assigned_classes && teacherObj.assigned_classes.length > 0) {
      // Check if assignment is for another class/section
      const currentSecName = sections[currentSecIdx]?.section_name
      const currentClassName = className
      const matchExact = teacherObj.assigned_classes.some(
        (ac) => ac.includes(currentClassName) && ac.includes(currentSecName)
      )
      if (!matchExact) {
        return `This teacher is already assigned to another class section (${teacherObj.assigned_classes.join(', ')}).`
      }
    }

    return null
  }

  // Handlers for Sections
  const handleAddSection = () => {
    const nextLetter = String.fromCharCode(65 + sections.length)
    setSections([
      ...sections,
      { section_name: `Section ${nextLetter}`, class_teacher_id: '', max_capacity: 30, current_students: 0 },
    ])
  }

  const handleRemoveSection = (index: number) => {
    if (sections.length === 1) return // Keep at least one
    setSections(sections.filter((_, i) => i !== index))
  }

  const handleSectionChange = (
    index: number,
    field: keyof EditSectionFormState,
    value: string | number
  ) => {
    const updated = [...sections]
    updated[index] = { ...updated[index], [field]: value }
    setSections(updated)
  }

  const handleCapacityStep = (index: number, delta: number) => {
    const updated = [...sections]
    const current = updated[index].max_capacity || 30
    const nextVal = Math.max(1, current + delta)
    updated[index].max_capacity = nextVal
    setSections(updated)
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

    if (!className.trim()) {
      setErrorMessage('Class name is required.')
      return
    }

    if (sections.length === 0) {
      setErrorMessage('At least one section is required.')
      return
    }

    // Check duplicate section names
    const secNames = sections.map((s) => s.section_name.trim().toLowerCase())
    const uniqueSecNames = new Set(secNames)
    if (uniqueSecNames.size !== secNames.length) {
      setErrorMessage('Section names within the class must be unique.')
      return
    }

    for (const sec of sections) {
      if (!sec.section_name.trim()) {
        setErrorMessage('All sections must have a valid name.')
        return
      }
    }

    // Check duplicate or conflicting teacher assignments
    for (let i = 0; i < sections.length; i++) {
      const tId = sections[i].class_teacher_id
      if (tId) {
        const conflictMsg = getTeacherConflictMessage(tId, i)
        if (conflictMsg) {
          setErrorMessage(conflictMsg)
          return
        }
      }
    }

    const payload = {
      class_name: className.trim(),
      sections: sections.map((s) => ({
        id: s.id,
        section_name: s.section_name.trim(),
        class_teacher_id: s.class_teacher_id || null,
        max_capacity: s.max_capacity,
      })),
      new_subjects: selectedSubjects,
    }

    updateClassMutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMessage(`Successfully updated ${className}! Redirecting to classes...`)
        setTimeout(() => {
          navigate('/classes')
        }, 1500)
      },
      onError: (err: any) => {
        const rawMessage =
          err?.response?.data?.message || err?.message || 'Failed to update class details.'
        setErrorMessage(rawMessage)
      },
    })
  }

  if (isDetailsLoading) {
    return (
      <div className="w-full px-[32px] py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 text-[#2e67b1] animate-spin" />
        <p className="text-slate-600 font-sans font-medium text-base">
          Loading class details...
        </p>
      </div>
    )
  }

  if (isDetailsError || !classDetails) {
    return (
      <div className="w-full px-[32px] py-16 text-center space-y-4">
        <div className="p-8 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl max-w-lg mx-auto space-y-2">
          <AlertCircle className="size-8 text-rose-600 mx-auto" />
          <h3 className="text-lg font-bold font-urbanist">Failed to load class</h3>
          <p className="text-sm font-sans text-rose-700">
            The requested class could not be found or failed to load.
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
      {/* 1. Breadcrumbs Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageBreadcrumb
          items={[
            { label: 'Principal Dashboard.', href: '/dashboard' },
            { label: 'Classes', href: '/classes' },
            { label: 'Edit Class' },
          ]}
        />

        <button
          type="button"
          onClick={() => navigate('/classes')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-sm font-semibold font-urbanist cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back to Classes
        </button>
      </div>

      {/* 2. Hero Header Banner (Distinct styling for Edit Class) */}
      <div className="bg-gradient-to-r from-navy-main to-brand-dark border border-slate-800 text-white rounded-2xl p-6 md:p-8 space-y-3 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-200 rounded-lg text-xs font-semibold font-urbanist uppercase tracking-wider">
                Edit Academic Level Profile
              </span>
              <span className="text-xs text-slate-300 font-mono">ID: {classId?.substring(0, 8)}...</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-white">
              Edit {classDetails.class_name || 'Class Details'}
            </h1>
            <p className="text-sm font-sans text-slate-300">
              Update class name, manage section configurations, section teachers, and subject distribution.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold font-urbanist text-blue-100">
            <Edit3 className="size-4 text-blue-300" />
            <span>Editing {sections.length} Section(s)</span>
          </div>
        </div>
      </div>

      {/* 3. Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Alerts */}
        <FormAlert error={errorMessage} success={successMessage} />

        {/* Card 1: Class Name */}
        <div className="bg-white border border-card-border rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
          <label className="text-sm font-semibold font-sans text-slate-800 block">
            Class Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class Name (e.g. Grade 10)"
            className="w-full h-12 px-4 bg-white border border-card-border rounded-xl text-base text-slate-900 placeholder:text-slate-400 font-sans focus:outline-none focus:border-brand-primary transition-all"
          />
        </div>

        {/* Card 2: Manage Sections */}
        <div className="bg-white border border-card-border rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-navy-main font-semibold font-urbanist text-lg">
              <BookOpen className="size-5 text-brand-primary" />
              <span>Manage Sections & Teachers</span>
            </div>
            <span className="text-xs text-slate-500 font-sans">
              {sections.length} section(s) configured
            </span>
          </div>

          <div className="space-y-6">
            {sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-urbanist uppercase tracking-wider text-brand-primary">
                      Section #{idx + 1}
                    </span>
                    {sec.current_students !== undefined && sec.current_students > 0 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-brand-primary rounded-md text-[11px] font-semibold font-sans flex items-center gap-1">
                        <Users className="size-3" />
                        {sec.current_students} Student(s) Enrolled
                      </span>
                    )}
                  </div>

                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove section"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Section Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-sans">
                      Section Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={sec.section_name}
                      onChange={(e) => handleSectionChange(idx, 'section_name', e.target.value)}
                      placeholder="e.g. Section A"
                      className="w-full h-11 px-3.5 bg-white border border-card-border rounded-lg text-sm text-slate-900 font-sans focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Assign Teacher */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 font-sans">
                      Assign Class Teacher
                    </label>
                    <CustomSelect
                      options={teacherOptions}
                      value={sec.class_teacher_id}
                      onChange={(val) => handleSectionChange(idx, 'class_teacher_id', val)}
                      placeholder="Select Teacher (Optional)"
                    />
                    {sec.class_teacher_id && (() => {
                      const conflictMsg = getTeacherConflictMessage(sec.class_teacher_id, idx)
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
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-slate-700 font-sans block">
                    Max Capacity
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={sec.max_capacity}
                      onChange={(e) =>
                        handleSectionChange(
                          idx,
                          'max_capacity',
                          Math.max(1, Number(e.target.value) || 1)
                        )
                      }
                      className="w-full md:w-48 h-11 px-3.5 bg-white border border-card-border rounded-lg text-sm text-slate-900 font-sans focus:outline-none focus:border-brand-primary"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCapacityStep(idx, -1)}
                        className="size-10 rounded-lg border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                      >
                        <Minus className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCapacityStep(idx, 1)}
                        className="size-10 rounded-lg border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddSection}
            className="w-full py-3 border-2 border-dashed border-brand-primary/40 hover:border-brand-primary bg-blue-50/30 hover:bg-blue-50/70 text-brand-primary rounded-xl font-urbanist font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Another Section</span>
          </button>
        </div>

        {/* Card 3: Unified Subject Selection Box */}
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
            onClick={() => navigate('/classes')}
            className="px-8 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={updateClassMutation.isPending}
            variant="primary"
            leftIcon={
              updateClassMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )
            }
            className="px-10 bg-brand-primary hover:bg-brand-hover text-white"
          >
            {updateClassMutation.isPending ? 'Updating Class...' : 'Update Class'}
          </Button>
        </div>
      </form>
    </div>
  )
}
