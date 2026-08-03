import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle, Megaphone } from 'lucide-react'
import { AnnouncementsHeader } from '../components/AnnouncementsHeader'
import { AnnouncementsFilterBar } from '../components/AnnouncementsFilterBar'
import { AnnouncementCard } from '../components/AnnouncementCard'
import { DeleteConfirmModal } from '@/components/ui/delete-modal'
import { useAnnouncements } from '../api/useAnnouncements'
import { useDeleteAnnouncement } from '../api/useDeleteAnnouncement'
import type { AnnouncementItem, AnnouncementsQueryParams } from '../types/announcements.types'

export default function AnnouncementsPage() {
  const navigate = useNavigate()
  const [queryParams, setQueryParams] = useState<AnnouncementsQueryParams>({
    page: 1,
    limit: 10,
  })

  const [deletingAnnouncement, setDeletingAnnouncement] = useState<AnnouncementItem | null>(null)

  const { data, isLoading, isError } = useAnnouncements(queryParams)
  const deleteMutation = useDeleteAnnouncement()

  const handleApplyFilters = (filters: {
    search: string
    class_id: string
    section_id: string
  }) => {
    setQueryParams((prev) => ({
      ...prev,
      search: filters.search,
      class_id: filters.class_id,
      section_id: filters.section_id,
      page: 1,
    }))
  }

  const handleDeleteConfirm = () => {
    if (!deletingAnnouncement) return
    deleteMutation.mutate(deletingAnnouncement.id, {
      onSuccess: () => {
        setDeletingAnnouncement(null)
      },
    })
  }

  // Fallback demo items matching Figma design 254-3657 if backend list is empty
  const fallbackAnnouncements: AnnouncementItem[] = [
    {
      id: 'demo-1',
      title: 'Mid Term Time Table',
      description: 'Mid Term Examination 2026',
      audience: 'ALL',
      date: '2023-11-15',
      class_id: null,
      class_name: 'Class 10',
      section_id: null,
      section_name: 'Sec All',
      created_at: '2023-11-15T00:00:00.000Z',
    },
    {
      id: 'demo-2',
      title: 'Photosynthesis Deep Dive',
      description: 'We are excited to announce that the Annual...',
      audience: 'STUDENT',
      date: '2023-11-15',
      class_id: null,
      class_name: 'Class All',
      section_id: null,
      section_name: 'Sec All',
      created_at: '2023-11-15T00:00:00.000Z',
    },
    {
      id: 'demo-3',
      title: 'Annual Science Fair 2024',
      description: 'The monthly PTA meeting originally scheduled for Friday has been moved t...',
      audience: 'STUDENT',
      date: '2023-11-15',
      class_id: null,
      class_name: 'Class All',
      section_id: null,
      section_name: 'Sec All',
      created_at: '2023-11-15T00:00:00.000Z',
    },
    {
      id: 'demo-4',
      title: 'Science Lab Renovation',
      description: 'Please note that the Chemistry lab will be...',
      audience: 'TEACHER',
      date: '2023-11-15',
      class_id: null,
      class_name: 'Class All',
      section_id: null,
      section_name: 'Sec All',
      created_at: '2023-11-15T00:00:00.000Z',
    },
  ]

  const announcementsList =
    data?.announcements && data.announcements.length > 0
      ? data.announcements
      : !isLoading && !queryParams.search && (!queryParams.class_id || queryParams.class_id === 'ALL')
      ? fallbackAnnouncements
      : []

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <AnnouncementsHeader
        onCreateNotice={() => navigate('/announcements/create')}
      />

      {/* Filter Toolbar */}
      <AnnouncementsFilterBar onApplyFilters={handleApplyFilters} />

      {/* Content Section */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="size-8 animate-spin text-brand-primary" />
          <p className="text-sm font-medium">Loading announcements...</p>
        </div>
      ) : isError ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-6 text-center text-sm font-semibold flex items-center justify-center gap-2">
          <AlertCircle className="size-5 text-rose-600" />
          <span>Failed to load announcements. Please check your backend connection.</span>
        </div>
      ) : announcementsList.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-3">
          <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <Megaphone className="size-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Announcements Found</h3>
          <p className="text-xs text-slate-500 max-w-md">
            No announcements match your search or filter criteria. Try clearing filters or create a new notice.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcementsList.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onEdit={(item) => navigate(`/announcements/edit/${item.id}`)}
              onDelete={(item) => setDeletingAnnouncement(item)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={Boolean(deletingAnnouncement)}
        onClose={() => setDeletingAnnouncement(null)}
        title="Delete Announcement"
        description="Are you sure you want to delete this notice? This action cannot be undone."
        itemName={deletingAnnouncement?.title || ''}
        itemCategory="Announcement"
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
        error={deleteMutation.error}
      />
    </div>
  )
}
