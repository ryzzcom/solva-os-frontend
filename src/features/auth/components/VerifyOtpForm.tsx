import { useState, useEffect, useRef } from 'react'
import { useVerifyOtp } from '../api/useVerifyOtp'
import { useResendOtp } from '../api/useResendOtp'
import { verifyOtpSchema } from '../schemas/verifyOtpSchema'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function VerifyOtpForm() {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''))
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  const verifyMutation = useVerifyOtp()
  const resendMutation = useResendOtp()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const type = location.state?.type || 'signup'

  // Resend Countdown Timer
  useEffect(() => {
    if (countdown === 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric inputs
    if (value !== '' && !/^\d+$/.test(value)) return

    // Take only the last character if multiple are inputted
    const singleDigit = value.slice(-1)
    const newOtpValues = [...otpValues]
    newOtpValues[index] = singleDigit
    setOtpValues(newOtpValues)
    setAuthError(null)

    // Auto-focus next input if a digit is entered
    if (singleDigit !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on Backspace if current box is empty
    if (e.key === 'Backspace' && otpValues[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Only proceed if pasted text consists of numbers
    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.slice(0, 6).split('')
    const newOtpValues = [...otpValues]
    
    digits.forEach((digit, idx) => {
      newOtpValues[idx] = digit
      if (inputRefs.current[idx]) {
        const inputEl = inputRefs.current[idx]
        if (inputEl) inputEl.value = digit
      }
    })

    setOtpValues(newOtpValues)
    
    // Focus the last input box or the appropriate one
    const focusIndex = Math.min(digits.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setSuccessMessage(null)

    const code = otpValues.join('')
    const result = verifyOtpSchema.safeParse({ code })

    if (!result.success) {
      setAuthError(result.error.issues[0].message)
      return
    }

    if (!email) {
      setAuthError('No active verification session. Please register again.')
      return
    }

    verifyMutation.mutate(
      { email, code, type },
      {
        onError: (error: any) => {
          setAuthError(
            error.response?.data?.message ||
              error.message ||
              'OTP verification failed. Please try again.'
          )
        },
        onSuccess: (data) => {
          if (type === 'forgot-password') {
            setSuccessMessage('Verification successful! Proceed to reset your password.')
            navigate('/reset-password', {
              state: { email, token: data.data?.tempToken },
            })
          } else {
            setSuccessMessage('Account verified successfully!')
            window.location.href = '/dashboard'
          }
        },
      }
    )
  }

  const handleResend = () => {
    if (countdown > 0 || resendMutation.isPending) return
    setAuthError(null)
    setSuccessMessage(null)

    if (!email) return
    resendMutation.mutate({ email }, {
      onError: (error: any) => {
        setAuthError(
          error.response?.data?.message ||
            error.message ||
            'Failed to resend verification code. Please try again.'
        )
      },
      onSuccess: () => {
        setSuccessMessage('Verification code resent successfully to your email.')
        setCountdown(30) // Set 30s lockout countdown
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm font-medium animate-in fade-in duration-200">
          {authError}
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg p-3 text-sm font-medium animate-in fade-in duration-200">
          {successMessage}
        </div>
      )}

      {!email && (
        <div className="bg-amber-50 border border-amber-200 text-amber-600 rounded-lg p-3.5 text-sm font-medium animate-in fade-in duration-200 text-center">
          No active verification session. Please go back to the{' '}
          <a href="/signup" className="underline font-bold hover:text-amber-800 transition-colors">
            Sign Up
          </a>{' '}
          page to register your account.
        </div>
      )}

      {/* Code Input Fields */}
      <div className="space-y-3">
        <label className="text-base font-semibold text-slate-800 block text-center lg:text-left">
          Verification Code
        </label>
        
        <div className="flex justify-between gap-2 max-w-[360px] mx-auto lg:mx-0">
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              disabled={!email}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-xl font-bold border border-slate-200 focus:border-[#2e67b1] focus:ring-1 focus:ring-[#2e67b1] outline-none rounded-xl transition-all bg-white disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          ))}
        </div>
      </div>

      {/* Verify Code Button */}
      <Button
        type="submit"
        disabled={!email || verifyMutation.isPending}
        className="w-full h-12 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {verifyMutation.isPending ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Verifying Code...
          </>
        ) : (
          <>
            Verify Code
            <ArrowRight className="size-5" />
          </>
        )}
      </Button>

      {/* Resend Link Section */}
      <div className="text-center space-y-1">
        <p className="text-sm text-slate-500">Didn't receive the code?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || resendMutation.isPending}
          className="text-sm font-semibold text-[#2e67b1] hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed transition-all"
        >
          {resendMutation.isPending ? (
            'Resending...'
          ) : countdown > 0 ? (
            `Resend Code in ${countdown}s`
          ) : (
            'Resend Code'
          )}
        </button>
      </div>
    </form>
  )
}
