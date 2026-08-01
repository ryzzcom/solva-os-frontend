import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Plus,
  Loader2,
  AlertCircle,
  CalendarDays,
  SquarePen,
  Trash2,
} from 'lucide-react'
import { HasRole } from '@/components/auth/HasRole'
import { useHolidaysStats, useHolidaysList } from '../api/useHolidays'
import type { HolidayItem, HolidayStatus } from '../types/holidays.types'
import { formatDateToReadable } from '@/lib/dateUtils'
import { HolidayManagementTab } from '../components/HolidayManagementTab'

export const HolidaysPage: React.FC = () => {
  const navigate = useNavigate()
  // Navigation tab state ('overview' | 'management')
  const [activeTab, setActiveTab] = useState<'overview' | 'management'>('overview')

  // Fetch KPI stats & holidays list
  const {
    data: statsData,
    isLoading: isStatsLoading,
  } = useHolidaysStats()

  const {
    data: listData,
    isLoading: isListLoading,
    isError: isListError,
    refetch: refetchList,
  } = useHolidaysList()

  const kpiCards = statsData?.kpi_cards || {
    total_working_days: 240,
    total_holidays: 12,
    next_holiday: 'Easter Break',
    days_remaining_for_holiday: 84,
  }

  const holidaysList = listData?.holidays || []

  // Status badge pill renderer
  const renderStatusBadge = (status: HolidayStatus | string) => {
    const normStatus = (status || '').toLowerCase()

    if (normStatus === 'completed' || normStatus === 'past') {
      return (
        <span className="px-3.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold font-sans">
          Completed
        </span>
      )
    }

    if (normStatus === 'upcoming') {
      return (
        <span className="px-3.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold font-sans">
          Upcoming
        </span>
      )
    }

    return (
      <span className="px-3.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold font-sans">
        {status || 'Scheduled'}
      </span>
    )
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Breadcrumbs & Title */}
      <div className="space-y-4">
        {/* Breadcrumb Row */}
        <div className="flex items-center gap-2 text-xs md:text-sm font-sans text-slate-500">
          <span>Principal Dashboard.</span>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-semibold text-navy-main font-urbanist">Holidays</span>
        </div>

        {/* Title Banner & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-navy-main">
              Holiday Management
            </h1>
            <p className="text-sm font-sans text-slate-600 max-w-2xl">
              Define academic breaks, observed holidays, and special institutional closures for the current academic term.
            </p>
          </div>

          {/* Add Holidays Action Button guarded with HasRole */}
          <HasRole allowedRoles={['SUPER_ADMIN', 'PRINCIPAL']}>
            <button
              type="button"
              onClick={() => navigate('/holidays/add')}
              className="px-5 h-11 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-urbanist font-semibold text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Add Holidays</span>
            </button>
          </HasRole>
        </div>
      </div>

      {/* 2. Top Bento Grid Stats Cards (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Holidays This Term */}
        <div className="bg-white border-l-4 border-l-brand-primary border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Total Holidays This Term
          </span>
          <p className="text-3xl font-bold font-urbanist text-brand-primary mt-3">
            {isStatsLoading ? '...' : kpiCards.total_holidays}
          </p>
        </div>

        {/* Card 2: Next Holiday */}
        <div className="bg-white border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Next Holiday
          </span>
          <p className="text-2xl font-bold font-urbanist text-navy-main mt-3 truncate">
            {isStatsLoading ? '...' : kpiCards.next_holiday}
          </p>
        </div>

        {/* Card 3: Days Remaining */}
        <div className="bg-white border-l-4 border-l-accent-orange border border-card-border rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <span className="text-sm font-sans text-slate-600">
            Days Remaining
          </span>
          <p className="text-3xl font-bold font-urbanist text-accent-orange mt-3">
            {isStatsLoading ? '...' : `${kpiCards.days_remaining_for_holiday} Days`}
          </p>
        </div>
      </div>

      {/* 3. Navigation Tabs & Table Section */}
      <div className="space-y-6">
        {/* Tab Navigation Row */}
        <div className="border-b border-card-border flex gap-8 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-base font-semibold font-urbanist transition-colors relative cursor-pointer ${
              activeTab === 'overview'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('management')}
            className={`pb-3 text-base font-semibold font-urbanist transition-colors relative cursor-pointer ${
              activeTab === 'management'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Management
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'management' ? (
          <HolidayManagementTab />
        ) : (
          /* Roster Table Container */
          <div className="bg-white border border-card-border rounded-2xl shadow-xs overflow-hidden">
          {isListLoading ? (
            <div className="p-12 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-3">
              <Loader2 className="size-8 text-brand-primary animate-spin" />
              <span>Loading academic holidays...</span>
            </div>
          ) : isListError ? (
            <div className="p-8 text-center text-rose-700 font-sans space-y-3">
              <AlertCircle className="size-8 text-rose-600 mx-auto" />
              <p className="font-semibold text-sm">Failed to load holidays list.</p>
              <button
                type="button"
                onClick={() => refetchList()}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : holidaysList.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-sans text-sm space-y-2">
              <CalendarDays className="size-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No holidays scheduled for this term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-card-border bg-slate-50/70 text-xs font-bold font-urbanist text-slate-600 uppercase tracking-wider">
                    <th className="py-4 px-6">Holiday Name</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Start Date</th>
                    <th className="py-4 px-6">End Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {holidaysList.map((item: HolidayItem) => (
                    <tr
                      key={item.holiday_id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* 1. Holiday Name */}
                      <td className="py-4.5 px-6 font-bold text-sm font-urbanist text-navy-main">
                        {item.name}
                      </td>

                      {/* 2. Type */}
                      <td className="py-4.5 px-6 text-xs font-medium font-sans text-slate-600">
                        {item.type || 'National'}
                      </td>

                      {/* 3. Start Date */}
                      <td className="py-4.5 px-6 text-xs font-medium font-sans text-slate-600">
                        {formatDateToReadable(item.start_date)}
                      </td>

                      {/* 4. End Date */}
                      <td className="py-4.5 px-6 text-xs font-medium font-sans text-slate-600">
                        {formatDateToReadable(item.end_date)}
                      </td>

                      {/* 5. Status */}
                      <td className="py-4.5 px-6">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* 6. Action Column guarded with HasRole */}
                      <td className="py-4.5 px-6 text-right">
                        <HasRole allowedRoles={['SUPER_ADMIN', 'PRINCIPAL']}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              className="p-1.5 text-slate-400 hover:text-brand-primary transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
                              title="Edit Holiday"
                            >
                              <SquarePen className="size-4" />
                            </button>
                            <button
                              type="button"
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
                              title="Delete Holiday"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </HasRole>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  )
}

export default HolidaysPage
