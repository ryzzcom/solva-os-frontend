import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, ArrowLeft, Calendar, Clock, Loader2, CheckSquare, Square, Search } from 'lucide-react'
import { CustomSelect } from '@/components/ui/select'
import { HasRole } from '@/components/auth/HasRole'
import { useClassesOverviewFull } from '@/features/classes/api/useClasses'
import { useClassSectionsOverview } from '@/features/classes/sections/api/useClassSectionsOverview'
import { useStudents } from '@/features/students/api/useStudents'
import { ptmSchema, type PtmFormValues } from '../schemas/ptmSchema'
import { useCreatePtm } from '../api/usePtm'

export const SchedulePtmPage: React.FC = () => {
  const navigate = useNavigate()
  const createPtmMutation = useCreatePtm()
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Class selection state for dynamic sections loading
  const [selectedClassId, setSelectedClassId] = useState<string>('')

  // Student search state for individual student target
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('')
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)

  // Fetch student options when query typed
  const { data: studentsData, isLoading: isStudentsLoading } = useStudents({
    search: studentSearchQuery,
    limit: 10,
  })
  const studentsList = studentsData?.students || []

  // Fetch dropdown options
  const { data: classesOverview, isLoading: isClassesLoading } = useClassesOverviewFull()
  const classesList = classesOverview?.classes_list || []

  const { data: sectionsOverview, isLoading: isSectionsLoading } = useClassSectionsOverview(
    selectedClassId
  )
  const sectionsList = sectionsOverview?.sections || []

  const classOptions = [
    { value: '', label: 'Select Class' },
    ...classesList.map((c: any) => ({
      value: c.id,
      label: c.name || c.class_name,
    })),
  ]

  const sectionOptions = [
    { value: '', label: 'All Sections' },
    ...sectionsList.map((sec: any) => {
      const secName = sec.section_name || sec.name || 'Section'
      const fullSecName = secName.startsWith('Section') ? secName : `Section ${secName}`
      return {
        value: sec.section_id || sec.id,
        label: fullSecName,
      }
    }),
  ]

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PtmFormValues>({
    resolver: zodResolver(ptmSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'ENTIRE_CLASS',
      date: new Date().toISOString().split('T')[0],
      start_time: '11:30 AM',
      end_time: '12:30 PM',
    },
  })

  const targetType = watch('type')

  const onSubmit = async (data: PtmFormValues) => {
    try {
      setSubmitError(null)

      if (data.type === 'INDIVIDUAL_STUDENT' && !selectedStudent) {
        setSubmitError('Please search and select a student for Individual Student PTM.')
        return
      }

      // Format payload according to target type
      let sectionIds: string[] = []
      if (data.section_id) {
        sectionIds = [data.section_id]
      } else if (sectionsList.length > 0) {
        sectionIds = sectionsList.map((s: any) => s.section_id || s.id)
      }

      const payload = {
        title: data.title,
        description: data.description || null,
        type: data.type,
        ...(data.type === 'ENTIRE_CLASS' ? { section_ids: sectionIds } : {}),
        ...(data.type === 'INDIVIDUAL_STUDENT' && selectedStudent
          ? { student_ids: [selectedStudent.id] }
          : {}),
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time || '12:30 PM',
      }

      await createPtmMutation.mutateAsync(payload as any)
      navigate('/ptm')
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message || 'Failed to schedule PTM meeting.')
    }
  }

  return (
    <HasRole allowedRoles={['SUPER_ADMIN', 'PRINCIPAL']}>
      <div className="space-y-8 pb-16 animate-in fade-in duration-300 max-w-4xl mx-auto">
        {/* 1. Header Breadcrumbs Navigation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs md:text-sm font-sans text-slate-500">
            <button
              type="button"
              onClick={() => navigate('/ptm')}
              className="hover:text-brand-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="size-3.5" />
              <span>PTM</span>
            </button>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="font-semibold text-navy-main font-urbanist">Schedule New PTM</span>
          </div>
        </div>

        {submitError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl font-sans text-sm font-semibold">
            {submitError}
          </div>
        )}

        {/* 2. Schedule New PTM Form Card */}
        <div className="bg-white border border-card-border rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <h1 className="text-2xl font-bold font-urbanist text-navy-main border-b border-slate-100 pb-4">
            Schedule New PTM
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Meeting Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold font-urbanist text-slate-800 block">
                Meeting Title
              </label>
              <input
                type="text"
                placeholder="e.g. Science Fair Coordination"
                {...register('title')}
                className="w-full h-11 px-4 rounded-xl border border-card-border bg-white text-sm font-sans text-slate-800 focus:outline-none focus:border-brand-primary transition-all"
              />
              {errors.title && (
                <p className="text-xs text-rose-600 font-sans">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold font-urbanist text-slate-800 block">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Detailed content of your meeting ..."
                {...register('description')}
                className="w-full p-4 rounded-xl border border-card-border bg-white text-sm font-sans text-slate-800 focus:outline-none focus:border-brand-primary transition-all resize-none"
              />
            </div>

            {/* Target Audience Checkboxes */}
            <div className="flex items-center gap-8 py-2">
              <button
                type="button"
                onClick={() => setValue('type', 'ENTIRE_CLASS')}
                className="flex items-center gap-2 text-sm font-semibold font-urbanist text-slate-800 cursor-pointer select-none"
              >
                {targetType === 'ENTIRE_CLASS' ? (
                  <CheckSquare className="size-5 text-brand-primary" />
                ) : (
                  <Square className="size-5 text-slate-400" />
                )}
                <span>Entire Class</span>
              </button>

              <button
                type="button"
                onClick={() => setValue('type', 'INDIVIDUAL_STUDENT')}
                className="flex items-center gap-2 text-sm font-semibold font-urbanist text-slate-800 cursor-pointer select-none"
              >
                {targetType === 'INDIVIDUAL_STUDENT' ? (
                  <CheckSquare className="size-5 text-brand-primary" />
                ) : (
                  <Square className="size-5 text-slate-400" />
                )}
                <span>Individual Student</span>
              </button>
            </div>

            {/* Conditional Target UI */}
            {targetType === 'ENTIRE_CLASS' ? (
              /* Class & Section Row */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Class Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-bold font-urbanist text-slate-800 block">
                    Class
                  </label>
                  <CustomSelect
                    options={classOptions}
                    value={selectedClassId}
                    onChange={(val) => {
                      setSelectedClassId(val)
                      setValue('class_id', val)
                      setValue('section_id', '')
                    }}
                    placeholder="Select Class"
                    disabled={isClassesLoading}
                  />
                </div>

                {/* Section Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-bold font-urbanist text-slate-800 block">
                    Section
                  </label>
                  <Controller
                    name="section_id"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        options={sectionOptions}
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="All Sections"
                        disabled={!selectedClassId || isSectionsLoading}
                      />
                    )}
                  />
                </div>
              </div>
            ) : (
              /* Individual Student Search Row */
              <div className="space-y-2">
                <label className="text-sm font-bold font-urbanist text-slate-800 block">
                  Student
                </label>
                <div className="relative">
                  <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    placeholder="Name, Registration Number"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-card-border bg-white text-sm font-sans text-slate-800 focus:outline-none focus:border-brand-primary transition-all"
                  />
                  {/* Selected Student Pill */}
                  {selectedStudent && (
                    <div className="mt-2 flex items-center justify-between p-3 bg-brand-soft border border-blue-200 rounded-xl">
                      <div className="space-y-0.5">
                        <span className="font-bold text-sm font-urbanist text-navy-main block">
                          {selectedStudent.full_name || selectedStudent.name}
                        </span>
                        <span className="text-xs font-sans text-slate-500 block">
                          ID: #{selectedStudent.registration_no || selectedStudent.id}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(null)}
                        className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Student Search Results Dropdown */}
                  {!selectedStudent && studentSearchQuery.trim().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-card-border rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {isStudentsLoading ? (
                        <div className="p-3 text-center text-xs font-sans text-slate-500">
                          Searching students...
                        </div>
                      ) : studentsList.length === 0 ? (
                        <div className="p-3 text-center text-xs font-sans text-slate-500">
                          No matching students found.
                        </div>
                      ) : (
                        studentsList.map((st: any) => (
                          <div
                            key={st.id}
                            onClick={() => {
                              setSelectedStudent(st)
                              setStudentSearchQuery('')
                            }}
                            className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div>
                              <p className="font-bold text-sm font-urbanist text-navy-main">
                                {st.full_name || st.name}
                              </p>
                              <p className="text-xs font-sans text-slate-500">
                                ID: #{st.registration_no || st.id}
                              </p>
                            </div>
                            <span className="text-xs font-bold font-urbanist text-brand-primary">
                              Select
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold font-urbanist text-slate-800 flex items-center gap-1.5">
                  <Calendar className="size-4 text-brand-primary" />
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full h-11 px-4 rounded-xl border border-card-border bg-white text-sm font-sans text-slate-800 focus:outline-none focus:border-brand-primary transition-all cursor-pointer"
                />
                {errors.date && (
                  <p className="text-xs text-rose-600 font-sans">{errors.date.message}</p>
                )}
              </div>

              {/* Time Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold font-urbanist text-slate-800 flex items-center gap-1.5">
                  <Clock className="size-4 text-brand-primary" />
                  <span>Time</span>
                </label>
                <input
                  type="text"
                  placeholder="11:30 AM"
                  {...register('start_time')}
                  className="w-full h-11 px-4 rounded-xl border border-card-border bg-white text-sm font-sans text-slate-800 focus:outline-none focus:border-brand-primary transition-all"
                />
                {errors.start_time && (
                  <p className="text-xs text-rose-600 font-sans">{errors.start_time.message}</p>
                )}
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={createPtmMutation.isPending}
                className="w-full py-3.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-urbanist font-bold text-base transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {createPtmMutation.isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : null}
                <span>Create Meeting</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </HasRole>
  )
}

export default SchedulePtmPage
