import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { signupSchema, type SignupInput } from '../schemas/signupSchema'
import { useSignup } from '../api/useSignup'
import { extractAuthErrorMessage } from '../utils/extractError'
import { GoogleLoginButton } from './GoogleLoginButton'

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const signupMutation = useSignup()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  })

  const onSubmit = (data: SignupInput) => {
    setAuthError(null)
    signupMutation.mutate(data, {
      onError: (error: any) => {
        setAuthError(extractAuthErrorMessage(error, 'Registration failed. Please try again.'))
      },
      onSuccess: (_, variables) => {
        navigate('/verify-otp', { state: { email: variables.email } })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm font-medium animate-in fade-in duration-200">
          {authError}
        </div>
      )}

      {/* Email Address */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-semibold text-slate-800">
          Email Address
        </Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Mail className="size-5" />
          </span>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            className="pl-11 h-12 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] focus-visible:ring-[#2e67b1]/20 bg-white"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-base font-semibold text-slate-800">
          Password
        </Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Lock className="size-5" />
          </span>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create password"
            className="pl-11 pr-11 h-12 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] focus-visible:ring-[#2e67b1]/20 bg-white"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-base font-semibold text-slate-800"
        >
          Confirm Password
        </Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Lock className="size-5" />
          </span>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            className="pl-11 pr-11 h-12 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] focus-visible:ring-[#2e67b1]/20 bg-white"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms & Conditions Checkbox */}
      <div className="space-y-2 py-1">
        <div className="flex items-start gap-2">
          <div className="pt-0.5">
            <Controller
              name="agreeTerms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="agreeTerms"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  className="border-slate-300 data-[state=checked]:bg-[#2e67b1] data-[state=checked]:border-[#2e67b1]"
                />
              )}
            />
          </div>
          <Label
            htmlFor="agreeTerms"
            className="text-sm font-medium text-slate-600 cursor-pointer select-none leading-tight"
          >
            I agree to the Terms & Conditions and Privacy Policy.
          </Label>
        </div>
        {errors.agreeTerms && (
          <p className="text-red-500 text-xs mt-1">{errors.agreeTerms.message}</p>
        )}
      </div>

      {/* Sign Up Button */}
      <Button
        type="submit"
        isLoading={signupMutation.isPending}
        rightIcon={!signupMutation.isPending && <UserPlus className="size-5" />}
        className="w-full h-12 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-semibold shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all"
      >
        Sign Up
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-divider" />
        <span className="text-xs font-semibold text-slate-muted tracking-wider">OR</span>
        <div className="flex-1 h-px bg-divider" />
      </div>

      {/* Google Sign Up Button */}
      <GoogleLoginButton label="Continue with Google" />
    </form>
  )
}
