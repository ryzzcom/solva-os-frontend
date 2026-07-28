import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  BookOpen,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomSelect } from '@/components/ui/select-dropdown'
import type { SelectOption } from '@/components/ui/select-dropdown'
import { useClassesOverview, useClassSections } from '@/features/classes/api/useClasses'
import { useAssignSchedule } from '../api/useAssignSchedule'

interface AssignClassModalProps {
  isOpen: boolean
  onClose: () => void
  teacherId?: string
  teacherName?: string
}

const ALL_DAYS = [
  { label: 'Monday', short: 'Mon' },
  { label: 'Tuesday', short: 'Tue' },
  { label: 'Wednesday', short: 'Wed' },
  { label: 'Thursday', short: 'Thu' },
  { label: 'Friday', short: 'Fri' },
  { label: 'Saturday', short: 'Sat' },
  { label: 'Sunday', short: 'Sun' },
]

const POPULAR_SUBJECTS = [
  'Physics II: Mechanics',
  'Advanced Algebra & Geometry',
  'General Mathematics',
  'English Literature',
  'Computer Science',
  'Organic Chemistry',
  'Biology & Life Sciences',
  'World History',
]

const TIME_OPTIONS: SelectOption[] = [
  { label: '08:00 AM', value: '08:00' },
  { label: '08:30 AM', value: '08:30' },
  { label: '09:00 AM', value: '09:00' },
  { label: '09:30 AM', value: '09:30' },
  { label: '10:00 AM', value: '10:00' },
  { label: '10:30 AM', value: '10:30' },
  { label: '11:00 AM', value: '11:00' },
  { label: '11:15 AM', value: '11:15' },
  { label: '11:30 AM', value: '11:30' },
  { label: '12:00 PM', value: '12:00' },
  { label: '12:30 PM', value: '12:30' },
  { label: '01:00 PM', value: '13:00' },
  { label: '01:30 PM', value: '13:30' },
  { label: '02:00 PM', value: '14:00' },
  { label: '02:30 PM', value: '14:30' },
]

export const AssignClassModal: React.FC<AssignClassModalProps> = ({
  isOpen,
  onClose,
  teacherId,
  teacherName,
}) => {
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [startTime, setStartTime] = useState('08:30')
  const [endTime, setEndTime] = useState('10:00')
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday'])

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch real classes and sections from database
  const { data: classesList = [] } = useClassesOverview()
  const classOptions: SelectOption[] = classesList.map((cls) => ({
    label: cls.name || cls.class_name || 'Class',
    value: cls.id,
  }))

  const { data: sectionsList = [] } = useClassSections(selectedClassId)
  const sectionOptions: SelectOption[] = sectionsList.map((sec) => ({
    label: `Section ${sec.section_name || sec.name}`,
    value: sec.section_id || sec.id || '',
  }))

  const assignScheduleMutation = useAssignSchedule(teacherId)

  if (!isOpen) return null

  const toggleDay = (dayLabel: string) => {
    if (selectedDays.includes(dayLabel)) {
      if (selectedDays.length === 1) return // Keep at least one day
      setSelectedDays(selectedDays.filter((d) => d !== dayLabel))
    } else {
      setSelectedDays([...selectedDays, dayLabel])
    }
  }

  const handleClassChange = (classVal: string) => {
    setSelectedClassId(classVal)
    setSelectedSectionId('')
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
      setErrorMessage('Please specify an academic subject.')
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
          setSuccessMessage(
            `Successfully assigned ${subjectName} schedule to ${teacherName || 'teacher'}!`
          )
          setTimeout(() => {
            setSuccessMessage(null)
            onClose()
          }, 1600)
        },
        onError: (err: any) => {
          const rawMessage = err?.response?.data?.message || err?.message || 'Failed to assign class schedule.'
          setErrorMessage(rawMessage)
        },
      }
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#d8dee8] rounded-[16px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2e67b1]/10 rounded-xl text-[#2e67b1]">
              <BookOpen className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#0f172a] font-urbanist">
                Assign New Class
              </h2>
              <p className="text-sm text-slate-600 font-sans">
                Assigning specialized academic responsibility to {teacherName || 'faculty member'}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
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

          {/* Section 1: Class Details */}
          <div className="bg-[#f8fafc] border border-[#d8dee8] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-semibold font-urbanist text-base border-b border-slate-200/80 pb-2">
              <BookOpen className="size-4 text-[#2e67b1]" />
              <span>Class Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select Class */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 font-sans">
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 font-sans">
                  Select Section <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  options={sectionOptions}
                  value={selectedSectionId}
                  onChange={setSelectedSectionId}
                  placeholder={selectedClassId ? 'Select Section' : 'Select Class First'}
                  disabled={!selectedClassId}
                />
              </div>
            </div>

            {/* Academic Subject */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-700 font-sans">
                Academic Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Physics II: Mechanics or Advanced Algebra"
                className="w-full h-11 px-3.5 bg-white border border-[#d8dee8] rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#2e67b1] font-sans"
              />

              {/* Popular subject quick suggestion chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {POPULAR_SUBJECTS.slice(0, 4).map((subj, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSubjectName(subj)}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-600 hover:text-[#2e67b1] hover:border-[#2e67b1] transition-colors cursor-pointer font-sans"
                  >
                    + {subj}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Schedule & Timings */}
          <div className="bg-[#f8fafc] border border-[#d8dee8] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-semibold font-urbanist text-base border-b border-slate-200/80 pb-2">
              <Clock className="size-4 text-[#2e67b1]" />
              <span>Schedule & Timings</span>
            </div>

            {/* Time Slot Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 font-sans">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  options={TIME_OPTIONS}
                  value={startTime}
                  onChange={setStartTime}
                  placeholder="Select Start Time"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 font-sans">
                  End Time <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  options={TIME_OPTIONS}
                  value={endTime}
                  onChange={setEndTime}
                  placeholder="Select End Time"
                />
              </div>
            </div>

            {/* Active Days Selection Pills */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-700 font-sans flex items-center justify-between">
                <span>Active Teaching Days <span className="text-red-500">*</span></span>
                <span className="text-[#2e67b1] font-medium">{selectedDays.length} selected</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {ALL_DAYS.map((dayObj) => {
                  const isSelected = selectedDays.includes(dayObj.label)
                  return (
                    <button
                      key={dayObj.label}
                      type="button"
                      onClick={() => toggleDay(dayObj.label)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium font-urbanist transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[#2e67b1] text-white border-[#2e67b1] shadow-sm'
                          : 'bg-white text-slate-600 border-slate-250 hover:border-[#2e67b1] hover:bg-blue-50/50'
                      }`}
                    >
                      {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
                      <span>{dayObj.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancel And Reset
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={assignScheduleMutation.isPending}
              leftIcon={
                assignScheduleMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )
              }
              className="px-6 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white"
            >
              {assignScheduleMutation.isPending ? 'Assigning...' : 'Confirm & Assign Class'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
