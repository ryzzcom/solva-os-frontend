import VerifyOtpForm from '../components/VerifyOtpForm'
import AuthLayout from '../components/AuthLayout'

export default function VerifyOtpPage() {
  return (
    <AuthLayout
      title="Verify Your Account"
      subtitle="Enter the 6-digit verification code sent to your email to complete your account setup and access your school dashboard."
      headerLinkText="Back To Login"
      headerLinkHref="/login"
    >
      <VerifyOtpForm />
    </AuthLayout>
  )
}
