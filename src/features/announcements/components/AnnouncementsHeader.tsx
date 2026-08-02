import React from 'react'
import { Sparkles, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnnouncementsHeaderProps {
  onCreateNotice?: () => void
  onCreateExam?: () => void
}

export const AnnouncementsHeader: React.FC<AnnouncementsHeaderProps> = ({
  onCreateNotice,
  onCreateExam,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <span>Principal Dashboard.</span>
        <ChevronRight className="size-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">Announcements</span>
      </div>

      {/* Main Title & Action Buttons Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-urbanist">
            Announcements
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Communicate critical updates, events, and school news to the Solva community from a central command hub.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Create Exam Button */}
          <Button
            variant="outline"
            onClick={onCreateExam}
            className="h-11 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
          >
            <Sparkles className="size-4 text-brand-primary" />
            <span>Create Exam</span>
          </Button>

          {/* Create Notice Button */}
          <Button
            onClick={onCreateNotice}
            className="h-11 px-5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Create Notice</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementsHeader
