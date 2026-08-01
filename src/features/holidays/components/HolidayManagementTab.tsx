import React, { useState, useEffect } from 'react'
import { Save, Loader2, AlertCircle, Check } from 'lucide-react'
import { HasRole } from '@/components/auth/HasRole'
import { useWeeklySchedule, useUpdateWeeklySchedule } from '../api/useHolidays'
import type { WeeklyScheduleMap } from '../types/holidays.types'

const DAYS_CONFIG: { key: keyof WeeklyScheduleMap; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

export const HolidayManagementTab: React.FC = () => {
  const { data: scheduleData, isLoading, isError, refetch } = useWeeklySchedule()
  const updateScheduleMutation = useUpdateWeeklySchedule()

  const [scheduleState, setScheduleState] = useState<WeeklyScheduleMap>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  })

  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false)

  // Sync state when backend query completes
  useEffect(() => {
    if (scheduleData?.schedule) {
      setScheduleState(scheduleData.schedule)
    }
  }, [scheduleData])

  const handleToggleDay = (key: keyof WeeklyScheduleMap) => {
    setScheduleState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Calculate live summary metrics
  const workingDaysCount = Object.values(scheduleState).filter(Boolean).length
  const holidaysCount = 7 - workingDaysCount
  const monthlyAvgDays = Math.round((workingDaysCount * 52) / 12)

  const handleSave = async () => {
    try {
      await updateScheduleMutation.mutateAsync(scheduleState)
      setSaveSuccessMsg(true)
      setTimeout(() => setSaveSuccessMsg(false), 3000)
    } catch (err) {
      console.error('Failed to update weekly schedule:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-3">
        <Loader2 className="size-8 text-brand-primary animate-spin" />
        <span>Loading weekly schedule configuration...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-center font-sans space-y-3">
        <AlertCircle className="size-8 text-rose-600 mx-auto" />
        <p className="font-semibold text-sm">Failed to load weekly schedule configuration.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-sans text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="size-5 text-emerald-600" />
          <span>Weekly schedule configuration updated successfully!</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Weekly Schedule Card (2 Columns Span) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-card-border rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="text-xl md:text-2xl font-bold font-urbanist text-navy-main border-b border-slate-100 pb-4">
              Weekly Schedule
            </h2>

            {/* List of 7 Days */}
            <div className="divide-y divide-slate-100">
              {DAYS_CONFIG.map(({ key, label }) => {
                const isWorking = scheduleState[key]

                return (
                  <div
                    key={key}
                    className="py-4 flex items-center justify-between gap-4"
                  >
                    <span className="font-bold text-base font-urbanist text-slate-800">
                      {label}
                    </span>

                    {/* Smooth Custom Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isWorking}
                      onClick={() => handleToggleDay(key)}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isWorking ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isWorking ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Save Action Button Row */}
          <div className="flex items-center justify-end">
            <HasRole allowedRoles={['SUPER_ADMIN', 'PRINCIPAL']}>
              <button
                type="button"
                disabled={updateScheduleMutation.isPending}
                onClick={handleSave}
                className="px-8 h-11 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-urbanist font-bold text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updateScheduleMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4 stroke-[2.5]" />
                )}
                <span>Save</span>
              </button>
            </HasRole>
          </div>
        </div>

        {/* Right Column: CONFIGURATION SUMMARY Card (1 Column Span) */}
        <div className="bg-white border border-card-border rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-xs font-bold font-urbanist uppercase tracking-wider text-slate-600">
            CONFIGURATION SUMMARY
          </h3>

          {/* Top 2 Stat Boxes Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Working Days Box */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <p className="text-3xl font-bold font-urbanist text-brand-primary">
                {workingDaysCount}
              </p>
              <span className="text-xs font-sans text-slate-500 block leading-tight">
                Working Days
              </span>
            </div>

            {/* Holidays Box */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <p className="text-3xl font-bold font-urbanist text-accent-orange">
                {holidaysCount}
              </p>
              <span className="text-xs font-sans text-slate-500 block leading-tight">
                Holidays
              </span>
            </div>
          </div>

          {/* Key Value Metrics Rows */}
          <div className="space-y-4 border-t border-slate-100 pt-6 font-urbanist text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-sans">Total Days / Week</span>
              <span className="font-bold text-navy-main text-base">{workingDaysCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-sans">Monthly Avg.</span>
              <span className="font-bold text-brand-primary text-base">{monthlyAvgDays} Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HolidayManagementTab
