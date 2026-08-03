import { useState } from 'react'
import { Bell, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NotificationsHeader } from '../components/NotificationsHeader'
import { NotificationsFilterBar } from '../components/NotificationsFilterBar'
import { NotificationCard } from '../components/NotificationCard'
import { NotificationDetailModal } from '../components/NotificationDetailModal'
import { DeleteConfirmModal } from '@/components/ui/delete-modal'
import { useNotifications } from '../api/useNotifications'
import { useUnreadNotificationCount } from '../api/useUnreadNotificationCount'
import { useMarkAllNotificationsRead } from '../api/useMarkAllNotificationsRead'
import { useDeleteNotification } from '../api/useDeleteNotification'
import { useNotificationSocket } from '../hooks/useNotificationSocket'
import type { NotificationItem, NotificationType } from '../types/notifications.types'

export default function NotificationsPage() {
  // Listen for real-time Socket.io notification broadcasts
  useNotificationSocket()

  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<NotificationType | 'ALL'>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL')
  const [page, setPage] = useState(1)

  const [detailNotificationId, setDetailNotificationId] = useState<string | null>(null)
  const [deletingNotification, setDeletingNotification] = useState<NotificationItem | null>(null)

  // Query parameters mapping
  const queryParams = {
    page,
    limit: 10,
    search: search.trim() || undefined,
    type: selectedType !== 'ALL' ? selectedType : undefined,
    is_read: selectedStatus === 'UNREAD' ? 'false' : selectedStatus === 'READ' ? 'true' : undefined,
  }

  const { data, isLoading, isError, refetch } = useNotifications(queryParams)
  const { data: unreadData } = useUnreadNotificationCount()
  const markAllReadMutation = useMarkAllNotificationsRead()
  const deleteMutation = useDeleteNotification()

  const notificationsList = data?.notifications || []
  const unreadCount = unreadData?.unread_count ?? data?.unread_count ?? 0
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate()
  }

  const handleDeleteConfirm = () => {
    if (!deletingNotification) return
    deleteMutation.mutate(deletingNotification.id, {
      onSuccess: () => {
        setDeletingNotification(null)
      },
    })
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
        isMarkingRead={markAllReadMutation.isPending}
      />

      {/* Filter Toolbar */}
      <NotificationsFilterBar
        search={search}
        setSearch={setSearch}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Content List Section */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <Loader2 className="size-8 text-brand-primary animate-spin" />
          <span>Loading notifications...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-rose-700 font-sans space-y-3 bg-white border border-rose-200 rounded-2xl shadow-xs">
          <AlertCircle className="size-8 text-rose-600 mx-auto" />
          <p className="font-semibold text-sm">Failed to load notifications.</p>
          <Button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
          >
            Retry
          </Button>
        </div>
      ) : notificationsList.length === 0 ? (
        <div className="p-16 text-center text-slate-500 font-sans space-y-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="size-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bell className="size-7" />
          </div>
          <h3 className="text-lg font-bold font-urbanist text-slate-800">No Notifications Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You’re all caught up! There are no notifications matching your current filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificationsList.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onViewDetail={(id) => setDetailNotificationId(id)}
              onDelete={(n) => setDeletingNotification(n)}
            />
          ))}

          {/* Pagination Bar */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 text-xs font-semibold text-slate-600">
              <span>
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-9 px-3 rounded-lg"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-9 px-3 rounded-lg"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notificationId={detailNotificationId}
        onClose={() => setDetailNotificationId(null)}
      />

      {/* Delete Confirmation Modal Reused */}
      <DeleteConfirmModal
        open={Boolean(deletingNotification)}
        onClose={() => setDeletingNotification(null)}
        title="Delete Notification"
        description="Are you sure you want to delete this notification alert? This action cannot be undone."
        itemName={deletingNotification?.title || ''}
        itemCategory="Notification"
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
        error={deleteMutation.error}
      />
    </div>
  )
}
