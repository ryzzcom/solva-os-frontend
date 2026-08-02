import React from 'react'
import { Calendar, BookOpen, Pencil, Trash2 } from 'lucide-react'
import type { AnnouncementItem } from '../types/announcements.types'

interface AnnouncementCardProps {
  announcement: AnnouncementItem
  onEdit?: (announcement: AnnouncementItem) => void
  onDelete?: (announcement: AnnouncementItem) => void
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onEdit,
  onDelete,
}) => {
  const getBadgeStyle = (audience: string) => {
    switch (audience) {
      case 'TEACHER':
        return {
          label: 'Teachers',
          className: 'bg-amber-100/80 text-amber-700 font-semibold px-3.5 py-1 rounded-lg text-xs',
        }
      case 'STUDENT':
        return {
          label: 'All Students',
          className: 'bg-blue-100/70 text-blue-600 font-semibold px-3.5 py-1 rounded-lg text-xs',
        }
      case 'ALL':
      default:
        return {
          label: 'All',
          className: 'bg-blue-100/70 text-blue-600 font-semibold px-3.5 py-1 rounded-lg text-xs',
        }
    }
  }

  const badgeInfo = getBadgeStyle(announcement.audience)

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Header: Badge, Date, Action Buttons */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className={badgeInfo.className}>{badgeInfo.label}</span>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="size-3.5 text-slate-400" />
            <span>{announcement.date}</span>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(announcement)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-primary hover:bg-slate-50 transition-colors"
            title="Edit Announcement"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(announcement)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Announcement"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 font-urbanist mt-3 tracking-tight">
        {announcement.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
        {announcement.description}
      </p>

      {/* Footer Info: Class and Section */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-4">
        <BookOpen className="size-4 text-slate-400" />
        <span>
          {announcement.class_name} • {announcement.section_name}
        </span>
      </div>
    </div>
  )
}

export default AnnouncementCard
