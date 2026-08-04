import React from 'react'

export type SettingsTabType = 'profile_school' | 'academic_year' | 'user_roles' | 'security' | 'subscription'

interface SettingsTabsNavProps {
  activeTab: SettingsTabType
  setActiveTab: (tab: SettingsTabType) => void
}

export const SettingsTabsNav: React.FC<SettingsTabsNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex items-center gap-6 border-b border-slate-200 mb-6 overflow-x-auto">
      {/* Tab 1: Profile & School Info */}
      <button
        type="button"
        onClick={() => setActiveTab('profile_school')}
        className={`pb-3 text-sm sm:text-base font-bold font-urbanist transition-all whitespace-nowrap cursor-pointer ${
          activeTab === 'profile_school'
            ? 'text-brand-primary border-b-2 border-brand-primary'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Profile & School Info
      </button>

      {/* Tab 2: Academic Year */}
      <button
        type="button"
        disabled
        className="pb-3 text-sm sm:text-base font-bold font-urbanist text-slate-400 cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
      >
        <span>Academic Year</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
          Soon
        </span>
      </button>

      {/* Tab 3: User Roles */}
      <button
        type="button"
        disabled
        className="pb-3 text-sm sm:text-base font-bold font-urbanist text-slate-400 cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
      >
        <span>User Roles</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
          Soon
        </span>
      </button>

      {/* Tab 4: Security */}
      <button
        type="button"
        disabled
        className="pb-3 text-sm sm:text-base font-bold font-urbanist text-slate-400 cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
      >
        <span>Security</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
          Soon
        </span>
      </button>

      {/* Tab 5: Subscription */}
      <button
        type="button"
        disabled
        className="pb-3 text-sm sm:text-base font-bold font-urbanist text-slate-400 cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
      >
        <span>Subscription</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
          Soon
        </span>
      </button>
    </div>
  )
}
