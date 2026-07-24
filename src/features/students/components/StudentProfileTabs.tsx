import React from 'react'

export type ProfileTabType = 'Profile' | 'Attendance' | 'Exams' | 'Fees' | 'Homework'

interface StudentProfileTabsProps {
  activeTab: ProfileTabType
  onTabChange: (tab: ProfileTabType) => void
}

const TABS: ProfileTabType[] = ['Profile', 'Attendance', 'Exams', 'Fees', 'Homework']

export const StudentProfileTabs: React.FC<StudentProfileTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-slate-200 flex items-center gap-8 overflow-x-auto scrollbar-none pt-2">
      {TABS.map((tab) => {
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`pb-3 text-base md:text-lg font-urbanist font-medium transition-all relative shrink-0 cursor-pointer ${
              isActive
                ? 'text-[#2e67b1] font-semibold'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            {tab}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2e67b1] rounded-full animate-in fade-in duration-200" />
            )}
          </button>
        )
      })}
    </div>
  )
}
