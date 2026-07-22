import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/features/auth/pages/LoginPage'
import SignupPage from '@/features/auth/pages/SignupPage'
import VerifyOtpPage from '@/features/auth/pages/VerifyOtpPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import OnboardingPage from '@/features/onboarding/pages/OnboardingPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import StudentsPage from '@/features/students/pages/StudentsPage'
import AddStudentPage from '@/features/students/pages/AddStudentPage'
import MainLayout from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protected Dashboard Shell Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/add" element={<AddStudentPage />} />
          <Route path="/teachers" element={<Navigate to="/dashboard" replace />} />
          <Route path="/classes" element={<Navigate to="/dashboard" replace />} />
          <Route path="/attendance" element={<Navigate to="/dashboard" replace />} />
          <Route path="/homework" element={<Navigate to="/dashboard" replace />} />
          <Route path="/holidays" element={<Navigate to="/dashboard" replace />} />
          <Route path="/exams" element={<Navigate to="/dashboard" replace />} />
          <Route path="/fees" element={<Navigate to="/dashboard" replace />} />
          <Route path="/announcements" element={<Navigate to="/dashboard" replace />} />
          <Route path="/ptm" element={<Navigate to="/dashboard" replace />} />
          <Route path="/notifications" element={<Navigate to="/dashboard" replace />} />
          <Route path="/reports" element={<Navigate to="/dashboard" replace />} />
          <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
