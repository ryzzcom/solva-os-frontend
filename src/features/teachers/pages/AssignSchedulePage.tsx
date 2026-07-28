import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, BookOpen, Clock, AlertCircle, CheckCircle2, Loader2, Check, ArrowLeft } from 'lucide-react'
import { CustomSelect } from '@/components/ui/select-dropdown'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { useClassesOverview, useClassSections } from '@/features/classes/api/useClasses'
import { useTeacherProfileHeader } from '../api/useTeacherProfile'
import { useAssignSchedule } from '../api/useAssignSchedule'

const ALL_DAYS = [
  { label: 'Monday', short: 'Mon' },
  { label: 'Tuesday', short: 'Tue' },
  { label: 'Wednesday', short: 'Wed' },
  { label: 'Thursday', short: 'Thu' },
  { label: 'Friday', short: 'Fri' },
  { label: 'Saturday', short: 'Sat' },
  { label: 'Sunday', short: 'Sun' },
]

export default function AssignSchedulePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: headerData } = useTeacherProfileHeader(id)
  const teacherName = headerData?.full_name || 'Teacher'
  const designation = headerData?.summary || 'Faculty Member'

  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [startTime, setStartTime] = useState('08:30')
  const [endTime, setEndTime] = useState('10:00')
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday'])

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // 1. Fetch real classes from DB
  const { data: classesList = [] } = useClassesOverview()
  const classOptions: SelectOption[] = classesList.map((cls) => ({
    label: cls.name || cls.class_name || 'Class',
    value: cls.id,
  }))

  // 2. Fetch sections for chosen class
  const { data: sectionsList = [] } = useClassSections(selectedClassId)
  const sectionOptions: SelectOption[] = sectionsList.map((sec) => ({
    label: `Section ${sec.section_name || sec.name}`,
    value: sec.section_id || sec.id || '',
  }))

  // 3. Extract subjects dynamically from selected section
  const selectedSection = sectionsList.find(
    (sec) => (sec.section_id || sec.id) === selectedSectionId
  )

  let rawSectionSubjects: string[] = []
  if (selectedSection && selectedSection.subjects) {
    if (Array.isArray(selectedSection.subjects)) {
      rawSectionSubjects = selectedSection.subjects.map((subj: any) =>
        typeof subj === 'string' ? subj : subj?.name || subj?.subject_name || String(subj)
      )
    }
  }

  // Fallback subject list if section subjects array is empty
  const fallbackSubjects = [
    'Physics II: Mechanics',
    'Advanced Algebra & Geometry',
    'General Mathematics',
    'English Literature',
    'Computer Science',
    'Organic Chemistry',
    'Biology & Life Sciences',
  ]

  const activeSubjects = rawSectionSubjects.length > 0 ? rawSectionSubjects : fallbackSubjects
  const subjectOptions: SelectOption[] = activeSubjects.map((subj) => ({
    label: subj,
    value: subj,
  }))

  const assignScheduleMutation = useAssignSchedule(id)

  const handleClassChange = (classVal: string) => {
    setSelectedClassId(classVal)
    setSelectedSectionId('')
    setSubjectName('')
  }

  const handleSectionChange = (secVal: string) => {
    setSelectedSectionId(secVal)
    setSubjectName('')
  }

  const toggleDay = (dayLabel: string) => {
    if (selectedDays.includes(dayLabel)) {
      if (selectedDays.length === 1) return // Keep at least 1 day
      setSelectedDays(selectedDays.filter((d) => d !== dayLabel))
    } else {
      setSelectedDays([...selectedDays, dayLabel])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!selectedClassId) {
      setErrorMessage('Please select a class.')
      return
    }
    if (!selectedSectionId) {
      setErrorMessage('Please select a section.')
      return
    }
    if (!subjectName.trim()) {
      setErrorMessage('Please select an academic subject.')
      return
    }
    if (selectedDays.length === 0) {
      setErrorMessage('Please select at least one active day.')
      return
    }
    if (startTime >= endTime) {
      setErrorMessage('End time must be after start time.')
      return
    }

    const scheduleItems = selectedDays.map((day) => ({
      day,
      start_time: startTime,
      end_time: endTime,
    }))

    assignScheduleMutation.mutate(
      {
        class_id: selectedClassId,
        section_id: selectedSectionId,
        subject_id: subjectName.trim(),
        schedule_items: scheduleItems,
      },
      {
        onSuccess: () => {
          setSuccessMessage(`Successfully assigned ${subjectName} schedule to ${teacherName}!`)
          setTimeout(() => {
            navigate(`/teachers/${id}`)
          }, 1500)
        },
        onError: (err: any) => {
          const rawMessage =
            err?.response?.data?.message || err?.message || 'Failed to assign class schedule.'
          setErrorMessage(rawMessage)
        },
      }
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* 1. Breadcrumbs Header */}
      <div className="flex items-center gap-2 text-base">
        <span
          onClick={() => navigate('/dashboard')}
          className="text-slate-sub font-sans font-normal hover:underline cursor-pointer"
        >
          Principal Dashboard.
        </span>
        <ChevronRight className="size-4 text-slate-sub" />
        <span
          onClick={() => navigate(`/teachers/${id}`)}
          className="text-slate-sub font-sans font-normal hover:underline cursor-pointer"
        >
          {teacherName}
        </span>
        <ChevronRight className="size-4 text-slate-sub" />
        <span className="text-navy-main font-urbanist font-medium capitalize">
          Assign New Class
        </span>
      </div>

      {/* 2. Hero Title Banner matching Figma 183-1950 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-blue-900/5 via-blue-800/5 to-transparent p-6 rounded-2xl border border-blue-100">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/teachers/${id}`)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-navy-main hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#0f172a] font-urbanist leading-[40px]">
              Assign New Class
            </h1>
          </div>
          <p className="text-slate-600 text-base font-sans leading-[24px] pl-11">
            Assigning specialized academic responsibility to{' '}
            <span className="font-semibold text-slate-900">{teacherName}</span> ({designation}).
          </p>
        </div>

        <div className="size-20 md:size-24 rounded-2xl bg-[#2e67b1] text-white flex items-center justify-center font-urbanist text-2xl font-bold shadow-md shrink-0 border-2 border-white">
          <BookOpen className="size-10 text-white" />
        </div>
      </div>

      {/* 3. Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-sans flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-sans flex items-center gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Card 1: Class Details */}
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-[#0f172a] font-semibold font-urbanist text-lg border-b border-slate-100 pb-3">
            <BookOpen className="size-5 text-[#2e67b1]" />
            <span>Class Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Class */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 font-sans">
                Select Class <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={classOptions}
                value={selectedClassId}
                onChange={handleClassChange}
                placeholder="Select Class"
              />
            </div>

            {/* Select Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 font-sans">
                Select Section <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={sectionOptions}
                value={selectedSectionId}
                onChange={handleSectionChange}
                placeholder={selectedClassId ? 'Select Section' : 'Select Class First'}
                disabled={!selectedClassId}
              />
            </div>
          </div>

          {/* Academic Subject (Populated dynamically from selected section's subjects) */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-semibold text-slate-700 font-sans flex items-center justify-between">
              <span>Academic Subject <span className="text-red-500">*</span></span>
              {selectedSectionId && rawSectionSubjects.length > 0 && (
                <span className="text-xs text-[#2e67b1] font-normal">
                  ({rawSectionSubjects.length} subject(s) in this section)
                </span>
              )}
            </label>

            <CustomSelect
              options={subjectOptions}
              value={subjectName}
              onChange={setSubjectName}
              placeholder={
                selectedSectionId
                  ? 'Select Academic Subject'
                  : 'Select Section First to view available subjects'
              }
              disabled={!selectedSectionId}
            />
          </div>
        </div>

        {/* Card 2: Schedule & Timings */}
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-[#0f172a] font-semibold font-urbanist text-lg border-b border-slate-100 pb-3">
            <Clock className="size-5 text-[#2e67b1]" />
            <span>Schedule & Timings</span>
          </div>

          {/* Time Input Fields (Native HTML time inputs per user request) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 font-sans">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-12 px-4 bg-[#f8fafc] border border-[#d8dee8] rounded-xl text-base text-slate-800 font-sans font-medium focus:outline-none focus:border-[#2e67b1] focus:bg-white transition-all cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 font-sans">
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full h-12 px-4 bg-[#f8fafc] border border-[#d8dee8] rounded-xl text-base text-slate-800 font-sans font-medium focus:outline-none focus:border-[#2e67b1] focus:bg-white transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Active Days Pills */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-semibold text-slate-700 font-sans flex items-center justify-between">
              <span>Active Teaching Days <span className="text-red-500">*</span></span>
              <span className="text-[#2e67b1] font-medium">{selectedDays.length} selected</span>
            </label>

            <div className="flex flex-wrap gap-3">
              {ALL_DAYS.map((dayObj) => {
                const isSelected = selectedDays.includes(dayObj.label)
                return (
                  <button
                    key={dayObj.label}
                    type="button"
                    onClick={() => toggleDay(dayObj.label)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium font-urbanist transition-all cursor-pointer flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-[#2e67b1] text-white border-[#2e67b1] shadow-sm scale-105'
                        : 'bg-white text-slate-600 border-slate-250 hover:border-[#2e67b1] hover:bg-blue-50/50'
                    }`}
                  >
                    {isSelected && <Check className="size-4 stroke-[2.5]" />}
                    <span>{dayObj.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/teachers/${id}`)}
            className="w-full sm:w-auto h-13 px-8 rounded-xl border border-slate-300 text-slate-700 text-base font-medium font-urbanist hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel And Reset
          </button>

          <button
            type="submit"
            disabled={assignScheduleMutation.isPending}
            className="w-full sm:w-auto h-13 px-8 rounded-xl bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white text-base font-medium font-urbanist transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {assignScheduleMutation.isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Assigning Schedule...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-5" />
                Confirm & Assign Class
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
