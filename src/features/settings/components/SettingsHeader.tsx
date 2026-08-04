import React from 'react'
import { ChevronRight } from 'lucide-react'

export const SettingsHeader: React.FC = () => {
  return (
    <div className="space-y-4 mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <span>Principal Dashboard.</span>
        <ChevronRight className="size-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">Settings</span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-urbanist">
          Settings & Profile Configuration
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl font-sans">
          Manage your personal principal profile, school organizational information, branding logos, and system preferences.
        </p>
      </div>
    </div>
  )
}
