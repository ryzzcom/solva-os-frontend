import React from 'react'
import { createPortal } from 'react-dom'
import { X, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { useDeleteTeacher } from '../api/useDeleteTeacher'

interface DeleteTeacherModalProps {
  open: boolean
  onClose: () => void
  teacherId?: string
  teacherName?: string
  departmentName?: string
}

export const DeleteTeacherModal: React.FC<DeleteTeacherModalProps> = ({
  open,
  onClose,
  teacherId,
  teacherName = 'Faculty Member',
  departmentName = 'Faculty',
}) => {
  const deleteTeacherMutation = useDeleteTeacher()

  if (!open || !teacherId) return null

  const handleDelete = () => {
    deleteTeacherMutation.mutate(teacherId)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-[20px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 p-6 md:p-8 space-y-6 text-center relative">
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={deleteTeacherMutation.isPending}
          className="absolute top-4 right-4 size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="size-4" />
        </button>

        {/* Header Icon Badge */}
        <div className="size-16 md:size-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border-4 border-rose-50 shadow-sm">
          <Trash2 className="size-8 md:size-9" />
        </div>

        {/* Text Heading & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-urbanist text-[#0f172a]">
            Delete Teacher Account
          </h2>
          <p className="text-sm font-sans text-slate-500 max-w-md mx-auto leading-relaxed">
            Are you sure you want to delete this teacher account? This action cannot be undone and all associated teaching schedules, records, and assignments will be permanently removed.
          </p>
        </div>

        {/* Highlighted Callout Box */}
        <div className="bg-rose-50/80 border border-rose-200/80 rounded-xl p-4 text-center space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 font-urbanist block">
            You are about to delete:
          </span>
          <p className="text-base font-bold font-urbanist text-slate-900">
            {teacherName}{' '}
            <span className="text-slate-600 font-normal text-sm">
              ({departmentName})
            </span>
          </p>
        </div>

        {/* API Error Display */}
        {deleteTeacherMutation.isError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="size-4 text-rose-600 shrink-0" />
            <span>
              {deleteTeacherMutation.error?.message || 'Failed to delete teacher account. Please try again.'}
            </span>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteTeacherMutation.isPending}
            className="w-full h-11 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold font-urbanist bg-white hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteTeacherMutation.isPending}
            className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold font-urbanist transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {deleteTeacherMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Teacher'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
