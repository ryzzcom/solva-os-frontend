import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  headerLinkText?: string
  headerLinkHref?: string
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  headerLinkText,
  headerLinkHref,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#f8fafc] flex flex-col lg:flex-row font-sans selection:bg-[#2e67b1]/10 selection:text-[#2e67b1]">

      {/* Left Column: Image Illustration (Visible on Large Screens) */}
      <div className="hidden lg:flex lg:w-[50%] h-full p-8 items-center justify-end lg:pr-16 relative overflow-hidden">
        {/* Soft blue glowing shade from top left */}
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full bg-[#2e67b1] opacity-25 blur-[120px] pointer-events-none" />

        <img
          src="/login-left.png"
          alt="Solva OS Logo Illustration"
          className="w-full max-w-[450px] h-auto object-contain rounded-[32px] shadow-2xl relative z-10"
        />
      </div>

      {/* Right Column: Form Interface */}
      <div className="flex-1 h-full flex flex-col justify-between p-6 md:p-10 lg:pl-16 relative lg:overflow-y-auto">

        {/* Star Ornament Icon at Top Right */}
        <div className="absolute right-8 top-8 hidden md:block">
          <img src="/stars.svg" alt="Stars" className="size-8" />
        </div>

        {/* Top Header */}
        <div className="flex items-center justify-between w-full max-w-[566px] mx-auto lg:mx-0">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Solva OS
          </h2>
          {headerLinkText && headerLinkHref && (
            <a
              href={headerLinkHref}
              className="h-10 px-5 border border-[#2e67b1] text-[#2e67b1] hover:bg-[#2e67b1]/5 rounded-xl font-semibold flex items-center justify-center text-sm transition-all"
            >
              {headerLinkText}
            </a>
          )}
        </div>

        {/* Center Card Container */}
        <div className="flex-1 flex items-center justify-center lg:justify-start py-6">
          <div className="w-full max-w-[566px] bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-100/50">
            <div className="space-y-2 mb-8">
              <h1 className="text-2xl font-semibold text-slate-900 font-urbanist">
                {title}
              </h1>
              <p className="text-sm text-slate-500">
                {subtitle}
              </p>
            </div>

            {children}
          </div>
        </div>

        {/* Footer info (Centered / Left-aligned on Desktop) */}
        <div className="text-center lg:text-left text-xs text-slate-400 w-full max-w-[566px] mx-auto lg:mx-0">
          &copy; {new Date().getFullYear()} Solva OS. All rights reserved.
        </div>
      </div>

    </div>
  )
}
