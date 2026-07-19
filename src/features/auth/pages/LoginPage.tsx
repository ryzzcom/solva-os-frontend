import LoginForm from '../components/LoginForm'
import AuthLayout from '../components/AuthLayout'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Principal Login"
      subtitle="Sign in to your school management dashboard."
      headerLinkText="Sign Up"
      headerLinkHref="/signup"
    >
      <LoginForm />
    </AuthLayout>
  )
}
