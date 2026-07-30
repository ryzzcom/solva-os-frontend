import React from 'react'
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react'

interface AttendanceStatusBadgeProps {
  status: string
}

export const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({ status }) => {
  const s = (status || '').toUpperCase()

  switch (s) {
    case 'PRESENT':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold font-urbanist">
          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
          <span>Present</span>
        </span>
      )
    case 'ABSENT':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold font-urbanist">
          <XCircle className="size-3.5 text-rose-600 shrink-0" />
          <span>Absent</span>
        </span>
      )
    case 'LATE':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold font-urbanist">
          <Clock className="size-3.5 text-amber-600 shrink-0" />
          <span>Late</span>
        </span>
      )
    case 'LEAVE':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold font-urbanist">
          <Calendar className="size-3.5 text-blue-600 shrink-0" />
          <span>On Leave</span>
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold font-urbanist">
          <span>{status}</span>
        </span>
      )
  }
}
