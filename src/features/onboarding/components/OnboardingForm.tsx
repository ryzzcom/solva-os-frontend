import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X, ArrowRight, ArrowLeft, Loader2, FileText, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  type OnboardingStep1Input,
  type OnboardingStep2Input,
} from '../schemas/onboardingSchema'
import { useOnboarding } from '../api/useOnboarding'
import { useAuthStore } from '@/store/authStore'

interface OnboardingFormProps {
  step: number
  setStep: (step: number) => void
}

export default function OnboardingForm({ step, setStep }: OnboardingFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [billFile, setBillFile] = useState<File | null>(null)
  const [certFile, setCertFile] = useState<File | null>(null)

  const [authError, setAuthError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const billInputRef = useRef<HTMLInputElement>(null)
  const certInputRef = useRef<HTMLInputElement>(null)

  const onboardingMutation = useOnboarding()

  // Form for Step 1
  const formStep1 = useForm<OnboardingStep1Input>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      school_name: '',
      campus_name: '',
      principal_name: '',
      phone_number: '',
      address: '',
      school_timings: '',
      academic_year: '2025-2026',
    },
  })

  // Form for Step 2
  const formStep2 = useForm<OnboardingStep2Input>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: {
      cnic_number: '',
    },
  })

  // Handle Logo Upload Preview
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo file size must be less than 2MB')
        return
      }
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Document Uploads
  const handleDocChange = (type: 'bill' | 'cert', file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Document file size must be less than 5MB')
        return
      }
      if (type === 'bill') {
        setBillFile(file)
        formStep2.setValue('electricity_bill', file, { shouldValidate: true })
      } else {
        setCertFile(file)
        formStep2.setValue('certificate_of_registration', file, { shouldValidate: true })
      }
    } else {
      if (type === 'bill') {
        setBillFile(null)
        formStep2.setValue('electricity_bill', null as any, { shouldValidate: true })
      } else {
        setCertFile(null)
        formStep2.setValue('certificate_of_registration', null as any, { shouldValidate: true })
      }
    }
  }

  // Handle Step 1 Next Trigger
  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault()
    setAuthError(null)
    const isValid = await formStep1.trigger()
    if (isValid) {
      setStep(2)
    }
  }

  // Handle Final Submission
  const onFinalSubmit = (data2: OnboardingStep2Input) => {
    setAuthError(null)
    const data1 = formStep1.getValues()

    onboardingMutation.mutate(
      {
        ...data1,
        cnic_number: data2.cnic_number,
        school_logo: logoFile,
        electricity_bill: data2.electricity_bill,
        certificate_of_registration: data2.certificate_of_registration,
      },
      {
        onError: (error: any) => {
          setAuthError(
            error.response?.data?.message ||
              error.message ||
              'Onboarding setup failed. Please check details and try again.'
          )
        },
        onSuccess: (res) => {
          setSuccessMsg(res.message || 'School details setup successfully and is pending approval.')
          if (res.data) {
            if (res.data.user) {
              useAuthStore.getState().updateUser({
                fullName: res.data.user.full_name,
                profile_picture_url: res.data.user.profile_picture_url,
              })
            }
            if (res.data.school) {
              useAuthStore.getState().updateSchool({
                id: res.data.school.id,
                schoolCode: res.data.school.school_code,
                name: res.data.school.name,
                email: res.data.school.email,
                logo_url: res.data.school.logo_url,
              })
            }
          }
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 3000)
        },
      }
    )
  }

  if (successMsg) {
    return (
      <div className="text-center py-10 space-y-4 animate-in fade-in duration-300">
        <div className="size-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="size-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Setup Submitted!</h2>
        <p className="text-sm text-slate-500 max-w-[420px] mx-auto leading-relaxed">
          {successMsg} Your account application is currently pending admin approval. Redirecting you to the dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3.5 text-sm font-medium mb-6 animate-in fade-in duration-200">
          {authError}
        </div>
      )}

      {step === 1 ? (
        <form className="space-y-6">
          {/* Logo Upload Block */}
          <div className="space-y-2">
            <Label className="text-slate-800 font-semibold block text-center lg:text-left">
              School Logo
            </Label>
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />

            {logoPreview ? (
              <div className="relative w-36 h-36 mx-auto lg:mx-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm group">
                <img src={logoPreview} alt="School Logo Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setLogoPreview(null)
                    setLogoFile(null)
                  }}
                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                >
                  <X className="size-6" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#2e67b1] hover:bg-[#2e67b1]/5 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 flex flex-col items-center justify-center gap-2 group"
              >
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#2e67b1]/10 group-hover:text-[#2e67b1] transition-colors">
                  <Upload className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700">Upload School Logo</p>
                  <p className="text-xs text-slate-400">PNG, JPG up to 2MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Step 1 Grid Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="school_name">School Name</Label>
              <Input
                id="school_name"
                placeholder="Enter your school name"
                className="h-11 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] bg-white"
                {...formStep1.register('school_name')}
              />
              {formStep1.formState.errors.school_name && (
                <p className="text-red-500 text-xs">{formStep1.formState.errors.school_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="campus_name">Campus Name</Label>
              <Input
                id="campus_name"
                placeholder="Enter campus name"
                className="h-11 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] bg-white"
                {...formStep1.register('campus_name')}
              />
              {formStep1.formState.errors.campus_name && (
                <p className="text-red-500 text-xs">{formStep1.formState.errors.campus_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="principal_name">Principal Full Name</Label>
              <Input
                id="principal_name"
                placeholder="Enter principal name"
                className="h-11 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] bg-white"
                {...formStep1.register('principal_name')}
              />
              {formStep1.formState.errors.principal_name && (
                <p className="text-red-500 text-xs">{formStep1.formState.errors.principal_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                placeholder="Enter phone number"
                className="h-11 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] bg-white"
                {...formStep1.register('phone_number')}
              />
              {formStep1.formState.errors.phone_number && (
                <p className="text-red-500 text-xs">{formStep1.formState.errors.phone_number.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter your address"
              className="h-11 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] bg-white"
              {...formStep1.register('address')}
            />
            {formStep1.formState.errors.address && (
              <p className="text-red-500 text-xs">{formStep1.formState.errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="school_timings">School Timings</Label>
              <Input
                id="school_timings"
                placeholder="Enter your school timings *"
                className="h-11 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] bg-white"
                {...formStep1.register('school_timings')}
              />
              {formStep1.formState.errors.school_timings && (
                <p className="text-red-500 text-xs">{formStep1.formState.errors.school_timings.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="academic_year">Academic Year *</Label>
              <Input
                id="academic_year"
                placeholder="2025-2026"
                className="h-11 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] bg-white"
                {...formStep1.register('academic_year')}
              />
              {formStep1.formState.errors.academic_year && (
                <p className="text-red-500 text-xs">{formStep1.formState.errors.academic_year.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={handleNext}
              className="h-12 px-6 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]"
            >
              Next
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={formStep2.handleSubmit(onFinalSubmit)} className="space-y-6">
          {/* CNIC Number */}
          <div className="space-y-1.5">
            <Label htmlFor="cnic_number">CNIC Number</Label>
            <Input
              id="cnic_number"
              placeholder="Enter 13-digit CNIC number"
              maxLength={13}
              className="h-11 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] bg-white"
              {...formStep2.register('cnic_number')}
            />
            {formStep2.formState.errors.cnic_number && (
              <p className="text-red-500 text-xs">{formStep2.formState.errors.cnic_number.message}</p>
            )}
          </div>

          {/* Document Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Electricity Bill Upload */}
            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold block text-center lg:text-left">
                Upload Electricity Bill
              </Label>
              <input
                type="file"
                ref={billInputRef}
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleDocChange('bill', e.target.files?.[0] || null)}
              />

              {billFile ? (
                <div className="relative border border-emerald-200 bg-emerald-50/30 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <FileText className="size-5" />
                    </div>
                    <div className="max-w-[180px]">
                      <p className="text-sm font-semibold text-slate-800 truncate">{billFile.name}</p>
                      <p className="text-xs text-slate-400">{(billFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDocChange('bill', null)}
                    className="size-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => billInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-[#2e67b1] hover:bg-[#2e67b1]/5 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#2e67b1]/10 group-hover:text-[#2e67b1] transition-colors">
                    <Upload className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">Upload Bill File</p>
                    <p className="text-xs text-slate-400">PDF, PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
              {formStep2.formState.errors.electricity_bill && (
                <p className="text-red-500 text-xs text-center lg:text-left">
                  {formStep2.formState.errors.electricity_bill.message as string}
                </p>
              )}
            </div>

            {/* Certificate of Registration Upload */}
            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold block text-center lg:text-left">
                Upload Certificate of Registration
              </Label>
              <input
                type="file"
                ref={certInputRef}
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleDocChange('cert', e.target.files?.[0] || null)}
              />

              {certFile ? (
                <div className="relative border border-emerald-200 bg-emerald-50/30 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <FileText className="size-5" />
                    </div>
                    <div className="max-w-[180px]">
                      <p className="text-sm font-semibold text-slate-800 truncate">{certFile.name}</p>
                      <p className="text-xs text-slate-400">{(certFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDocChange('cert', null)}
                    className="size-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => certInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-[#2e67b1] hover:bg-[#2e67b1]/5 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#2e67b1]/10 group-hover:text-[#2e67b1] transition-colors">
                    <Upload className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">Upload Registration Doc</p>
                    <p className="text-xs text-slate-400">PDF, PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
              {formStep2.formState.errors.certificate_of_registration && (
                <p className="text-red-500 text-xs text-center lg:text-left">
                  {formStep2.formState.errors.certificate_of_registration.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={onboardingMutation.isPending}
              onClick={() => setStep(1)}
              className="h-12 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <ArrowLeft className="size-5" />
              Back
            </Button>

            <Button
              type="submit"
              disabled={onboardingMutation.isPending}
              className="h-12 px-6 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {onboardingMutation.isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Submitting Setup...
                </>
              ) : (
                <>
                  Submit Setup
                  <CheckCircle2 className="size-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
