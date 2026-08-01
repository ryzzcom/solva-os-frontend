import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRightLeft, X, Loader2, BookOpen, Layers } from 'lucide-react'
import { useClassesOverviewFull, useClassSections } from '@/features/classes/api/useClasses'
import { FormAlert } from '@/components/ui/form-alert'
import { useMoveStudents } from '../api/useMoveStudents'

interface MoveStudentModalProps {
  open: boolean
  onClose: () => void
  studentId?: string
  studentName?: string
  currentClassName?: string
  currentSectionName?: string
  currentClassId?: string
  currentSectionId?: string
}

export const MoveStudentModal: React.FC<MoveStudentModalProps> = ({
  open,
  onClose,
  studentId,
  studentName = 'Student',
  currentClassName = 'Class',
  currentSectionName = 'Section',
  currentClassId,
  currentSectionId,
}) => {
  const { data: classesOverviewData, isLoading: isClassesLoading } = useClassesOverviewFull()
  const classesList = classesOverviewData?.classes_list || []

  const [targetClassId, setTargetClassId] = useState<string>('')
  const [targetSectionId, setTargetSectionId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Fetch sections for target selected class
  const { data: sectionsList = [], isLoading: isSectionsLoading } = useClassSections(targetClassId)

  const moveStudentsMutation = useMoveStudents(currentSectionId, currentClassId)

  useEffect(() => {
    if (open) {
      setTargetClassId('')
      setTargetSectionId('')
      setErrorMessage(null)
    }
  }, [open])

  // Reset section when class changes
  const handleClassChange = (newClassId: string) => {
    setTargetClassId(newClassId)
    setTargetSectionId('')
    setErrorMessage(null)
  }

  const handleMove = () => {
    if (!studentId) {
      setErrorMessage('Student identifier is missing. Please close and re-select the student.')
      return
    }

    if (!targetClassId) {
      setErrorMessage('Please select a target class level.')
      return
    }

    if (!targetSectionId) {
      setErrorMessage('Please select a target section.')
      return
    }

    if (targetSectionId === currentSectionId) {
      setErrorMessage('Student is already enrolled in this section. Please select a different section.')
      return
    }

    setErrorMessage(null)
    moveStudentsMutation.mutate(
      {
        student_ids: [studentId],
        target_class_id: targetClassId,
        target_section_id: targetSectionId,
      },
      {
        onSuccess: () => {
          onClose()
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || err?.message || 'Failed to move student to target section.'
          setErrorMessage(msg)
        },
      }
    )
  }

  if (!open) return null

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ArrowRightLeft className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-urbanist text-[#0f172a]">
                Move Student Class / Section
              </h3>
              <p className="text-xs font-sans text-slate-500">
                Transfer student enrollment to another grade level or section.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {errorMessage && <FormAlert error={errorMessage} />}

          {/* Student Current Info Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="text-xs text-slate-500 font-sans block">Moving Student</span>
            <p className="text-base font-bold font-urbanist text-navy-main">
              {studentName}
            </p>
            <p className="text-xs font-sans text-amber-700 font-medium">
              Currently in {currentClassName} • {currentSectionName}
            </p>
          </div>

          {/* Form Fields: Class & Section Selection */}
          <div className="space-y-4">
            {/* 1. Target Class Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-urbanist flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-brand-primary" />
                <span>Select Target Class Level</span>
              </label>

              {isClassesLoading ? (
                <div className="h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Loader2 className="size-4 animate-spin text-brand-primary" />
                  <span>Loading class levels...</span>
                </div>
              ) : (
                <select
                  value={targetClassId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold font-urbanist text-slate-900 focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  <option value="">Select a class...</option>
                  {classesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.class_name} ({c.sections_count || c.sections?.length || 0} Sections)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 2. Target Section Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 font-urbanist flex items-center gap-1.5">
                <Layers className="size-3.5 text-brand-primary" />
                <span>Select Target Section</span>
              </label>

              {!targetClassId ? (
                <div className="h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center px-3.5 text-xs text-slate-400 font-sans">
                  First select a class level above...
                </div>
              ) : isSectionsLoading ? (
                <div className="h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Loader2 className="size-4 animate-spin text-brand-primary" />
                  <span>Loading sections...</span>
                </div>
              ) : (
                <select
                  value={targetSectionId}
                  onChange={(e) => setTargetSectionId(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold font-urbanist text-slate-900 focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  <option value="">Select a section...</option>
                  {sectionsList.map((sec) => {
                    const secId = sec.section_id || sec.id || ''
                    const secName = sec.section_name || sec.name || 'Section'
                    const fullSecName = secName.startsWith('Section') ? secName : `Section ${secName}`
                    const currentStudents = sec.current_students ?? sec.student_count ?? 0
                    const maxCap = sec.max_capacity || 30
                    const isFull = currentStudents >= maxCap

                    return (
                      <option key={secId} value={secId} disabled={isFull}>
                        {fullSecName} ({currentStudents}/{maxCap} Students){isFull ? ' - SECTION FULL' : ''}
                      </option>
                    )
                  })}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={moveStudentsMutation.isPending}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold font-urbanist transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleMove}
            disabled={!targetClassId || !targetSectionId || moveStudentsMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 text-xs font-semibold font-urbanist shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            {moveStudentsMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            <span>Move Student</span>
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
