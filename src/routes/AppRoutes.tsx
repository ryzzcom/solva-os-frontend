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
import StudentProfilePage from '@/features/students/pages/StudentProfilePage'
import EditStudentPage from '@/features/students/pages/EditStudentPage'
import TeachersPage from '@/features/teachers/pages/TeachersPage'
import AddTeacherPage from '@/features/teachers/pages/AddTeacherPage'
import TeacherProfilePage from '@/features/teachers/pages/TeacherProfilePage'
import EditTeacherPage from '@/features/teachers/pages/EditTeacherPage'
import AssignSchedulePage from '@/features/teachers/pages/AssignSchedulePage'
import ClassesPage from '@/features/classes/pages/ClassesPage'
import AddClassPage from '@/features/classes/pages/AddClassPage'
import EditClassPage from '@/features/classes/pages/EditClassPage'
import ClassSectionsPage from '@/features/classes/sections/pages/ClassSectionsPage'
import AddSectionPage from '@/features/classes/sections/pages/AddSectionPage'
import EditSectionPage from '@/features/classes/sections/pages/EditSectionPage'
import SectionDetailPage from '@/features/classes/sections/pages/SectionDetailPage'
import AttendanceOverviewPage from '@/features/attendance/pages/AttendanceOverviewPage'
import SectionStudentAttendancePage from '@/features/attendance/pages/SectionStudentAttendancePage'
import MarkTeacherAttendancePage from '@/features/attendance/pages/MarkTeacherAttendancePage'
import LeaveRequestsManagerPage from '@/features/attendance/pages/LeaveRequestsManagerPage'
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
          <Route path="/students/edit/:id" element={<EditStudentPage />} />
          <Route path="/students/:id" element={<StudentProfilePage />} />

          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/teachers/add" element={<AddTeacherPage />} />
          <Route path="/teachers/edit/:id" element={<EditTeacherPage />} />
          <Route path="/teachers/:id" element={<TeacherProfilePage />} />
          <Route path="/teachers/:id/assign-schedule" element={<AssignSchedulePage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/classes/add" element={<AddClassPage />} />
          <Route path="/classes/edit/:id" element={<EditClassPage />} />
          <Route path="/classes/:id/sections" element={<ClassSectionsPage />} />
          <Route path="/classes/:id/sections/add" element={<AddSectionPage />} />
          <Route path="/classes/:classId/sections/edit/:sectionId" element={<EditSectionPage />} />
          <Route path="/classes/sections/edit/:sectionId" element={<EditSectionPage />} />
          <Route path="/classes/sections/:sectionId" element={<SectionDetailPage />} />
          <Route path="/attendance" element={<AttendanceOverviewPage />} />
          <Route path="/attendance/teachers" element={<MarkTeacherAttendancePage />} />
          <Route path="/attendance/leaves" element={<LeaveRequestsManagerPage />} />
          <Route path="/attendance/sections/:sectionId" element={<SectionStudentAttendancePage />} />
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
