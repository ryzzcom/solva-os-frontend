import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SettingsHeader } from '../components/SettingsHeader'
import { SettingsTabsNav, type SettingsTabType } from '../components/SettingsTabsNav'
import { PrincipalProfileForm } from '../components/PrincipalProfileForm'
import { SchoolInfoForm } from '../components/SchoolInfoForm'
import { SettingsSaveFooter } from '../components/SettingsSaveFooter'
import { AcademicYearTab } from '../components/AcademicYearTab'
import { useProfileAndSchoolSettings } from '../api/useProfileAndSchoolSettings'
import { useUpdateProfileAndSchool } from '../api/useUpdateProfileAndSchool'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabType>('profile_school')

  const { data, isLoading, isError, refetch } = useProfileAndSchoolSettings()
  const updateMutation = useUpdateProfileAndSchool()

  const profile = data?.profile
  const school = data?.school

  // Local Form States
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [campusName, setCampusName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [schoolPhone, setSchoolPhone] = useState('')
  const [address, setAddress] = useState('')

  // Image Upload File & Preview States
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)
  const [schoolLogoFile, setSchoolLogoFile] = useState<File | null>(null)
  const [schoolLogoPreview, setSchoolLogoPreview] = useState<string | null>(null)

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Pre-fill form state when query data arrives
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhoneNumber(profile.phone_number || '')
    }
    if (school) {
      setSchoolName(school.school_name || '')
      setCampusName(school.campus_name || '')
      setWebsiteUrl(school.website_url || '')
      setSchoolPhone(school.phone_number || '')
      setAddress(school.address || '')
    }
  }, [profile, school])

  const handleDiscard = () => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhoneNumber(profile.phone_number || '')
    }
    if (school) {
      setSchoolName(school.school_name || '')
      setCampusName(school.campus_name || '')
      setWebsiteUrl(school.website_url || '')
      setSchoolPhone(school.phone_number || '')
      setAddress(school.address || '')
    }
    setProfilePicFile(null)
    setProfilePicPreview(null)
    setSchoolLogoFile(null)
    setSchoolLogoPreview(null)
    setSuccessMessage(null)
  }

  const handleSave = () => {
    setSuccessMessage(null)
    updateMutation.mutate(
      {
        full_name: fullName,
        phone_number: phoneNumber,
        school_name: schoolName,
        campus_name: campusName,
        website_url: websiteUrl,
        school_phone: schoolPhone,
        address: address,
        profile_picture: profilePicFile,
        school_logo: schoolLogoFile,
      },
      {
        onSuccess: () => {
          setSuccessMessage('Profile & school settings saved successfully.')
          setProfilePicFile(null)
          setProfilePicPreview(null)
          setSchoolLogoFile(null)
          setSchoolLogoPreview(null)
          setTimeout(() => setSuccessMessage(null), 4000)
        },
      }
    )
  }

  const isDirty =
    Boolean(profilePicFile) ||
    Boolean(schoolLogoFile) ||
    fullName !== (profile?.full_name || '') ||
    phoneNumber !== (profile?.phone_number || '') ||
    schoolName !== (school?.school_name || '') ||
    campusName !== (school?.campus_name || '') ||
    websiteUrl !== (school?.website_url || '') ||
    schoolPhone !== (school?.phone_number || '') ||
    address !== (school?.address || '')

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <SettingsHeader />

      {/* Settings Tabs Nav */}
      <SettingsTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Feedback Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* TAB 1: Profile & School Info */}
      {activeTab === 'profile_school' && (
        isLoading ? (
          <div className="p-16 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
            <Loader2 className="size-8 text-brand-primary animate-spin" />
            <span>Loading profile & school settings...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-rose-700 font-sans space-y-3 bg-white border border-rose-200 rounded-2xl shadow-xs">
            <AlertCircle className="size-8 text-rose-600 mx-auto" />
            <p className="font-semibold text-sm">Failed to load settings.</p>
            <Button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Principal Profile Form Card */}
            <PrincipalProfileForm
              profile={profile}
              fullName={fullName}
              setFullName={setFullName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              profilePicFile={profilePicFile}
              setProfilePicFile={setProfilePicFile}
              profilePicPreview={profilePicPreview}
              setProfilePicPreview={setProfilePicPreview}
            />

            {/* School Info Form Card */}
            <SchoolInfoForm
              school={school}
              schoolName={schoolName}
              setSchoolName={setSchoolName}
              campusName={campusName}
              setCampusName={setCampusName}
              websiteUrl={websiteUrl}
              setWebsiteUrl={setWebsiteUrl}
              schoolPhone={schoolPhone}
              setSchoolPhone={setSchoolPhone}
              address={address}
              setAddress={setAddress}
              schoolLogoFile={schoolLogoFile}
              setSchoolLogoFile={setSchoolLogoFile}
              schoolLogoPreview={schoolLogoPreview}
              setSchoolLogoPreview={setSchoolLogoPreview}
            />

            {/* Save & Discard Action Footer */}
            <SettingsSaveFooter
              onSave={handleSave}
              onDiscard={handleDiscard}
              isPending={updateMutation.isPending}
              isDirty={isDirty}
            />
          </div>
        )
      )}

      {/* TAB 2: Academic Year & Student Promotion */}
      {activeTab === 'academic_year' && <AcademicYearTab />}
    </div>
  )
}
