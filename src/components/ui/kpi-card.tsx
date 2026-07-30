import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface KpiStatCardProps {
  label: string
  value: string | number
  subValue?: string
  accentColor?: string // e.g. '#2e67b1', '#f97316', '#22c55e', '#a855f7'
  icon?: LucideIcon
  progressPercentage?: number
}

export const KpiStatCard: React.FC<KpiStatCardProps> = ({
  label,
  value,
  subValue,
  accentColor = '#2e67b1',
  icon: Icon,
  progressPercentage,
}) => {
  return (
    <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-2">
      <div
        className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-center justify-between pl-2">
        <span className="text-sm font-sans font-normal text-slate-600">{label}</span>
        {Icon && <Icon className="size-5 shrink-0" style={{ color: accentColor }} />}
      </div>

      <div className="pl-2 space-y-1">
        <p className="text-3xl font-bold font-urbanist text-[#0f172a]" style={{ color: accentColor }}>
          {value}{' '}
          {subValue && <span className="text-sm font-normal text-slate-500">{subValue}</span>}
        </p>

        {progressPercentage !== undefined && (
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, progressPercentage)}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
