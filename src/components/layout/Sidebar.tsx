import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLogout } from '@/features/auth/api/useLogout'
import { LogoutModal } from '@/features/auth/components/LogoutModal'
import {
  LayoutGrid,
  Users,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Pencil,
  CalendarDays,
  Layers,
  Wallet,
  Megaphone,
  Calendar,
  Bell,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

interface MenuItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const logoutMutation = useLogout()

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Teachers', path: '/teachers', icon: BookOpen },
    { name: 'Classes', path: '/classes', icon: GraduationCap },
    { name: 'Attendance', path: '/attendance', icon: ClipboardList },
    { name: 'Homework', path: '/homework', icon: Pencil },
    { name: 'Holidays', path: '/holidays', icon: CalendarDays },
    { name: 'Exams', path: '/exams', icon: Layers },
    { name: 'Fees', path: '/fees', icon: Wallet },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
    { name: 'PTM', path: '/ptm', icon: Calendar },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Report', path: '/reports', icon: TrendingUp },
  ]

  return (
    <aside
      className={`h-screen bg-white border-r border-card-border flex flex-col justify-between transition-all duration-300 relative select-none z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* 1. Top Section: Dark Header & Logo */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Dark Header Container */}
        <div className="h-[76px] bg-[#2f2e47] flex items-center justify-between px-3.5 relative shrink-0">
          <div className="flex items-center justify-center overflow-hidden w-full">
            {isCollapsed ? (
              /* Collapsed: Show larger Solva icon, swap to sidebar open/expand icon on hover */
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="size-12 rounded-xl flex items-center justify-center relative group cursor-pointer hover:bg-white/10 transition-colors mx-auto"
                title="Click to Expand Sidebar"
              >
                <img
                  src="/favicon.svg"
                  alt="Solva OS Icon"
                  className="h-11 w-auto group-hover:opacity-0 transition-opacity drop-shadow-xs"
                />
                <ChevronRight className="size-7 text-white absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ) : (
              /* Expanded: Full logo with icon and name text */
              <img
                src="/sidebar-open.svg"
                alt="Solva OS Logo"
                className="h-10 w-auto animate-in fade-in duration-300"
              />
            )}
          </div>
        </div>

      {/* Floating Circular Collapse Button - Positioned outside overflow-hidden with z-[100] */}
      {!isCollapsed && (
        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          className="absolute -right-3.5 top-[38px] -translate-y-1/2 size-7 rounded-full bg-brand-primary border-2 border-white text-white hover:bg-brand-hover flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer z-[100]"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}

        {/* 2. Navigation Scrollable Menu Items */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center h-10 transition-all relative overflow-hidden ${
                  isCollapsed
                    ? 'justify-center w-full'
                    : `px-3 rounded-lg ${
                        isActive
                          ? 'bg-brand-primary/10 text-brand-primary font-bold font-urbanist'
                          : 'text-[#334155] hover:text-navy-main hover:bg-slate-100 font-medium font-urbanist'
                      }`
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isCollapsed ? (
                    /* Collapsed state: Every menu item renders in an elegant blue circular button */
                    <div className="size-[36px] rounded-full bg-brand-primary text-white flex items-center justify-center shadow-2xs mx-auto transition-transform group-hover:scale-105">
                      <item.icon className="size-[18px] shrink-0" />
                    </div>
                  ) : (
                    /* Expanded state: Text & icon with right vertical blue indicator bar */
                    <>
                      <item.icon
                        className={`size-[18px] transition-transform shrink-0 ${
                          isActive ? 'text-brand-primary' : 'text-slate-500 group-hover:text-slate-700'
                        }`}
                      />
                      <span className="ml-3 text-sm truncate tracking-tight">
                        {item.name}
                      </span>
                      {isActive && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-brand-primary w-1.5 h-6 rounded-l-md" />
                      )}
                    </>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 3. Bottom Section: Settings & Logout Footer */}
      <div className="p-2 border-t border-card-border space-y-1 bg-white shrink-0">
        {/* Settings Link */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group flex items-center h-10 transition-all relative overflow-hidden ${
              isCollapsed
                ? 'justify-center w-full'
                : `px-3 rounded-lg ${
                    isActive
                      ? 'bg-brand-primary/10 text-brand-primary font-bold font-urbanist'
                      : 'text-[#334155] hover:text-navy-main hover:bg-slate-100 font-medium font-urbanist'
                  }`
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isCollapsed ? (
                /* Collapsed Settings: Proportioned centered icon without blue circle */
                <div className="size-[36px] flex items-center justify-center mx-auto text-[#334155] hover:text-slate-900 transition-colors">
                  <Settings className="size-[18px] shrink-0 transition-transform group-hover:rotate-45" />
                </div>
              ) : (
                <>
                  <Settings
                    className={`size-[18px] shrink-0 transition-transform group-hover:rotate-45 ${
                      isActive ? 'text-brand-primary' : 'text-slate-500 group-hover:text-slate-700'
                    }`}
                  />
                  <span className="ml-3 text-sm truncate">Settings</span>
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-brand-primary w-1.5 h-6 rounded-l-md" />
                  )}
                </>
              )}
            </>
          )}
        </NavLink>

        {/* Logout Button */}
        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className={`group flex items-center w-full h-10 transition-all cursor-pointer ${
            isCollapsed
              ? 'justify-center'
              : 'px-3 rounded-lg text-rose-600 hover:bg-rose-50 font-bold font-urbanist'
          }`}
        >
          {isCollapsed ? (
            /* Collapsed Logout: Proportioned centered red icon without blue circle */
            <div className="size-[36px] flex items-center justify-center mx-auto text-rose-600 hover:text-rose-700 transition-colors">
              <LogOut className="size-[18px] shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
          ) : (
            <>
              <LogOut className="size-[18px] shrink-0 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
              <span className="ml-3 text-sm truncate">Logout</span>
            </>
          )}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
        isPending={logoutMutation.isPending}
        error={logoutMutation.error}
      />
    </aside>
  )
}

export default Sidebar
