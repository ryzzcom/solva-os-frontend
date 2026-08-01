import React from 'react'
import {
  ArrowLeft,
  X,
  Calendar,
  Clock,
  Users,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { usePtmDetails } from '../api/usePtmDetails'
import type { PtmStatus } from '../types/ptm.types'

interface PtmDetailsModalProps {
  ptmId: string | null
  isOpen: boolean
  onClose: () => void
}

export const PtmDetailsModal: React.FC<PtmDetailsModalProps> = ({
  ptmId,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !ptmId) return null

  const { data: detailsData, isLoading, isError, refetch } = usePtmDetails(ptmId)

  // Status badge pill renderer
  const renderStatusBadge = (status?: PtmStatus | string) => {
    const normStatus = (status || '').toLowerCase()

    if (normStatus === 'completed') {
      return (
        <span className="px-3.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold font-sans">
          Completed
        </span>
      )
    }

    if (normStatus === 'cancelled') {
      return (
        <span className="px-3.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold font-sans">
          Cancelled
        </span>
      )
    }

    return (
      <span className="px-3.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold font-sans">
        Upcoming
      </span>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-card-border rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold font-urbanist text-slate-600 hover:text-navy-main transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Back to List</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 2. Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          {isLoading ? (
            <div className="py-12 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-3">
              <Loader2 className="size-8 text-brand-primary animate-spin" />
              <span>Loading meeting details...</span>
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-rose-700 font-sans space-y-3">
              <AlertCircle className="size-8 text-rose-600 mx-auto" />
              <p className="font-semibold text-sm">Failed to load meeting details.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : detailsData ? (
            <>
              {/* Status Badge */}
              <div>{renderStatusBadge(detailsData.status)}</div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold font-urbanist text-navy-main">
                  {detailsData.title}
                </h2>
                <p className="text-sm font-sans text-slate-600 leading-relaxed">
                  {detailsData.description || 'No additional notes provided for this meeting.'}
                </p>
              </div>

              {/* Metadata List Items */}
              <div className="space-y-4 border-t border-slate-100 pt-6">
                {/* Date Item */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-soft rounded-xl text-brand-primary shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-sans text-slate-500 block">Date</span>
                    <span className="font-bold text-sm font-urbanist text-slate-800">
                      {detailsData.date}
                    </span>
                  </div>
                </div>

                {/* Time Item */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-soft rounded-xl text-brand-primary shrink-0">
                    <Clock className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-sans text-slate-500 block">Time</span>
                    <span className="font-bold text-sm font-urbanist text-slate-800">
                      {detailsData.start_time} {detailsData.end_time ? `- ${detailsData.end_time}` : ''}
                    </span>
                  </div>
                </div>

                {/* Target Audience Item */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-soft rounded-xl text-brand-primary shrink-0">
                    <Users className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-sans text-slate-500 block">Target Audience</span>
                    <span className="font-bold text-sm font-urbanist text-slate-800">
                      {detailsData.class_section}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default PtmDetailsModal
