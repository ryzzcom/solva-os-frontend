import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPasswordSchema, type ResetPasswordInput } from '../schemas/resetPasswordSchema'
import { useResetPassword } from '../api/useResetPassword'

export default function ResetPasswordForm() {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const resetPasswordMutation = useResetPassword()
  const location = useLocation()
  const navigate = useNavigate()
  
  const token = location.state?.token || ''

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: ResetPasswordInput) => {
    setAuthError(null)
    setSuccessMessage(null)

    if (!token) {
      setAuthError('No active password reset session. Please request a new reset code.')
      return
    }

    resetPasswordMutation.mutate(
      {
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        onError: (error: any) => {
          setAuthError(
            error.response?.data?.message ||
              error.message ||
              'Failed to reset password. Please try again.'
          )
        },
        onSuccess: () => {
          setSuccessMessage('Password reset successfully! Redirecting to login...')
          setTimeout(() => {
            navigate('/login')
          }, 3000)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
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

      {!token && (
        <div className="bg-amber-50 border border-amber-200 text-amber-600 rounded-lg p-3.5 text-sm font-medium animate-in fade-in duration-200 text-center">
          No active password reset session. Please go back to the{' '}
          <a href="/forgot-password" className="underline font-bold hover:text-amber-800 transition-colors">
            Forgot Password
          </a>{' '}
          page.
        </div>
      )}

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-base font-semibold text-slate-800">
          New Password
        </Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Lock className="size-5" />
          </span>
          <Input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            disabled={!token}
            className="pl-11 pr-11 h-12 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] focus-visible:ring-[#2e67b1]/20 bg-white disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed"
            {...register('newPassword')}
          />
          <button
            type="button"
            disabled={!token}
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showNewPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-base font-semibold text-slate-800">
          Confirm Password
        </Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Lock className="size-5" />
          </span>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter new password"
            disabled={!token}
            className="pl-11 pr-11 h-12 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] focus-visible:ring-[#2e67b1]/20 bg-white disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            disabled={!token}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Reset Password Button */}
      <Button
        type="submit"
        disabled={!token || resetPasswordMutation.isPending}
        className="w-full h-12 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {resetPasswordMutation.isPending ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Resetting Password...
          </>
        ) : (
          <>
            Reset Password
            <KeyRound className="size-5" />
          </>
        )}
      </Button>
    </form>
  )
}
