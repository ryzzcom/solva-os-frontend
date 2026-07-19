import { useState } from 'react'
import OnboardingForm from '../components/OnboardingForm'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-[#2e67b1]/10 selection:text-[#2e67b1]">
      
      {/* Top Navigation / Layout Header */}
      <div className="w-full max-w-[900px] mx-auto pt-8 px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            School Setup
          </h1>
          <span className="text-sm font-semibold text-slate-500">
            Step {step} of 2
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-[#2e67b1] rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${step === 1 ? 50 : 100}%` }}
          />
        </div>
      </div>

      {/* Main Container Card */}
      <div className="flex-1 w-full max-w-[900px] mx-auto py-8 px-6">
        <div className="w-full bg-white border border-slate-100 rounded-[28px] p-6 md:p-10 shadow-xl shadow-slate-100/50">
          <div className="space-y-1 mb-8">
            <h2 className="text-xl font-bold text-slate-800 font-urbanist">
              {step === 1 ? 'School Information' : 'Documents & Verification'}
            </h2>
            <p className="text-sm text-slate-400">
              {step === 1
                ? "Let's start with the basic details of your institution."
                : 'Upload proof documents and identity details to verify your registration request.'}
            </p>
          </div>

          <OnboardingForm step={step} setStep={setStep} />
        </div>
      </div>

      {/* Footer credits */}
      <div className="w-full text-center py-6 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Solva OS. All rights reserved.
      </div>

    </div>
  )
}
