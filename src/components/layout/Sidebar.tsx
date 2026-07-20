import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
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
  danger?: boolean
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
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

  const handleLogout = () => {
    useAuthStore.getState().logout()
    window.location.href = '/login'
  }

  return (
    <aside
      className={`h-screen bg-[#f8fafc] border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 relative select-none ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Top Section: Logo Header & Toggle Button */}
      <div className="flex flex-col">
        {/* Dark Blue Logo Header */}
        <div className="h-16 bg-[#2a2b3d] flex items-center justify-between px-5 relative">
          <div className="flex items-center overflow-hidden">
            {isCollapsed ? (
              <div className="w-11 h-10 overflow-hidden shrink-0 flex items-center">
                <img
                  src="/sidebar-open.svg"
                  alt="Solva OS Logo"
                  className="h-10 min-w-[148px] max-w-none object-left"
                />
              </div>
            ) : (
              <img
                src="/sidebar-open.svg"
                alt="Solva OS Logo"
                className="h-10 w-auto animate-in fade-in duration-300"
              />
            )}
          </div>

          {/* Toggle Collapsed Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-[#2e67b1] border border-white text-white hover:bg-[#2e67b1]/90 flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer z-50"
          >
            {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        {/* Navigation Items (Scrollable Menu list) */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center h-11 px-2.5 rounded-xl font-medium text-sm transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-[#2e67b1]/8 text-[#2e67b1]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <item.icon
                    className={`size-5 transition-transform shrink-0 group-hover:scale-105 ${
                      isActive ? 'text-[#2e67b1]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {/* Label */}
                  {!isCollapsed && (
                    <span className="ml-3 font-semibold transition-opacity duration-200 truncate">
                      {item.name}
                    </span>
                  )}
                  {/* Active Right Vertical Indicator Bar */}
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#2e67b1] w-1.5 h-6 rounded-l-md" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="p-2 border-t border-slate-200/80 space-y-1 bg-[#f8fafc]">
        {/* Settings Link */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group flex items-center h-11 px-2.5 rounded-xl font-medium text-sm transition-all relative overflow-hidden ${
              isActive
                ? 'bg-[#2e67b1]/8 text-[#2e67b1]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings
                className={`size-5 shrink-0 transition-transform group-hover:rotate-45 ${
                  isActive ? 'text-[#2e67b1]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              {!isCollapsed && (
                <span className="ml-3 font-semibold truncate">Settings</span>
              )}
              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#2e67b1] w-1.5 h-6 rounded-l-md" />
              )}
            </>
          )}
        </NavLink>

        {/* Logout Trigger Button */}
        <button
          onClick={handleLogout}
          className="group flex items-center w-full h-11 px-2.5 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer relative overflow-hidden"
        >
          <LogOut className="size-5 shrink-0 text-red-500 group-hover:translate-x-0.5 transition-transform" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
