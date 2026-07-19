import ResetPasswordForm from '../components/ResetPasswordForm'
import AuthLayout from '../components/AuthLayout'

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Your new password must be different from previously used passwords."
      headerLinkText="Back To Login"
      headerLinkHref="/login"
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
