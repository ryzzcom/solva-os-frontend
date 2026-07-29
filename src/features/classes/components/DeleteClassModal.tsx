import React from 'react'
import { DeleteConfirmModal } from '@/components/ui/delete-modal'
import { useDeleteClass } from '../api/useDeleteClass'

interface DeleteClassModalProps {
  open: boolean
  onClose: () => void
  classId?: string
  className?: string
  sectionsCount?: number
  totalStudents?: number
}

export const DeleteClassModal: React.FC<DeleteClassModalProps> = ({
  open,
  onClose,
  classId,
  className = 'Class Level',
  sectionsCount,
  totalStudents,
}) => {
  const deleteClassMutation = useDeleteClass()

  const handleDelete = () => {
    if (classId) {
      deleteClassMutation.mutate(classId, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  const categoryText = [
    sectionsCount !== undefined ? `${sectionsCount} Sections` : '',
    totalStudents !== undefined ? `${totalStudents} Students` : '',
  ]
    .filter(Boolean)
    .join(' • ')

  return (
    <DeleteConfirmModal
      open={open && Boolean(classId)}
      onClose={onClose}
      title="Delete Academic Class"
      description="Are you sure you want to delete this class level? This action will archive the class and its associated section configurations."
      itemName={className}
      itemCategory={categoryText || 'Academic Grade Level'}
      onConfirm={handleDelete}
      isPending={deleteClassMutation.isPending}
      error={deleteClassMutation.error as Error}
    />
  )
}
