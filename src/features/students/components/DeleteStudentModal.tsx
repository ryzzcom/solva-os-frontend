import React from 'react'
import { DeleteConfirmModal } from '@/components/ui/delete-modal'
import { useDeleteStudent } from '../api/useDeleteStudent'

interface DeleteStudentModalProps {
  open: boolean
  onClose: () => void
  studentId: string
  studentName?: string
  className?: string
  sectionName?: string
}

export const DeleteStudentModal: React.FC<DeleteStudentModalProps> = ({
  open,
  onClose,
  studentId,
  studentName = 'Student',
  className = 'N/A',
  sectionName = 'N/A',
}) => {
  const deleteStudentMutation = useDeleteStudent()

  const handleDelete = () => {
    deleteStudentMutation.mutate(studentId)
  }

  return (
    <DeleteConfirmModal
      open={open}
      onClose={onClose}
      title="Delete Student"
      description="Are you sure you want to delete this student? This action cannot be undone and all associated data, including attendance, fees, and records, will be permanently removed."
      itemName={studentName}
      itemCategory={`Grade ${className} - Section ${sectionName}`}
      onConfirm={handleDelete}
      isPending={deleteStudentMutation.isPending}
      error={deleteStudentMutation.error as Error}
    />
  )
}
