import React from 'react'
import { Save, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SettingsSaveFooterProps {
  onSave: () => void
  onDiscard: () => void
  isPending?: boolean
  isDirty?: boolean
}

export const SettingsSaveFooter: React.FC<SettingsSaveFooterProps> = ({
  onSave,
  onDiscard,
  isPending = false,
  isDirty = false,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        {isDirty ? (
          <span className="text-amber-600 font-medium flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            Unsaved changes detected.
          </span>
        ) : (
          <span className="text-slate-400 font-medium">All settings up to date.</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onDiscard}
          disabled={isPending || !isDirty}
          className="h-11 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className="size-3.5" />
          <span>Discard</span>
        </Button>

        <Button
          type="button"
          onClick={onSave}
          disabled={isPending || !isDirty}
          className="h-11 px-6 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-white" />
          ) : (
            <Save className="size-4 text-white" />
          )}
          <span>{isPending ? 'Saving Changes...' : 'Save Changes'}</span>
        </Button>
      </div>
    </div>
  )
}
