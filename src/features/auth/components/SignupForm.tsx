import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { signupSchema, type SignupInput } from '../schemas/signupSchema'
import { useSignup } from '../api/useSignup'
import { axiosInstance } from '@/lib/axios'

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
        setAuthError(
          error.response?.data?.message ||
            error.message ||
            'Registration failed. Please try again.'
        )
      },
      onSuccess: (_, variables) => {
        navigate('/verify-otp', { state: { email: variables.email } })
      },
    })
  }

  const handleGoogleLogin = () => {
    console.log('Redirecting to Google OAuth...')
    window.location.href = `${axiosInstance.defaults.baseURL}/auth/google`
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
        disabled={signupMutation.isPending}
        className="w-full h-12 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all"
      >
        {signupMutation.isPending ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            Sign Up
            <UserPlus className="size-5" />
          </>
        )}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-semibold text-slate-400 tracking-wider">OR</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Google Sign Up Button */}
      <Button
        type="button"
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
      >
        Login With Google
        <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            fill="#EA4335"
          />
        </svg>
      </Button>
    </form>
  )
}
