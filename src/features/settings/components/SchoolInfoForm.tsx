import React, { useRef } from 'react'
import { Building2, Globe, Phone, MapPin, Upload, Image as ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { SchoolInfoData } from '../types/settings.types'

interface SchoolInfoFormProps {
  school?: SchoolInfoData
  schoolName: string
  setSchoolName: (val: string) => void
  campusName: string
  setCampusName: (val: string) => void
  websiteUrl: string
  setWebsiteUrl: (val: string) => void
  schoolPhone: string
  setSchoolPhone: (val: string) => void
  address: string
  setAddress: (val: string) => void
  schoolLogoFile: File | null
  setSchoolLogoFile: (file: File | null) => void
  schoolLogoPreview: string | null
  setSchoolLogoPreview: (url: string | null) => void
}

export const SchoolInfoForm: React.FC<SchoolInfoFormProps> = ({
  school,
  schoolName,
  setSchoolName,
  campusName,
  setCampusName,
  websiteUrl,
  setWebsiteUrl,
  schoolPhone,
  setSchoolPhone,
  address,
  setAddress,
  setSchoolLogoFile,
  schoolLogoPreview,
  setSchoolLogoPreview,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSchoolLogoFile(file)
      const previewUrl = URL.createObjectURL(file)
      setSchoolLogoPreview(previewUrl)
    }
  }

  const displayLogo = schoolLogoPreview || school?.logo_url || ''

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold font-urbanist text-slate-900">
            School Information & Branding
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Update institutional details, campus name, website URL, and school logo.
          </p>
        </div>
      </div>

      {/* School Logo Picker */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div
          className="size-24 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-2 flex flex-col items-center justify-center relative cursor-pointer group hover:border-brand-primary transition-all overflow-hidden"
          onClick={() => logoInputRef.current?.click()}
        >
          {displayLogo ? (
            <img src={displayLogo} alt="School Logo" className="w-full h-full object-contain" />
          ) : (
            <div className="text-center space-y-1">
              <ImageIcon className="size-6 text-slate-400 mx-auto" />
              <span className="text-[10px] font-semibold text-slate-500 block">Upload Logo</span>
            </div>
          )}

          <div className="absolute inset-0 bg-slate-950/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="size-5 text-white" />
          </div>

          <input
            type="file"
            ref={logoInputRef}
            onChange={handleLogoChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-slate-900 font-urbanist">School Logo / Emblem</h3>
          <p className="text-xs text-slate-500 font-sans">
            Recommended dimensions 400x400. PNG or SVG preferred.
          </p>
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="text-xs font-semibold text-brand-primary hover:text-brand-hover cursor-pointer"
          >
            Upload School Logo
          </button>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* School Name */}
        <div className="space-y-1.5">
          <label htmlFor="school_name" className="text-xs font-semibold text-slate-700">
            School Name
          </label>
          <div className="relative">
            <Input
              id="school_name"
              type="text"
              placeholder="e.g. Karachi Public School"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="h-11 pl-10 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
            />
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Campus Name */}
        <div className="space-y-1.5">
          <label htmlFor="campus_name" className="text-xs font-semibold text-slate-700">
            Campus Name / Branch
          </label>
          <div className="relative">
            <Input
              id="campus_name"
              type="text"
              placeholder="e.g. Gulshan Campus"
              value={campusName}
              onChange={(e) => setCampusName(e.target.value)}
              className="h-11 pl-10 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
            />
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Website URL */}
        <div className="space-y-1.5">
          <label htmlFor="website_url" className="text-xs font-semibold text-slate-700">
            Website URL
          </label>
          <div className="relative">
            <Input
              id="website_url"
              type="url"
              placeholder="https://www.kps.edu.pk"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="h-11 pl-10 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
            />
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* School Phone */}
        <div className="space-y-1.5">
          <label htmlFor="school_phone" className="text-xs font-semibold text-slate-700">
            Institutional Phone Number
          </label>
          <div className="relative">
            <Input
              id="school_phone"
              type="text"
              placeholder="e.g. +92 21 34567890"
              value={schoolPhone}
              onChange={(e) => setSchoolPhone(e.target.value)}
              className="h-11 pl-10 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
            />
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="address" className="text-xs font-semibold text-slate-700">
            School Physical Address
          </label>
          <div className="relative">
            <Input
              id="address"
              type="text"
              placeholder="e.g. Block 5, Gulshan-e-Iqbal, Karachi"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-11 pl-10 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
            />
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
