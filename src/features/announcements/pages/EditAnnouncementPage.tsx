import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ChevronDown, Calendar as CalendarIcon, AlertCircle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useClassesOverviewFull } from '@/features/classes/api/useClasses'
import { createAnnouncementSchema, type CreateAnnouncementInput } from '../schemas/announcementSchema'
import { useAnnouncementDetails } from '../api/useAnnouncementDetails'
import { useUpdateAnnouncement } from '../api/useUpdateAnnouncement'

export default function EditAnnouncementPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [formError, setFormError] = useState<string | null>(null)

  const { data: announcement, isLoading: isDetailsLoading, isError: isDetailsError } = useAnnouncementDetails(id)
  const { data: classesOverview } = useClassesOverviewFull()
  const classesList = classesOverview?.classes_list || []

  const updateMutation = useUpdateAnnouncement(id || '')

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateAnnouncementInput>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: {
      title: '',
      description: '',
      audience: 'STUDENT',
      date: new Date().toISOString().split('T')[0],
      target_class_id: 'ALL',
      target_section_id: 'ALL',
    },
  })

  // Pre-fill form values when announcement data arrives
  useEffect(() => {
    if (announcement) {
      reset({
        title: announcement.title || '',
        description: announcement.description || '',
        audience: announcement.audience || 'ALL',
        date: announcement.date || new Date().toISOString().split('T')[0],
        target_class_id: announcement.class_id || 'ALL',
        target_section_id: announcement.section_id || 'ALL',
      })
    }
  }, [announcement, reset])

  const selectedAudience = watch('audience')
  const selectedClassId = watch('target_class_id')

  // Find sections for current selected class
  const currentSelectedClass = classesList.find((c) => (c.id || (c as any).class_id) === selectedClassId)
  const sectionsList = currentSelectedClass?.sections || []

  const onSubmit = (data: CreateAnnouncementInput) => {
    setFormError(null)

    updateMutation.mutate(data, {
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Failed to update announcement. Please try again.'
        setFormError(message)
      },
      onSuccess: () => {
        navigate('/announcements')
      },
    })
  }

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setValue('target_class_id', val)
    setValue('target_section_id', 'ALL') // Reset section when class changes
  }

  const isTeacherAudience = selectedAudience === 'TEACHER'

  if (isDetailsLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="size-8 animate-spin text-brand-primary" />
        <p className="text-sm font-medium">Loading announcement details...</p>
      </div>
    )
  }

  if (isDetailsError || !announcement) {
    return (
      <div className="p-8 max-w-2xl mx-auto space-y-4 text-center">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-6 font-semibold text-sm flex items-center justify-center gap-2">
          <AlertCircle className="size-5 text-rose-600" />
          <span>Announcement not found or failed to load.</span>
        </div>
        <Button onClick={() => navigate('/announcements')} variant="outline" className="rounded-xl">
          Back to Announcements
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={() => navigate('/announcements')}
          className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Announcements</span>
        </button>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900">Edit Announcement</span>
      </div>

      {/* Main Form Container Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 font-urbanist mb-6 tracking-tight">
          Edit Announcement
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {formError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3.5 text-sm font-semibold animate-in fade-in duration-200 flex items-center gap-2.5">
              <AlertCircle className="size-5 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Notice Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-slate-800">
              Notice Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Annual Science Fair 2024 Schedule"
              className="h-12 rounded-xl border border-slate-200 focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 bg-white text-sm"
              {...register('title')}
            />
            {errors.title && <p className="text-rose-600 text-xs font-medium mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-slate-800">
              Description
            </Label>
            <textarea
              id="description"
              rows={5}
              placeholder="Detailed content of your announcement..."
              className="w-full rounded-xl border border-slate-200 focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 bg-white text-sm resize-none p-4 focus:outline-none focus:border-brand-primary transition-all"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-rose-600 text-xs font-medium mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Row 1: Audience & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audience */}
            <div className="space-y-2">
              <Label htmlFor="audience" className="text-sm font-semibold text-slate-800">
                Audience
              </Label>
              <div className="relative">
                <select
                  id="audience"
                  {...register('audience')}
                  className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 appearance-none cursor-pointer focus:outline-none focus:border-brand-primary transition-all"
                >
                  <option value="STUDENT">All Students</option>
                  <option value="TEACHER">Teachers</option>
                  <option value="ALL">All</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.audience && (
                <p className="text-rose-600 text-xs font-medium mt-1">{errors.audience.message}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold text-slate-800">
                Date
              </Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  className="h-12 rounded-xl border border-slate-200 focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 bg-white text-sm pr-10"
                  {...register('date')}
                />
                <CalendarIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.date && <p className="text-rose-600 text-xs font-medium mt-1">{errors.date.message}</p>}
            </div>
          </div>

          {/* Row 2: Target Class (Optional) & Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Class (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="target_class_id" className="text-sm font-semibold text-slate-800">
                Target Class (Optional)
              </Label>
              <div className="relative">
                <Controller
                  name="target_class_id"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="target_class_id"
                      value={field.value || 'ALL'}
                      onChange={handleClassChange}
                      disabled={isTeacherAudience}
                      className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 appearance-none cursor-pointer focus:outline-none focus:border-brand-primary disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
                    >
                      <option value="ALL">All Classes</option>
                      {classesList.map((cls) => {
                        const classId = cls.id || (cls as any).class_id
                        const className = cls.name || cls.class_name || 'Class'
                        return (
                          <option key={classId} value={classId}>
                            {className}
                          </option>
                        )
                      })}
                    </select>
                  )}
                />
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.target_class_id && (
                <p className="text-rose-600 text-xs font-medium mt-1">{errors.target_class_id.message}</p>
              )}
            </div>

            {/* Section */}
            <div className="space-y-2">
              <Label htmlFor="target_section_id" className="text-sm font-semibold text-slate-800">
                Section
              </Label>
              <div className="relative">
                <Controller
                  name="target_section_id"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="target_section_id"
                      value={field.value || 'ALL'}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={isTeacherAudience || !selectedClassId || selectedClassId === 'ALL'}
                      className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 appearance-none cursor-pointer focus:outline-none focus:border-brand-primary disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
                    >
                      <option value="ALL">All Sections</option>
                      {sectionsList.map((sec) => {
                        const secId = sec.id || (sec as any).section_id
                        const secName = sec.name || (sec as any).section_name || ''
                        return (
                          <option key={secId} value={secId}>
                            Sec {secName}
                          </option>
                        )
                      })}
                    </select>
                  )}
                />
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.target_section_id && (
                <p className="text-rose-600 text-xs font-medium mt-1">{errors.target_section_id.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/announcements')}
              className="h-12 px-6 rounded-xl border border-slate-200 font-semibold text-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={updateMutation.isPending}
              className="flex-1 h-12 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-semibold text-base shadow-lg shadow-blue-500/10 transition-all active:scale-[0.99]"
            >
              Update Announcement
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
