import React from 'react'
import { AlertCircle, Check } from 'lucide-react'

interface FormAlertProps {
  error?: string | null
  success?: string | null
}

export const FormAlert: React.FC<FormAlertProps> = ({ error, success }) => {
  if (!error && !success) return null

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-sans flex items-start gap-3 animate-in fade-in duration-200 shadow-xs">
          <AlertCircle className="size-5 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-sans flex items-center gap-3 animate-in fade-in duration-200 shadow-xs">
          <Check className="size-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{success}</span>
        </div>
      )}
    </div>
  )
}
