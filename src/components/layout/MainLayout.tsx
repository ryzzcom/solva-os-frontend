import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Menu, X, Search, Bell, Moon, LogOut, School, User as UserIcon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Sidebar from './Sidebar'

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Redirect if not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const schoolName = user.school?.name || 'Karachi Public School'
  const schoolLogo = user.school?.logo_url || null
  const userName = (user as any)?.fullName || (user as any)?.name || (user as any)?.full_name || 'Sara Khan'
  const userAvatar = user.profile_picture_url || null
  const userRole = user.role || 'Administrator'

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans select-none antialiased">
      {/* 1. Mobile Sidebar Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* 2. Sidebar Navigation Panel */}
      {/* Desktop Sidebar (visible on md and up) */}
      <div className="hidden md:block shrink-0 transition-all duration-300">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Mobile Sidebar (sliding drawer on mobile, absolute positioned) */}
      <div
        className={`fixed top-0 bottom-0 left-0 bg-[#f8fafc] z-50 transition-transform duration-350 ease-out md:hidden shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Sidebar Content Wrapper */}
        <div className="w-64 h-full relative">
          <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-655 active:scale-95 transition-all cursor-pointer"
          >
            <X className="size-4.5" />
          </button>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200/80 bg-white flex items-center justify-between px-4 md:px-6 z-15 shrink-0 shadow-sm shadow-slate-100/30">
          
          {/* Mobile Hamburger Menu Toggle & School Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden size-10 rounded-full border border-slate-200 text-slate-550 flex items-center justify-center active:bg-slate-50 cursor-pointer"
            >
              <Menu className="size-5" />
            </button>

            {/* School Profile Card */}
            <div className="flex items-center gap-2.5">
              <div className="size-9 bg-white border border-slate-150 rounded-xl flex items-center justify-center shadow-sm overflow-hidden p-1.5 shrink-0">
                {schoolLogo ? (
                  <img src={schoolLogo} alt="School Logo" className="size-full object-contain" />
                ) : (
                  <div className="size-full bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm font-urbanist">
                    <School className="size-4.5" />
                  </div>
                )}
              </div>
              <span className="text-slate-800 font-bold text-sm md:text-base font-urbanist truncate max-w-[140px] sm:max-w-[200px] md:max-w-[320px]">
                {schoolName}
              </span>
            </div>
          </div>

          {/* Search Bar Capsule (Desktop only) */}
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9.5 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-full text-slate-650 text-xs focus:outline-none focus:border-[#2e67b1] focus:bg-white transition-all font-medium placeholder-slate-400"
              />
            </div>
          </div>

          {/* Actions & User Menu */}
          <div className="flex items-center gap-2.5 md:gap-4">
            {/* Notification Bell Icon */}
            <button className="size-9.5 rounded-full border border-slate-200 text-slate-500 hover:text-[#2e67b1] hover:border-[#2e67b1] flex items-center justify-center transition-all cursor-pointer hover:bg-slate-50/50">
              <Bell className="size-4.5" />
            </button>

            {/* Dark Mode toggle */}
            <button className="size-9.5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-md shadow-blue-900/10 hover:bg-[#1e3a8a]/90 transition-all cursor-pointer hover:scale-105 active:scale-95">
              <Moon className="size-4 fill-white" />
            </button>

            {/* Vertical Divider */}
            <span className="h-5 w-px bg-slate-250 hidden xs:block" />

            {/* User Dropdown Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                <div className="flex items-center gap-2">
                  {/* Shadcn Avatar */}
                  <Avatar className="size-9 border border-slate-200 shadow-sm rounded-xl">
                    {userAvatar && <AvatarImage src={userAvatar} alt={userName} className="rounded-xl" />}
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-bold text-xs font-urbanist rounded-xl">
                      {userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden xs:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-none font-urbanist">{userName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wide leading-none">{userRole}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1.5 p-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-slate-400 tracking-wide uppercase leading-none">
                  My Account
                </DropdownMenuLabel>
                <div className="px-3 py-1.5 flex flex-col">
                  <span className="text-sm font-bold text-slate-800 truncate">{userName}</span>
                  <span className="text-xs text-slate-400 truncate mt-0.5">{user.email}</span>
                </div>
                <DropdownMenuSeparator className="my-1 border-t border-slate-100" />
                <DropdownMenuItem className="px-3 py-2 rounded-lg text-sm text-slate-655 hover:bg-slate-50 flex items-center gap-2 cursor-pointer focus:outline-none font-medium">
                  <UserIcon className="size-4 text-slate-400" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 border-t border-slate-100" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm text-red-655 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 cursor-pointer focus:outline-none font-medium"
                >
                  <LogOut className="size-4 text-red-500" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Page Body canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/40">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
