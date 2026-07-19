import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotPasswordSchema, type ForgotPasswordInput } from '../schemas/forgotPasswordSchema'
import { useForgotPassword } from '../api/useForgotPassword'

export default function ForgotPasswordForm() {
  const [authError, setAuthError] = useState<string | null>(null)
  const forgotPasswordMutation = useForgotPassword()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: ForgotPasswordInput) => {
    setAuthError(null)
    forgotPasswordMutation.mutate(data, {
      onError: (error: any) => {
        setAuthError(
          error.response?.data?.message ||
            error.message ||
            'Failed to initiate password reset request. Please try again.'
        )
      },
      onSuccess: () => {
        navigate('/verify-otp', { state: { email: data.email, type: 'forgot-password' } })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
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
            placeholder="Enter your registered email"
            className="pl-11 h-12 rounded-xl border border-slate-200 focus-visible:border-[#2e67b1] focus-visible:ring-[#2e67b1]/20 bg-white"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Send Reset Code Button */}
      <Button
        type="submit"
        disabled={forgotPasswordMutation.isPending}
        className="w-full h-12 bg-[#2e67b1] hover:bg-[#2e67b1]/90 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all"
      >
        {forgotPasswordMutation.isPending ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Sending Code...
          </>
        ) : (
          <>
            Send Reset Code
            <ArrowRight className="size-5" />
          </>
        )}
      </Button>
    </form>
  )
}
