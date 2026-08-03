import React from 'react'

interface ReportsTabsNavProps {
  activeTab: 'attendance' | 'academic' | 'analytics'
  setActiveTab: (tab: 'attendance' | 'academic' | 'analytics') => void
}

export const ReportsTabsNav: React.FC<ReportsTabsNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
      {/* Tab 1: Student Attendance */}
      <button
        type="button"
        onClick={() => setActiveTab('attendance')}
        className={`pb-3 text-sm sm:text-base font-bold font-urbanist transition-all relative cursor-pointer ${
          activeTab === 'attendance'
            ? 'text-brand-primary border-b-2 border-brand-primary'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Student Attendance
      </button>

      {/* Tab 2: Academic Performance */}
      <button
        type="button"
        disabled
        className="pb-3 text-sm sm:text-base font-bold font-urbanist text-slate-400 cursor-not-allowed flex items-center gap-2"
      >
        <span>Academic Performance</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
          Soon
        </span>
      </button>

      {/* Tab 3: Institutional Analytics */}
      <button
        type="button"
        disabled
        className="pb-3 text-sm sm:text-base font-bold font-urbanist text-slate-400 cursor-not-allowed flex items-center gap-2"
      >
        <span>Institutional Analytics</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
          Soon
        </span>
      </button>
    </div>
  )
}
