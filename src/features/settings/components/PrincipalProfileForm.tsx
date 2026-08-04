import React, { useRef } from 'react'
import { Camera, Lock, User, Mail, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { PrincipalProfileData } from '../types/settings.types'

interface PrincipalProfileFormProps {
  profile?: PrincipalProfileData
  fullName: string
  setFullName: (val: string) => void
  phoneNumber: string
  setPhoneNumber: (val: string) => void
  profilePicFile: File | null
  setProfilePicFile: (file: File | null) => void
  profilePicPreview: string | null
  setProfilePicPreview: (url: string | null) => void
}

export const PrincipalProfileForm: React.FC<PrincipalProfileFormProps> = ({
  profile,
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  setProfilePicFile,
  profilePicPreview,
  setProfilePicPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicFile(file)
      const previewUrl = URL.createObjectURL(file)
      setProfilePicPreview(previewUrl)
    }
  }

  const displayAvatar = profilePicPreview || profile?.profile_picture_url || ''

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold font-urbanist text-slate-900">
            Personal Profile Settings
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Update your principal name, profile picture, and contact information.
          </p>
        </div>
      </div>

      {/* Avatar Picker */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="size-24 rounded-full border-2 border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="Principal Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="size-10 text-slate-400" />
            )}
          </div>

          <div className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="size-6 text-white" />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-slate-900 font-urbanist">Profile Picture</h3>
          <p className="text-xs text-slate-500 font-sans">
            JPG, PNG or GIF. Max file size 5MB.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold text-brand-primary hover:text-brand-hover cursor-pointer"
          >
            Upload New Photo
          </button>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="full_name" className="text-xs font-semibold text-slate-700">
            Full Name
          </label>
          <div className="relative">
            <Input
              id="full_name"
              type="text"
              placeholder="e.g. Dr. Sarah Ahmed"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 pl-10 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
            />
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Email Address (Protected Read-Only) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="email" className="text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <Lock className="size-3 text-slate-400" /> Protected
            </span>
          </div>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={profile?.email || ''}
              disabled
              readOnly
              className="h-11 pl-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs font-medium cursor-not-allowed"
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="phone_number" className="text-xs font-semibold text-slate-700">
            Personal Phone Number
          </label>
          <div className="relative">
            <Input
              id="phone_number"
              type="text"
              placeholder="e.g. +92 300 1234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-11 pl-10 rounded-xl border border-slate-200 text-xs font-medium text-slate-900"
            />
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
