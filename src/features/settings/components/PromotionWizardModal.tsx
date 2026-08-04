import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2, ArrowRight, ArrowLeft, CheckCircle, GraduationCap, RotateCcw, AlertTriangle, X } from 'lucide-react'
import { useStudents } from '@/features/students/api/useStudents'
import { useClassesOverviewFull } from '@/features/classes/api/useClasses'
import { usePromoteStudents } from '../api/useAcademicYear'
import type { PromotionAction, StudentPromotionItem } from '../types/academic_year.types'

interface PromotionWizardModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PromotionWizardModal: React.FC<PromotionWizardModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1 Form State
  const currentYear = new Date().getFullYear()
  const [yearName, setYearName] = useState(`${currentYear + 1}-${currentYear + 2}`)
  const [startDate, setStartDate] = useState(`${currentYear + 1}-08-01`)
  const [endDate, setEndDate] = useState(`${currentYear + 2}-06-30`)

  // Step 2 Search & Promotions Map State
  const [search, setSearch] = useState('')
  const { data: studentsData, isLoading: isStudentsLoading } = useStudents({ limit: 1000, page: 1 })
  const { data: classesData } = useClassesOverviewFull()

  const classesList = useMemo(() => classesData?.classes_list || [], [classesData])

  // Map: student_id -> StudentPromotionItem
  const [promotionsMap, setPromotionsMap] = useState<Record<string, StudentPromotionItem>>({})

  const students = useMemo(() => studentsData?.students || [], [studentsData])

  // Initialize promotions map when students load
  useEffect(() => {
    if (students.length > 0) {
      const initialMap: Record<string, StudentPromotionItem> = {}
      students.forEach((s) => {
        initialMap[s.id] = {
          student_id: s.id,
          action: 'PROMOTE',
          new_class_id: s.class_id || undefined,
          new_section_id: s.section_id || undefined,
        }
      })
      setPromotionsMap(initialMap)
    }
  }, [students])

  const promoteMutation = usePromoteStudents()

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students
    const q = search.toLowerCase()
    return students.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        (s.registration_no && s.registration_no.toLowerCase().includes(q)) ||
        (s.roll_no && s.roll_no.toLowerCase().includes(q)) ||
        (s.class_name && s.class_name.toLowerCase().includes(q))
    )
  }, [students, search])

  // Step 3 Summaries
  const summary = useMemo(() => {
    const items = Object.values(promotionsMap)
    const total = items.length
    const promoting = items.filter((i) => i.action === 'PROMOTE').length
    const retaining = items.filter((i) => i.action === 'RETAIN').length
    const graduating = items.filter((i) => i.action === 'GRADUATE').length
    return { total, promoting, retaining, graduating }
  }, [promotionsMap])

  const handleActionChange = (studentId: string, action: PromotionAction) => {
    setPromotionsMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        action,
      },
    }))
  }

  const handleClassChange = (studentId: string, newClassId: string) => {
    setPromotionsMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        new_class_id: newClassId,
      },
    }))
  }

  const handleSubmitPromotion = () => {
    const payload = Object.values(promotionsMap)
    promoteMutation.mutate(payload, {
      onSuccess: () => {
        onClose()
        setStep(1)
      },
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-urbanist text-slate-900">
                Academic Year & Student Promotion Wizard
              </h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Step {step} of 3
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-1">
              {step === 1 && 'Configure the target new academic year session details.'}
              {step === 2 && 'Set student retention or graduation exceptions before bulk promotion.'}
              {step === 3 && 'Review the bulk promotion summary and trigger high-stakes session update.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-3 gap-2 my-2">
          <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-brand-primary' : 'bg-slate-200'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-brand-primary' : 'bg-slate-200'}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-brand-primary' : 'bg-slate-200'}`} />
        </div>

        {/* STEP 1: New Academic Session Info */}
        {step === 1 && (
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">New Academic Year Name</label>
                <Input
                  type="text"
                  placeholder="e.g. 2026-2027"
                  value={yearName}
                  onChange={(e) => setYearName(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Session Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Session End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 flex items-start gap-3 text-xs font-sans">
              <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold font-urbanist">Important Notice</p>
                <p className="mt-0.5 text-slate-600">
                  Promoting students will update class assignments across active student rosters. A 24-hour snapshot rollback window will be active after processing.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-11 px-5">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!yearName || !startDate || !endDate}
                className="bg-brand-primary hover:bg-brand-hover text-white rounded-xl h-11 px-6 font-semibold flex items-center gap-2"
              >
                <span>Continue to Exceptions</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Exceptions & Retentions Table */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            {/* Search Filter */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search student by name, roll no, or current class..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9 rounded-xl border-slate-200 text-xs"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            </div>

            {/* Table Container */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-[350px] overflow-y-auto">
              {isStudentsLoading ? (
                <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="size-6 animate-spin text-brand-primary" />
                  <span>Loading active student rosters...</span>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-sans">
                  No active students found matching search.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 font-urbanist uppercase tracking-wider sticky top-0 bg-slate-50 z-10">
                    <tr>
                      <th className="p-3">Roll / Reg No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Current Class</th>
                      <th className="p-3">Promotion Action</th>
                      <th className="p-3">Target Class</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredStudents.map((s) => {
                      const item = promotionsMap[s.id] || { action: 'PROMOTE' }
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-medium text-slate-600">
                            {s.registration_no || s.roll_no || 'N/A'}
                          </td>
                          <td className="p-3 font-semibold text-slate-900">{s.full_name}</td>
                          <td className="p-3 text-slate-600">{s.class_name || 'Unassigned'}</td>
                          <td className="p-3">
                            <select
                              value={item.action}
                              onChange={(e) => handleActionChange(s.id, e.target.value as PromotionAction)}
                              className="h-8 rounded-lg border border-slate-200 bg-white text-xs font-semibold px-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            >
                              <option value="PROMOTE">PROMOTE (Advance)</option>
                              <option value="RETAIN">RETAIN (Repeat Class)</option>
                              <option value="GRADUATE">GRADUATE (Exit)</option>
                            </select>
                          </td>
                          <td className="p-3">
                            {item.action === 'PROMOTE' ? (
                              <select
                                value={item.new_class_id || s.class_id || ''}
                                onChange={(e) => handleClassChange(s.id, e.target.value)}
                                className="h-8 rounded-lg border border-slate-200 bg-white text-xs px-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                              >
                                {classesList.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name || c.class_name}
                                  </option>
                                ))}
                              </select>
                            ) : item.action === 'GRADUATE' ? (
                              <span className="text-slate-400 italic">Alumni / Exit</span>
                            ) : (
                              <span className="text-slate-500 font-medium">Same Class</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="rounded-xl h-11 px-5 flex items-center gap-2">
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                className="bg-brand-primary hover:bg-brand-hover text-white rounded-xl h-11 px-6 font-semibold flex items-center gap-2"
              >
                <span>Review Summary</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Summary & Execution */}
        {step === 3 && (
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-2xl font-bold font-urbanist text-slate-900">{summary.total}</span>
                <p className="text-xs font-semibold text-slate-500">Total Evaluated</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <span className="text-2xl font-bold font-urbanist text-emerald-700">{summary.promoting}</span>
                <p className="text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
                  <CheckCircle className="size-3.5" /> Promoting
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                <span className="text-2xl font-bold font-urbanist text-amber-700">{summary.retaining}</span>
                <p className="text-xs font-semibold text-amber-600 flex items-center justify-center gap-1">
                  <RotateCcw className="size-3.5" /> Retaining
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-1">
                <span className="text-2xl font-bold font-urbanist text-indigo-700">{summary.graduating}</span>
                <p className="text-xs font-semibold text-indigo-600 flex items-center justify-center gap-1">
                  <GraduationCap className="size-3.5" /> Graduating
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs font-sans text-slate-700 space-y-1">
              <p>
                <strong className="font-bold font-urbanist text-slate-900">Target Session:</strong> {yearName} ({startDate} to {endDate})
              </p>
              <p className="text-slate-500">
                Processing bulk promotion will save a 24-hour rollback snapshot to ensure safety.
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="rounded-xl h-11 px-5 flex items-center gap-2">
                <ArrowLeft className="size-4" />
                <span>Back</span>
              </Button>
              <Button
                type="button"
                onClick={handleSubmitPromotion}
                disabled={promoteMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 font-semibold shadow-md shadow-emerald-500/10 flex items-center gap-2"
              >
                {promoteMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle className="size-4" />
                )}
                <span>{promoteMutation.isPending ? 'Processing Bulk Promotion...' : 'Confirm & Process Promotion'}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
