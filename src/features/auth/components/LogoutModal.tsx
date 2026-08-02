import React from 'react'
import { createPortal } from 'react-dom'
import { X, LogOut, Loader2, AlertTriangle } from 'lucide-react'

interface LogoutModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
  error?: Error | null
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  open,
  onClose,
  onConfirm,
  isPending = false,
  error,
}) => {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6 md:p-8 space-y-6 text-center relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="size-4" />
        </button>

        {/* Icon Badge */}
        <div className="size-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border-4 border-rose-50 shadow-xs">
          <LogOut className="size-7" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-urbanist text-slate-900">
            Log Out of Solva OS?
          </h2>
          <p className="text-sm font-sans text-slate-500 max-w-xs mx-auto leading-relaxed">
            Are you sure you want to end your current session? You will need to log back in to access your dashboard.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="size-4 text-rose-600 shrink-0" />
            <span>{error.message || 'Failed to logout. Please try again.'}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full h-11 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold font-urbanist bg-white hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold font-urbanist transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Logging Out...
              </>
            ) : (
              'Log Out'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
