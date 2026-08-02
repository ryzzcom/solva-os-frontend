import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginInput } from '../schemas/loginSchema'
import { useLogin } from '../api/useLogin'
import { extractAuthErrorMessage } from '../utils/extractError'
import { GoogleLoginButton } from './GoogleLoginButton'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const loginMutation = useLogin()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = (data: LoginInput) => {
    setAuthError(null)
    loginMutation.mutate(data, {
      onError: (error: any) => {
        const errorMsg = extractAuthErrorMessage(error, 'Invalid email or password. Please try again.')
        setAuthError(errorMsg)
        setError('root', { type: 'manual', message: errorMsg })
      },
      onSuccess: () => {
        navigate('/dashboard', { replace: true })
      },
    })
  }

  const activeError = authError || errors.root?.message

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {activeError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3.5 text-sm font-semibold animate-in fade-in duration-200 flex items-center gap-2.5">
          <AlertCircle className="size-5 text-rose-600 shrink-0" />
          <span>{activeError}</span>
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
            placeholder="Enter your password"
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

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-slate-300 data-[state=checked]:bg-[#2e67b1] data-[state=checked]:border-[#2e67b1]"
              />
            )}
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-medium text-slate-600 cursor-pointer select-none"
          >
            Remember me
          </Label>
        </div>
        <a
          href="/forgot-password"
          className="text-sm font-semibold text-[#2e67b1] hover:underline"
        >
          Forgot Password?
        </a>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        isLoading={loginMutation.isPending}
        rightIcon={!loginMutation.isPending && <LogIn className="size-5" />}
        className="w-full h-12 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-semibold shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all"
      >
        Sign In
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-divider" />
        <span className="text-xs font-semibold text-slate-muted tracking-wider">OR</span>
        <div className="flex-1 h-px bg-divider" />
      </div>

      {/* Google Login Button */}
      <GoogleLoginButton label="Continue with Google" />
    </form>
  )
}
