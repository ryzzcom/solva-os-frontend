import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Search, UserCheck, X, Loader2, Check } from 'lucide-react'
import { useTeachers } from '@/features/teachers/api/useTeachers'
import { FormAlert } from '@/components/ui/form-alert'
import { useAssignTeacherToSection } from '../api/useAssignTeacherToSection'

interface AssignTeacherModalProps {
  open: boolean
  onClose: () => void
  sectionId?: string
  sectionName?: string
  currentTeacherId?: string | null
  classId?: string
}

export const AssignTeacherModal: React.FC<AssignTeacherModalProps> = ({
  open,
  onClose,
  sectionId,
  sectionName = 'Section',
  currentTeacherId,
  classId,
}) => {
  const { data: teachersData, isLoading: isTeachersLoading } = useTeachers({ page: 1, limit: 100 })
  const teacherList = teachersData?.teachers || []

  const assignTeacherMutation = useAssignTeacherToSection(sectionId, classId)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setSelectedTeacherId(currentTeacherId || '')
      setSearchTerm('')
      setErrorMessage(null)
    }
  }, [open, currentTeacherId])

  // Filtered Teachers
  const filteredTeachers = useMemo(() => {
    return teacherList.filter((t) => {
      const matchesName = t.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDept = (t.department || '').toLowerCase().includes(searchTerm.toLowerCase())
      return matchesName || matchesDept
    })
  }, [teacherList, searchTerm])

  const handleAssign = () => {
    if (!sectionId || !selectedTeacherId) return

    setErrorMessage(null)
    assignTeacherMutation.mutate(
      { teacher_id: selectedTeacherId },
      {
        onSuccess: () => {
          onClose()
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || err?.message || 'Failed to assign class teacher.'
          setErrorMessage(message)
        },
      }
    )
  }

  if (!open) return null

  // Check assignment conflict for selected teacher
  const selectedTeacherObj = teacherList.find((t) => t.id === selectedTeacherId)
  const isConflict =
    selectedTeacherObj?.assigned_classes &&
    selectedTeacherObj.assigned_classes.length > 0 &&
    selectedTeacherId !== currentTeacherId

  const conflictMessage = isConflict
    ? `This teacher is currently assigned to another section (${selectedTeacherObj.assigned_classes.join(', ')}). Assigning them here will transfer their class teacher access and automatically unassign them from their previous section.`
    : null

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-brand-soft text-brand-primary flex items-center justify-center font-bold">
              <UserCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-urbanist text-navy-main">
                Assign Class Teacher
              </h3>
              <p className="text-xs font-sans text-slate-500">
                Select a faculty member to assign to {sectionName}.
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
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMessage && <FormAlert error={errorMessage} />}
          {conflictMessage && <FormAlert error={conflictMessage} />}

          {/* Search Box */}
          <div className="relative">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search teacher by name or department..."
              className="w-full h-10 pl-9 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 font-sans focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Teachers List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {isTeachersLoading ? (
              <div className="py-8 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-2">
                <Loader2 className="size-6 text-brand-primary animate-spin" />
                <span>Loading faculty members...</span>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="py-8 text-center text-slate-500 font-sans text-xs">
                No teachers found matching "{searchTerm}".
              </div>
            ) : (
              filteredTeachers.map((t) => {
                const isSelected = selectedTeacherId === t.id
                const isCurrent = currentTeacherId === t.id
                const hasAssignedClasses =
                  t.assigned_classes && t.assigned_classes.length > 0 && !isCurrent

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTeacherId(t.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-brand-soft/60 border-brand-primary shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-full bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center font-urbanist shrink-0">
                        {t.full_name ? t.full_name.charAt(0) : 'T'}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm font-urbanist text-navy-main truncate">
                            {t.full_name}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-blue-100 text-brand-primary rounded-md text-[10px] font-bold uppercase font-urbanist">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-sans text-slate-500 truncate">
                          {t.department || 'Faculty'}{' '}
                          {hasAssignedClasses && (
                            <span className="text-rose-600 font-medium">
                              • Assigned: {t.assigned_classes?.join(', ')}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`size-6 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-brand-primary border-brand-primary text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={assignTeacherMutation.isPending}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold font-urbanist transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={!selectedTeacherId || assignTeacherMutation.isPending}
            className="px-6 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-hover disabled:opacity-50 text-xs font-semibold font-urbanist shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            {assignTeacherMutation.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            <span>Assign Teacher</span>
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
