import React from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { NotificationType } from '../types/notifications.types'

interface NotificationsFilterBarProps {
  search: string
  setSearch: (val: string) => void
  selectedType: string
  setSelectedType: (type: NotificationType | 'ALL') => void
  selectedStatus: string
  setSelectedStatus: (status: 'ALL' | 'UNREAD' | 'READ') => void
}

export const NotificationsFilterBar: React.FC<NotificationsFilterBarProps> = ({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus-visible:border-brand-primary"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Type & Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="h-11 pl-4 pr-9 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 appearance-none cursor-pointer focus:outline-none focus:border-brand-primary transition-all"
            >
              <option value="ALL">All Categories</option>
              <option value="ANNOUNCEMENT">Announcements</option>
              <option value="ATTENDANCE">Attendance</option>
              <option value="HOMEWORK">Homework</option>
              <option value="LEAVE_REQUEST">Leave Requests</option>
              <option value="PTM">PTM</option>
              <option value="SYSTEM">System</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Tabs (All, Unread, Read) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setSelectedStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-urbanist transition-all cursor-pointer ${
                selectedStatus === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('UNREAD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-urbanist transition-all cursor-pointer ${
                selectedStatus === 'UNREAD'
                  ? 'bg-white text-brand-primary shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Unread
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('READ')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-urbanist transition-all cursor-pointer ${
                selectedStatus === 'READ'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Read
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
