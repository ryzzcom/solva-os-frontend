import React from 'react'
import { DeleteConfirmModal } from '@/components/ui/delete-modal'
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

  const handleDelete = () => {
    if (teacherId) {
      deleteTeacherMutation.mutate(teacherId)
    }
  }

  return (
    <DeleteConfirmModal
      open={open && Boolean(teacherId)}
      onClose={onClose}
      title="Delete Teacher Account"
      description="Are you sure you want to delete this teacher account? This action cannot be undone and all associated teaching schedules, records, and assignments will be permanently removed."
      itemName={teacherName}
      itemCategory={departmentName}
      onConfirm={handleDelete}
      isPending={deleteTeacherMutation.isPending}
      error={deleteTeacherMutation.error as Error}
    />
  )
}
