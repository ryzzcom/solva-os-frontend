import React from 'react'
import { ChevronRight, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotificationsHeaderProps {
  unreadCount?: number
  onMarkAllRead?: () => void
  isMarkingRead?: boolean
}

export const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  unreadCount = 0,
  onMarkAllRead,
  isMarkingRead = false,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <span>Principal Dashboard.</span>
        <ChevronRight className="size-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">Notifications</span>
      </div>

      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-urbanist">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-brand-primary border border-blue-100 text-xs font-semibold font-sans">
                Unread: {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 max-w-2xl font-sans">
            Stay updated with real-time school announcements, attendance alerts, PTM schedules, and system updates.
          </p>
        </div>

        {/* Mark All as Read Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={onMarkAllRead}
            disabled={isMarkingRead || unreadCount === 0}
            className="h-11 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCheck className="size-4 text-brand-primary" />
            <span>Mark all as read</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
