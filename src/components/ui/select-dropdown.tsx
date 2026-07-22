import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onChange: (val: string) => void
  placeholder: string
  className?: string
  disabled?: boolean
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={`relative h-[42px] inline-block ${className}`}>
      {/* Trigger Button matching Figma Node 83:720 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`h-[42px] px-4 py-2 border rounded-[8px] flex items-center justify-between gap-2 font-medium font-urbanist text-[18px] leading-[20px] transition-all w-full ${
          disabled
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            : 'bg-[#f5f4fb] border-black/10 hover:border-[#2e67b1]/30 text-[#2e67b1] cursor-pointer shadow-xs active:scale-[0.98]'
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`size-[18px] shrink-0 transition-transform duration-200 ${
            disabled ? 'text-slate-400 opacity-40' : 'text-[#2e67b1] opacity-50'
          } ${isOpen ? 'rotate-180 opacity-100' : ''}`}
        />
      </button>

      {/* Premium Custom Dropdown Popup Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 min-w-full w-max max-h-60 overflow-y-auto bg-white border border-slate-100 rounded-[12px] shadow-2xl p-1.5 space-y-0.5 animate-in fade-in-80 zoom-in-95 duration-150">
          <div
            onClick={() => {
              onChange('')
              setIsOpen(false)
            }}
            className={`px-3.5 py-2 text-sm md:text-base font-medium font-urbanist rounded-[8px] cursor-pointer flex items-center justify-between transition-colors ${
              !value
                ? 'bg-[#f5f4fb] text-[#2e67b1] font-semibold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-[#2e67b1]'
            }`}
          >
            <span>{placeholder}</span>
            {!value && <Check className="size-4 text-[#2e67b1]" />}
          </div>

          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`px-3.5 py-2 text-sm md:text-base font-medium font-urbanist rounded-[8px] cursor-pointer flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#f5f4fb] text-[#2e67b1] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#2e67b1]'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="size-4 text-[#2e67b1]" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
