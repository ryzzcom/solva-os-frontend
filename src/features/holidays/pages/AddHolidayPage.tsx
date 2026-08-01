import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, ArrowLeft, Save, Loader2, Calendar } from 'lucide-react'
import { CustomSelect } from '@/components/ui/select'
import { HasRole } from '@/components/auth/HasRole'
import { holidaySchema, type HolidayFormValues } from '../schemas/holidaySchema'
import { useCreateHoliday } from '../api/useHolidays'

const HOLIDAY_TYPE_OPTIONS = [
  { value: 'Seasonal', label: 'Seasonal' },
  { value: 'Religious', label: 'Religious' },
  { value: 'National', label: 'National' },
]

export const AddHolidayPage: React.FC = () => {
  const navigate = useNavigate()
  const createHolidayMutation = useCreateHoliday()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HolidayFormValues>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: '',
      type: 'Seasonal',
      description: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      is_recurring: false,
    },
  })

  const isRecurring = watch('is_recurring')

  const onSubmit = async (data: HolidayFormValues) => {
    try {
      setSubmitError(null)
      await createHolidayMutation.mutateAsync(data)
      navigate('/holidays')
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || 'Failed to create holiday entry.')
    }
  }

  return (
    <HasRole allowedRoles={['SUPER_ADMIN', 'PRINCIPAL']}>
      <div className="space-y-8 pb-16 animate-in fade-in duration-300 max-w-5xl mx-auto">
        {/* 1. Header Breadcrumbs Navigation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs md:text-sm font-sans text-slate-500">
            <button
              type="button"
              onClick={() => navigate('/holidays')}
              className="hover:text-brand-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="size-3.5" />
              <span>Holidays</span>
            </button>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="font-semibold text-navy-main font-urbanist">Add Holidays</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-urbanist text-navy-main">
              Add New Holiday
            </h1>
            <p className="text-sm font-sans text-slate-600">
              Define academic breaks, public holidays, and emergency closures for the academic year.
            </p>
          </div>
        </div>

        {submitError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl font-sans text-sm font-semibold">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 2. Basic Details Card */}
          <div className="bg-white border border-card-border rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-bold font-urbanist text-navy-main border-b border-slate-100 pb-4">
              Basic Details
            </h2>

            <div className="space-y-5">
              {/* Holiday Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold font-urbanist text-slate-800 block">
                  Holiday Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Winter Break 2024"
                  {...register('name')}
                  className="w-full h-11 px-4 rounded-xl border border-card-border bg-white text-sm font-sans text-slate-800 focus:outline-none focus:border-brand-primary transition-all"
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 font-sans">{errors.name.message}</p>
                )}
              </div>

              {/* Holiday Type Select */}
              <div className="space-y-2">
                <label className="text-sm font-bold font-urbanist text-slate-800 block">
                  Holiday Type
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      options={HOLIDAY_TYPE_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select holiday type..."
                    />
                  )}
                />
                {errors.type && (
                  <p className="text-xs text-rose-600 font-sans">{errors.type.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold font-urbanist text-slate-800 block">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter details about the holiday or closure reason..."
                  {...register('description')}
                  className="w-full p-4 rounded-xl border border-card-border bg-white text-sm font-sans text-slate-800 focus:outline-none focus:border-brand-primary transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Schedule Card */}
          <div className="bg-white border border-card-border rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-bold font-urbanist text-navy-main border-b border-slate-100 pb-4">
              Schedule
            </h2>

            <div className="space-y-6">
              {/* Date Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-bold font-urbanist text-slate-800 flex items-center gap-1.5">
                    <Calendar className="size-4 text-brand-primary" />
                    <span>Start Date</span>
                  </label>
                  <input
                    type="date"
                    {...register('start_date')}
                    className="w-full h-11 px-4 rounded-xl border border-card-border bg-white text-sm font-sans text-slate-800 focus:outline-none focus:border-brand-primary transition-all cursor-pointer"
                  />
                  {errors.start_date && (
                    <p className="text-xs text-rose-600 font-sans">{errors.start_date.message}</p>
                  )}
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-sm font-bold font-urbanist text-slate-800 flex items-center gap-1.5">
                    <Calendar className="size-4 text-brand-primary" />
                    <span>End Date</span>
                  </label>
                  <input
                    type="date"
                    {...register('end_date')}
                    className="w-full h-11 px-4 rounded-xl border border-card-border bg-white text-sm font-sans text-slate-800 focus:outline-none focus:border-brand-primary transition-all cursor-pointer"
                  />
                  {errors.end_date && (
                    <p className="text-xs text-rose-600 font-sans">{errors.end_date.message}</p>
                  )}
                </div>
              </div>

              {/* Recurring Yearly Toggle Row */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-0.5">
                  <span className="font-bold text-base font-urbanist text-navy-main block">
                    Recurring Yearly
                  </span>
                  <span className="text-xs font-sans text-slate-500 block">
                    Automatically repeat this holiday every year
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isRecurring}
                  onClick={() => setValue('is_recurring', !isRecurring)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isRecurring ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isRecurring ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Form Actions Footer */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/holidays')}
              className="px-6 h-11 border border-card-border rounded-xl font-urbanist font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createHolidayMutation.isPending}
              className="px-8 h-11 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-urbanist font-bold text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {createHolidayMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4 stroke-[2.5]" />
              )}
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </HasRole>
  )
}

export default AddHolidayPage
