import ForgotPasswordForm from '../components/ForgotPasswordForm'
import AuthLayout from '../components/AuthLayout'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Your Password?"
      subtitle="Enter your registered email address and we will send you a password reset code."
      headerLinkText="Back To Login"
      headerLinkHref="/login"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
