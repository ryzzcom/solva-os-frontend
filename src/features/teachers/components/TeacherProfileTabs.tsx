import React, { useState } from 'react'
import {
  BookOpen,
  Calendar,
  Clock,
} from 'lucide-react'
import {
  useTeacherProfileTab,
  useTeacherScheduleTab,
  useTeacherAttendanceTab,
  useTeacherLeaveHistoryTab,
} from '../api/useTeacherProfile'
import type {
  ScheduleCardItem,
  TeacherScheduleItem,
  TeacherLeaveItem,
} from '../api/useTeacherProfile'

interface TeacherProfileTabsProps {
  teacherId?: string
}

export const TeacherProfileTabs: React.FC<TeacherProfileTabsProps> = ({ teacherId }) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'schedule' | 'attendance' | 'leave-history'
  >('profile')

  // API Queries for tabs
  const { data: profileTabData, isLoading: isProfileLoading } = useTeacherProfileTab(teacherId)
  const { data: scheduleTabData, isLoading: isScheduleLoading } = useTeacherScheduleTab(teacherId)
  const { data: attendanceTabData, isLoading: isAttendanceLoading } = useTeacherAttendanceTab(teacherId)
  const { data: leaveTabData, isLoading: isLeaveLoading } = useTeacherLeaveHistoryTab(teacherId)

  return (
    <div className="space-y-6">
      {/* Tab Header Navigation */}
      <div className="border-b border-card-border flex gap-6 md:gap-8 overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-base font-semibold font-urbanist transition-colors relative cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 text-base font-semibold font-urbanist transition-colors relative cursor-pointer whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Classes & Schedule
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 text-base font-semibold font-urbanist transition-colors relative cursor-pointer whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Attendance
        </button>

        <button
          onClick={() => setActiveTab('leave-history')}
          className={`pb-3 text-base font-semibold font-urbanist transition-colors relative cursor-pointer whitespace-nowrap ${
            activeTab === 'leave-history'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Leave History
        </button>
      </div>

      {/* Tab Panels */}

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Bento Grid Assigned Classes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0f172a] font-urbanist">
              Assigned Classes & Subjects
            </h3>

            {isProfileLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : profileTabData?.schedule_cards && profileTabData.schedule_cards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileTabData.schedule_cards.map((card: ScheduleCardItem, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-brand-primary border border-blue-100 rounded-md text-xs font-semibold font-sans">
                          {card.subject_name || 'Core Subject'}
                        </span>
                        <BookOpen className="size-4 text-brand-primary" />
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-slate-900 font-urbanist">
                          {card.class_name} {card.section_name}
                        </h4>
                        <p className="text-sm text-slate-600 font-sans mt-0.5">
                          {card.subject_name}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 text-xs text-slate-600 font-sans">
                        <div className="flex items-center gap-2">
                          <Clock className="size-3.5 text-slate-400" />
                          <span>{card.start_time} – {card.end_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-3.5 text-slate-400" />
                          <span>{card.active_days.join(', ') || 'Mon, Wed, Fri'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#2e67b1] font-urbanist">
                        Active Assignment
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500 font-sans">
                No active class assignments found.
              </div>
            )}
          </div>

          {/* Personal Information Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 font-urbanist border-b border-slate-100 pb-3">
              Personal Information
            </h3>

            {isProfileLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-slate-500 font-sans">Full Name</p>
                  <p className="text-base font-semibold text-slate-800 font-urbanist mt-1">
                    {profileTabData?.personal_information?.full_name || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-sans">Date of Birth</p>
                  <p className="text-base font-semibold text-slate-800 font-urbanist mt-1">
                    {profileTabData?.personal_information?.dob || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-sans">Gender</p>
                  <p className="text-base font-semibold text-slate-800 font-urbanist mt-1 capitalize">
                    {profileTabData?.personal_information?.gender || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-sans">Phone Number</p>
                  <p className="text-base font-semibold text-slate-800 font-urbanist mt-1">
                    {profileTabData?.personal_information?.phone_number || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-sans">Email Address</p>
                  <p className="text-base font-semibold text-slate-800 font-urbanist mt-1">
                    {profileTabData?.personal_information?.email || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-sans">CNIC / ID Number</p>
                  <p className="text-base font-semibold text-slate-800 font-urbanist mt-1 font-mono">
                    {profileTabData?.personal_information?.cnic_number || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-sans">Joining Date</p>
                  <p className="text-base font-semibold text-slate-800 font-urbanist mt-1">
                    {profileTabData?.personal_information?.joining_date || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-sans">Monthly Salary</p>
                  <p className="text-base font-semibold text-slate-800 font-urbanist mt-1">
                    {profileTabData?.personal_information?.monthly_salary
                      ? `PKR ${profileTabData.personal_information.monthly_salary.toLocaleString()}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CLASSES & SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
          <h3 className="text-lg font-semibold text-[#0f172a] font-urbanist border-b border-slate-100 pb-3">
            Weekly Timetable Schedule
          </h3>

          {isScheduleLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : Array.isArray(scheduleTabData) && scheduleTabData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Day</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Time Slot</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Class & Section</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Subject</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {scheduleTabData.map((item: TeacherScheduleItem, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-semibold text-slate-800 font-urbanist">
                        {item.day}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 font-sans flex items-center gap-1.5">
                        <Clock className="size-3.5 text-[#2e67b1]" />
                        {item.time}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#2e67b1] font-urbanist">
                        {item.class_section}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-700 font-sans font-medium">
                        {item.subject}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-sans">
              No timetable schedule available for this teacher.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#d8dee8] rounded-xl p-4 space-y-1 shadow-sm">
              <span className="text-xs text-slate-500 font-sans">Attendance Rate</span>
              <p className="text-2xl font-bold text-emerald-600 font-urbanist">
                {attendanceTabData?.kpi_stats?.attendance_rate ?? 100}%
              </p>
            </div>
            <div className="bg-white border border-[#d8dee8] rounded-xl p-4 space-y-1 shadow-sm">
              <span className="text-xs text-slate-500 font-sans">Total School Days</span>
              <p className="text-2xl font-bold text-slate-800 font-urbanist">
                {attendanceTabData?.kpi_stats?.total_school_days ?? 0}
              </p>
            </div>
            <div className="bg-white border border-[#d8dee8] rounded-xl p-4 space-y-1 shadow-sm">
              <span className="text-xs text-slate-500 font-sans">Days Present</span>
              <p className="text-2xl font-bold text-[#2e67b1] font-urbanist">
                {attendanceTabData?.kpi_stats?.days_present ?? 0}
              </p>
            </div>
            <div className="bg-white border border-[#d8dee8] rounded-xl p-4 space-y-1 shadow-sm">
              <span className="text-xs text-slate-500 font-sans">Total Absences</span>
              <p className="text-2xl font-bold text-rose-600 font-urbanist">
                {attendanceTabData?.kpi_stats?.total_absences ?? 0}
              </p>
            </div>
          </div>

          {/* Attendance Log Table */}
          <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-[#0f172a] font-urbanist border-b border-slate-100 pb-3">
              Recent Daily Attendance Logs
            </h3>

            {isAttendanceLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-lg" />
                ))}
              </div>
            ) : attendanceTabData?.daily_logs && attendanceTabData.daily_logs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Date</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Check-in Time</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {attendanceTabData.daily_logs.map((log: { date: string; mark_at: string; status: string }, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800 font-urbanist">
                          {log.date}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 font-sans">
                          {log.mark_at}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-urbanist ${
                              log.status === 'PRESENT'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : log.status === 'ABSENT'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-sans">
                No recent attendance records found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LEAVE HISTORY */}
      {activeTab === 'leave-history' && (
        <div className="bg-white border border-[#d8dee8] rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
          <h3 className="text-lg font-semibold text-[#0f172a] font-urbanist border-b border-slate-100 pb-3">
            Leave Applications History
          </h3>

          {isLeaveLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : Array.isArray(leaveTabData) && leaveTabData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Leave Type</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Duration</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Reason</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700 font-urbanist">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {leaveTabData.map((leave: TeacherLeaveItem, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-semibold text-slate-800 font-urbanist capitalize">
                        {leave.leave_type}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 font-sans">
                        {leave.duration}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-700 font-sans">
                        {leave.reason || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-urbanist ${
                            leave.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : leave.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-sans">
              No leave history records found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
