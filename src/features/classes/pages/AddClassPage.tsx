import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Trash2,
  AlertCircle,
  Check,
  Loader2,
  ArrowLeft,
  BookOpen,
  Minus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomSelect } from '@/components/ui/select-dropdown'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { PageBreadcrumb } from '@/components/ui/breadcrumb'
import { FormAlert } from '@/components/ui/form-alert'
import { SubjectSelectionBox } from '@/features/students/components/SubjectSelectionBox'
import { useTeachers } from '@/features/teachers/api/useTeachers'
import { useCreateClass } from '../api/useCreateClass'

interface SectionFormState {
  section_name: string
  class_teacher_id: string
  max_capacity: number
}

export default function AddClassPage() {
  const navigate = useNavigate()
  const createClassMutation = useCreateClass()

  // 1. Fetch teachers list for dropdown
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

  // Teacher conflict checker helper
  const getTeacherConflictMessage = (teacherId: string, currentSecIdx: number) => {
    if (!teacherId) return null

    // 1. Check duplicate within current form
    const duplicateSecIndex = sections.findIndex(
      (s, i) => i !== currentSecIdx && s.class_teacher_id === teacherId
    )
    if (duplicateSecIndex !== -1) {
      const otherSecName = sections[duplicateSecIndex].section_name || `Section #${duplicateSecIndex + 1}`
      return `This teacher is already selected for ${otherSecName} in this form.`
    }

    // 2. Check existing backend assignment
    const teacherObj = teacherList.find((t) => t.id === teacherId)
    if (teacherObj?.assigned_classes && teacherObj.assigned_classes.length > 0) {
      return `This teacher is already assigned to another class section (${teacherObj.assigned_classes.join(', ')}).`
    }

    return null
  }

  // Form States
  const [className, setClassName] = useState('')
  const [sections, setSections] = useState<SectionFormState[]>([
    { section_name: 'Section A', class_teacher_id: '', max_capacity: 30 },
  ])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics',
    'English Literature',
  ])
  const [customSubject, setCustomSubject] = useState('')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Handlers for Sections
  const handleAddSection = () => {
    const nextLetter = String.fromCharCode(65 + sections.length) // A, B, C, D...
    setSections([
      ...sections,
      { section_name: `Section ${nextLetter}`, class_teacher_id: '', max_capacity: 30 },
    ])
  }

  const handleRemoveSection = (index: number) => {
    if (sections.length === 1) return // Keep at least one
    setSections(sections.filter((_, i) => i !== index))
  }

  const handleSectionChange = (
    index: number,
    field: keyof SectionFormState,
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
        section_name: s.section_name.trim(),
        class_teacher_id: s.class_teacher_id || null,
        max_capacity: s.max_capacity,
      })),
      new_subjects: selectedSubjects,
    }

    createClassMutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMessage(`Successfully created ${className}! Redirecting to classes...`)
        setTimeout(() => {
          navigate('/classes')
        }, 1500)
      },
      onError: (err: any) => {
        const rawMessage =
          err?.response?.data?.message || err?.message || 'Failed to create class level.'
        setErrorMessage(rawMessage)
      },
    })
  }

  return (
    <div className="w-full px-[32px] space-y-6 md:space-y-8 animate-in fade-in duration-300 pb-16 max-w-5xl mx-auto">
      {/* 1. Breadcrumbs Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageBreadcrumb
          items={[
            { label: 'Principal Dashboard.', href: '/dashboard' },
            { label: 'Classes', href: '/classes' },
            { label: 'Add Class' },
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

      {/* 2. Hero Header Banner matching Figma 736-7732 */}
      <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 md:p-8 space-y-2 shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-[#0f172a]">
          Add New Section / Class
        </h1>
        <p className="text-sm font-sans text-slate-600">
          Configure parameters for the new academic section, assigned teacher, capacity, and subjects.
        </p>
      </div>

      {/* 3. Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Alerts */}
        <FormAlert error={errorMessage} success={successMessage} />

        {/* Card 1: Class Name */}
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 md:p-8 space-y-4 shadow-xs">
          <label className="text-sm font-semibold font-sans text-slate-800 block">
            Class Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class Name (e.g. Grade 10)"
            className="w-full h-12 px-4 bg-white border border-[#d8dee8] rounded-xl text-base text-slate-900 placeholder:text-slate-400 font-sans focus:outline-none focus:border-[#2e67b1] transition-all"
          />
        </div>

        {/* Card 2: Configure Sections (Dynamic List) */}
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-[#0f172a] font-semibold font-urbanist text-lg">
              <BookOpen className="size-5 text-[#2e67b1]" />
              <span>Configure Sections</span>
            </div>
            <span className="text-xs text-slate-500 font-sans">
              {sections.length} section(s) defined
            </span>
          </div>

          <div className="space-y-6">
            {sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-urbanist uppercase tracking-wider text-[#2e67b1]">
                    Section #{idx + 1}
                  </span>
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
                      className="w-full h-11 px-3.5 bg-white border border-[#d8dee8] rounded-lg text-sm text-slate-900 font-sans focus:outline-none focus:border-[#2e67b1]"
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
                      className="w-full md:w-48 h-11 px-3.5 bg-white border border-[#d8dee8] rounded-lg text-sm text-slate-900 font-sans focus:outline-none focus:border-[#2e67b1]"
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
            className="w-full py-3 border-2 border-dashed border-[#2e67b1]/40 hover:border-[#2e67b1] bg-blue-50/30 hover:bg-blue-50/70 text-[#2e67b1] rounded-xl font-urbanist font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
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

        {/* Footer Actions matching Figma 736-7732 */}
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
            disabled={createClassMutation.isPending}
            variant="primary"
            leftIcon={
              createClassMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )
            }
            className="px-10 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white"
          >
            {createClassMutation.isPending ? 'Creating Class...' : 'Save Class'}
          </Button>
        </div>
      </form>
    </div>
  )
}
