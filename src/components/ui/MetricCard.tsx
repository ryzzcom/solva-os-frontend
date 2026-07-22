import React from 'react'

export interface MetricCardProps {
  value: string | number
  label: string
  gradientClass: string
  iconColorClass: string
  icon: React.ComponentType<{ className?: string }>
  truncateValue?: boolean
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  gradientClass,
  iconColorClass,
  icon: Icon,
  truncateValue = false,
}) => {
  return (
    <div
      className={`bg-gradient-to-r ${gradientClass} rounded-[12px] p-5 md:px-5 md:py-6 flex items-center justify-between shadow-lg transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-xl`}
    >
      <div className="space-y-1">
        <h2
          className={`text-3xl md:text-[32px] font-semibold text-white leading-[40px] font-urbanist ${
            truncateValue ? 'truncate max-w-[200px]' : ''
          }`}
        >
          {value}
        </h2>
        <p className="text-[#ededed] text-sm md:text-base font-normal leading-[24px]">
          {label}
        </p>
      </div>
      <div
        className={`size-[62px] rounded-full bg-white ${iconColorClass} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}
      >
        <Icon className="size-[32px]" />
      </div>
    </div>
  )
}
