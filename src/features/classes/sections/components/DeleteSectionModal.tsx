import React from 'react'
import { DeleteConfirmModal } from '@/components/ui/delete-modal'
import { useDeleteSection } from '../api/useDeleteSection'

interface DeleteSectionModalProps {
  open: boolean
  onClose: () => void
  sectionId?: string
  sectionName?: string
  className?: string
  currentStudents?: number
  classId?: string
}

export const DeleteSectionModal: React.FC<DeleteSectionModalProps> = ({
  open,
  onClose,
  sectionId,
  sectionName = 'Section',
  className = 'Class Level',
  currentStudents,
  classId,
}) => {
  const deleteSectionMutation = useDeleteSection(classId)

  const handleDelete = () => {
    if (sectionId) {
      deleteSectionMutation.mutate(sectionId, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  const categoryText = [
    className ? `Belongs to ${className}` : '',
    currentStudents !== undefined ? `${currentStudents} Enrolled Students` : '',
  ]
    .filter(Boolean)
    .join(' • ')

  return (
    <DeleteConfirmModal
      open={open && Boolean(sectionId)}
      onClose={onClose}
      title="Delete Academic Section"
      description="Are you sure you want to delete this section? This action will archive the section configuration and unassign its class teacher."
      itemName={sectionName}
      itemCategory={categoryText || 'Academic Section'}
      onConfirm={handleDelete}
      isPending={deleteSectionMutation.isPending}
      error={deleteSectionMutation.error as Error}
    />
  )
}
