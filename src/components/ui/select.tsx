import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  sublabel?: string
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-3.5 bg-white border border-card-border rounded-xl text-left text-xs font-semibold font-urbanist text-navy-main focus:outline-none focus:border-brand-primary flex items-center justify-between transition-colors disabled:opacity-50 cursor-pointer"
      >
        <span className={selectedOption ? 'text-navy-main font-semibold' : 'text-slate-400 font-sans font-normal'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`size-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-card-border rounded-xl shadow-lg max-h-56 overflow-y-auto p-1.5 space-y-1 animate-in fade-in duration-150">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs font-sans text-slate-400 text-center">No options available</div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-urbanist cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-brand-soft text-brand-primary font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{opt.label}</span>
                    {opt.sublabel && <span className="text-[10px] font-sans text-slate-500">{opt.sublabel}</span>}
                  </div>
                  {isSelected && <Check className="size-3.5 text-brand-primary stroke-[3]" />}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
