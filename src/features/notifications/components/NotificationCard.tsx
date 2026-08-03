import React from 'react'
import { Megaphone, ClipboardList, Pencil, Calendar, Users, Bell, Eye, Trash2, Clock } from 'lucide-react'
import type { NotificationItem } from '../types/notifications.types'

interface NotificationCardProps {
  notification: NotificationItem
  onViewDetail: (id: string) => void
  onDelete: (notification: NotificationItem) => void
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onViewDetail,
  onDelete,
}) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return {
          icon: Megaphone,
          bg: 'bg-purple-50 text-purple-600 border-purple-100',
          label: 'Announcement',
        }
      case 'ATTENDANCE':
        return {
          icon: ClipboardList,
          bg: 'bg-blue-50 text-brand-primary border-blue-100',
          label: 'Attendance',
        }
      case 'HOMEWORK':
        return {
          icon: Pencil,
          bg: 'bg-amber-50 text-amber-600 border-amber-100',
          label: 'Homework',
        }
      case 'LEAVE_REQUEST':
        return {
          icon: Calendar,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          label: 'Leave Request',
        }
      case 'PTM':
        return {
          icon: Users,
          bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
          label: 'PTM',
        }
      default:
        return {
          icon: Bell,
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          label: 'System Alert',
        }
    }
  }

  const badge = getTypeBadge(notification.type)
  const Icon = badge.icon

  // Format date readable
  const formattedDate = notification.created_at
    ? new Date(notification.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div
      onClick={() => onViewDetail(notification.id)}
      className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group relative overflow-hidden ${
        notification.is_read
          ? 'border-slate-200/80 opacity-80'
          : 'border-blue-200/80 bg-blue-50/20'
      }`}
    >
      {/* Left indicator bar for unread notifications */}
      {!notification.is_read && (
        <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-primary rounded-r-md" />
      )}

      <div className="flex items-start gap-4">
        {/* Type Icon Circle */}
        <div
          className={`size-11 rounded-xl flex items-center justify-center shrink-0 border ${badge.bg} group-hover:scale-105 transition-transform`}
        >
          <Icon className="size-5" />
        </div>

        {/* Content Details */}
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${badge.bg}`}>
              {badge.label}
            </span>

            {!notification.is_read && (
              <span className="size-2 rounded-full bg-brand-primary shrink-0 animate-pulse" />
            )}

            <span className="text-xs text-slate-400 font-medium font-sans flex items-center gap-1 ml-auto sm:ml-0">
              <Clock className="size-3 text-slate-400" />
              {formattedDate}
            </span>
          </div>

          <h3 className="text-base font-bold font-urbanist text-slate-900 leading-snug group-hover:text-brand-primary transition-colors">
            {notification.title}
          </h3>

          <p className="text-sm font-sans text-slate-600 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetail(notification.id)
          }}
          className="size-9 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-brand-primary flex items-center justify-center transition-colors cursor-pointer"
          title="View Details"
        >
          <Eye className="size-4" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(notification)
          }}
          className="size-9 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
          title="Delete Notification"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  )
}
