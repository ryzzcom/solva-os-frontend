import React, { useState, useEffect } from 'react'
import { Calendar, AlertTriangle, RotateCcw, CheckCircle2, ArrowRight, Loader2, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetCurrentSession, useRollbackPromotion, useFinalizePurge } from '../api/useAcademicYear'
import { PromotionWizardModal } from './PromotionWizardModal'

export const AcademicYearTab: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetCurrentSession()
  const rollbackMutation = useRollbackPromotion()
  const finalizeMutation = useFinalizePurge()

  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false)

  // Finalize Form state
  const currentYearNum = new Date().getFullYear()
  const [nextYearName, setNextYearName] = useState(`${currentYearNum + 1}-${currentYearNum + 2}`)
  const [nextStartDate, setNextStartDate] = useState(`${currentYearNum + 1}-08-01`)
  const [nextEndDate, setNextEndDate] = useState(`${currentYearNum + 2}-06-30`)

  const academicYear = data?.academic_year
  const rollbackInfo = data?.rollback_info

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    if (rollbackInfo?.rollback_expires_in_seconds) {
      setTimeLeft(rollbackInfo.rollback_expires_in_seconds)
    }
  }, [rollbackInfo])

  useEffect(() => {
    if (timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs}h ${mins}m ${secs}s`
  }

  const handleRollback = () => {
    if (window.confirm('Are you sure you want to rollback student promotions? This will restore all students to their exact previous classes.')) {
      rollbackMutation.mutate()
    }
  }

  const handleFinalizePurge = () => {
    finalizeMutation.mutate(
      {
        year_name: nextYearName,
        start_date: nextStartDate,
        end_date: nextEndDate,
      },
      {
        onSuccess: () => {
          setIsFinalizeModalOpen(false)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        <Loader2 className="size-8 text-brand-primary animate-spin" />
        <span>Loading academic year details...</span>
      </div>
    )
  }

  if (isError || !academicYear) {
    return (
      <div className="p-8 text-center text-rose-700 font-sans space-y-3 bg-white border border-rose-200 rounded-2xl shadow-xs">
        <AlertTriangle className="size-8 text-rose-600 mx-auto" />
        <p className="font-semibold text-sm">Failed to load academic session data.</p>
        <Button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
        >
          Retry
        </Button>
      </div>
    )
  }

  const isPromotingInWindow = academicYear.status === 'PROMOTING_IN_WINDOW'

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Current Academic Year Details Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-urbanist text-slate-900">
                Academic Session: {academicYear.year_name}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                  isPromotingInWindow
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {academicYear.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              Active operational session for student enrollment, attendance, and exam grading.
            </p>
          </div>

          {/* STATE 1 ACTION: Start Promotion */}
          {!isPromotingInWindow && (
            <Button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="h-11 px-6 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 cursor-pointer"
            >
              <span>End Academic Year & Start Promotion</span>
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>

        {/* Date Ranges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <Calendar className="size-5 text-brand-primary shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-urbanist">
                Session Start Date
              </p>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {new Date(academicYear.start_date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <Calendar className="size-5 text-brand-primary shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-urbanist">
                Session End Date
              </p>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {new Date(academicYear.end_date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STATE 2: PROMOTING_IN_WINDOW Banner & Actions */}
      {isPromotingInWindow && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-700 shrink-0">
              <AlertTriangle className="size-6 text-amber-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold font-urbanist text-amber-900">
                24-Hour Promotion Rollback Window Active
              </h3>
              <p className="text-xs text-amber-800 font-sans leading-relaxed">
                Bulk student promotion has been processed. You are currently in the 24-hour verification window. If any mistake occurred during class assignment, you can undo and restore all student rosters with 1 click.
              </p>
              {timeLeft > 0 && (
                <div className="pt-2 flex items-center gap-2 text-xs font-bold font-mono text-amber-900">
                  <RefreshCw className="size-3.5 animate-spin text-amber-700" />
                  <span>Rollback Window Expires In: {formatCountdown(timeLeft)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-amber-200">
            {/* Undo / Rollback */}
            <Button
              type="button"
              variant="outline"
              onClick={handleRollback}
              disabled={rollbackMutation.isPending || !rollbackInfo?.is_rollback_available}
              className="w-full sm:w-auto h-11 px-5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {rollbackMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RotateCcw className="size-4 text-rose-600" />
              )}
              <span>Undo / Rollback Promotion</span>
            </Button>

            {/* Finalize & Purge Operational Data */}
            <Button
              type="button"
              onClick={() => setIsFinalizeModalOpen(true)}
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="size-4 text-white" />
              <span>Finalize & Purge Operational Data</span>
            </Button>
          </div>
        </div>
      )}

      {/* Promotion Wizard Modal */}
      <PromotionWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />

      {/* Finalize & Purge Confirmation Dialog */}
      {isFinalizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold font-urbanist text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  Finalize Academic Session & Purge Data
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  Lock the promotion rollback window, purge old operational data (Attendance & Homework), and activate the next session.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFinalizeModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 py-1">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-sans text-emerald-800 space-y-1">
                <p className="font-bold font-urbanist">Data Retention Guarantee</p>
                <p className="text-emerald-700">
                  All Exam Results, Exam Marks, and Financial Fee data will be strictly preserved. Operational daily attendance and homework logs will be purged for a clean slate.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Next Academic Year Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. 2026-2027"
                    value={nextYearName}
                    onChange={(e) => setNextYearName(e.target.value)}
                    className="h-11 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Start Date</label>
                    <Input
                      type="date"
                      value={nextStartDate}
                      onChange={(e) => setNextStartDate(e.target.value)}
                      className="h-11 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">End Date</label>
                    <Input
                      type="date"
                      value={nextEndDate}
                      onChange={(e) => setNextEndDate(e.target.value)}
                      className="h-11 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsFinalizeModalOpen(false)} className="rounded-xl h-11 px-5">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleFinalizePurge}
                  disabled={finalizeMutation.isPending || !nextYearName || !nextStartDate || !nextEndDate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 font-semibold flex items-center gap-2"
                >
                  {finalizeMutation.isPending && <Loader2 className="size-4 animate-spin text-white" />}
                  <span>{finalizeMutation.isPending ? 'Finalizing Session...' : 'Confirm Finalize & Purge'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
