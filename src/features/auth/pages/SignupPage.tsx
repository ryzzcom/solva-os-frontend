import SignupForm from '../components/SignupForm'
import AuthLayout from '../components/AuthLayout'

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create School Account"
      subtitle="Set up your school dashboard in just a few steps."
      headerLinkText="Sign In"
      headerLinkHref="/login"
    >
      <SignupForm />
    </AuthLayout>
  )
}
