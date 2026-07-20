import { format } from 'date-fns'
import {
  Users,
  BookOpen,
  GraduationCap,
  Wallet,
  Calendar,
  AlertTriangle,
  Heart,
  TrendingUp,
} from 'lucide-react'
import { useDashboardMetrics } from '../api/useDashboardMetrics'
import { Skeleton } from '@/components/ui/skeleton'
import { MetricCard } from '../components/MetricCard'

export default function DashboardPage() {
  const { data: metrics, isLoading, error } = useDashboardMetrics()

  // Format today's date matching Figma style "Saturday, March 28"
  const formattedDate = format(new Date(), 'EEEE, MMMM d')

  if (isLoading) {
    return (
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 md:w-80 rounded-xl bg-slate-200" />
          <Skeleton className="h-4 w-48 md:w-64 rounded-lg bg-slate-200" />
        </div>

        {/* Row 1 Metrics Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-20 rounded-lg bg-slate-200" />
                <Skeleton className="h-4 w-28 rounded-md bg-slate-200" />
              </div>
              <Skeleton className="size-12 md:size-14 rounded-2xl bg-slate-200 shrink-0" />
            </div>
          ))}
        </div>

        {/* Row 2 Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 flex items-center justify-between shadow-sm">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-7 w-24 rounded-lg bg-slate-200" />
                <Skeleton className="h-4 w-32 rounded-md bg-slate-200" />
              </div>
              <Skeleton className="size-12 md:size-14 rounded-2xl bg-slate-200 shrink-0" />
            </div>
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 space-y-4 shadow-sm">
            <Skeleton className="h-6 w-48 rounded-lg bg-slate-200" />
            <Skeleton className="h-[200px] w-full rounded-2xl bg-slate-150" />
          </div>
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 space-y-4 shadow-sm">
            <Skeleton className="h-6 w-48 rounded-lg bg-slate-200" />
            <Skeleton className="h-[200px] w-full rounded-2xl bg-slate-150" />
          </div>
        </div>

        {/* Timeline Logs Skeleton */}
        <div className="bg-white border border-slate-100 rounded-[28px] p-6 md:p-8 space-y-6 shadow-sm">
          <Skeleton className="h-6 w-40 rounded-lg bg-slate-200" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-4 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-md bg-slate-200" />
                  <Skeleton className="h-3 w-20 rounded-md bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
        <p className="font-semibold">Error loading metrics</p>
        <p className="text-sm mt-1">{error?.message || 'Could not connect to database.'}</p>
      </div>
    )
  }

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hours = new Date().getHours()
    if (hours < 12) return 'Good Morning'
    if (hours < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Formatting helpers
  const formatCurrency = (val: number) => {
    if (val >= 1000) return `$ ${(val / 1000).toFixed(1)}k`
    return `$ ${val}`
  }

  // Y-axis scaling for line chart
  const attendanceTrend = metrics.attendance_stats.trend || []
  const maxAttendance = 100
  const minAttendance = 60
  const chartHeight = 180
  const chartWidth = 540

  const getLinePoints = () => {
    if (attendanceTrend.length === 0) return ''
    return attendanceTrend
      .map((item, idx) => {
        const x = (idx / (attendanceTrend.length - 1)) * chartWidth
        const val = Math.min(Math.max(item.percentage, minAttendance), maxAttendance)
        const y = chartHeight - ((val - minAttendance) / (maxAttendance - minAttendance)) * chartHeight
        return `${x},${y}`
      })
      .join(' ')
  }

  const getAreaPoints = () => {
    const points = getLinePoints()
    if (!points) return ''
    return `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`
  }

  // Dynamic Y-axis scaling for bar chart
  const feeStatus = metrics.financial_stats.fee_collection_status || []
  const maxFeeCalculated = Math.max(
    600000,
    ...feeStatus.map((item) => Math.max(item.collected || 0, item.pending || 0))
  )
  const maxFeeValue = maxFeeCalculated > 0 ? maxFeeCalculated * 1.1 : 600000
  const barChartHeight = 180
  const barChartWidth = 540

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header welcome */}
      <div className="flex flex-col gap-1.5 text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-urbanist">
          {getGreeting()}, Principal
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-semibold tracking-wide">
          Here's what's happening in your school today, <span className="text-[#2e67b1]">{formattedDate}.</span>
        </p>
      </div>

      {/* 2. Metric Cards Grid Row 1 (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          value={metrics.student_stats.total_count}
          label="Total Students"
          gradientClass="from-[#2e67b1] to-[#4f8edc] border border-[#2e67b1] shadow-blue-600/15"
          iconColorClass="text-[#2e67b1]"
          icon={Users}
        />
        <MetricCard
          value={metrics.teacher_stats.total_count}
          label="Total Teachers"
          gradientClass="from-[#f36f26] to-[#ff9a5a] border border-[#f36f26] shadow-orange-500/15"
          iconColorClass="text-[#f36f26]"
          icon={BookOpen}
        />
        <MetricCard
          value={`${metrics.attendance_stats.today_rate.toFixed(1)}%`}
          label="Today's Attendance"
          gradientClass="from-[#16a34a] to-[#4ade80] border border-[#16a34a] shadow-green-600/15"
          iconColorClass="text-[#16a34a]"
          icon={GraduationCap}
        />
        <MetricCard
          value={formatCurrency(metrics.financial_stats.pending_fees)}
          label="Pending Fees"
          gradientClass="from-[#7c3aed] to-[#a78bfa] border border-[#7c3aed] shadow-purple-600/15"
          iconColorClass="text-[#7c3aed]"
          icon={Wallet}
        />
      </div>

      {/* 3. Metric Cards Grid Row 2 (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <MetricCard
          value="Grade 1 & 2"
          label="Upcoming PTM"
          gradientClass="from-[#f59e0b] to-[#fcd34d] border border-[#f59e0b] shadow-amber-500/15"
          iconColorClass="text-[#f59e0b]"
          icon={Calendar}
          truncateValue
        />
        <MetricCard
          value={metrics.student_stats.low_attendance_count}
          label="Low Attendance Students"
          gradientClass="from-[#dc2626] to-[#f87171] border border-[#dc2626] shadow-red-600/15"
          iconColorClass="text-[#dc2626]"
          icon={AlertTriangle}
        />
        <MetricCard
          value={
            metrics.parent_engagement?.grade?.includes('%')
              ? metrics.parent_engagement.grade
              : `${metrics.parent_engagement?.grade || '75%'}`
          }
          label="Parent Engagement"
          gradientClass="from-[#0ea5e9] to-[#38bdf8] border border-[#0ea5e9] shadow-sky-500/15"
          iconColorClass="text-[#0ea5e9]"
          icon={Heart}
        />
      </div>

      {/* 4. Chart Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Chart Card 1: Monthly Attendance Overview (Line Chart) */}
        <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-xl shadow-slate-150/10 relative overflow-hidden flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800 font-urbanist flex items-center gap-2">
              <TrendingUp className="size-5 text-[#2e67b1]" />
              Monthly Attendance Overview
            </h3>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Jan - Jun Analytics</p>
          </div>

          {/* SVG Custom Line Chart */}
          <div className="w-full overflow-x-auto no-scrollbar py-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              width="100%"
              height="200"
              className="min-w-[500px]"
            >
              {/* Grids and Axis lines */}
              <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Area Gradient Fill */}
              <defs>
                <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2e67b1" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#2e67b1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {attendanceTrend.length > 0 && (
                <>
                  {/* Fill Area */}
                  <polygon points={getAreaPoints()} fill="url(#attendanceGrad)" />

                  {/* Trend Path */}
                  <polyline
                    fill="none"
                    stroke="#2e67b1"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={getLinePoints()}
                  />

                  {/* Circular Points / Dots */}
                  {attendanceTrend.map((item, idx) => {
                    const x = (idx / (attendanceTrend.length - 1)) * chartWidth
                    const val = Math.min(Math.max(item.percentage, minAttendance), maxAttendance)
                    const y = chartHeight - ((val - minAttendance) / (maxAttendance - minAttendance)) * chartHeight
                    return (
                      <g key={idx} className="group/dot cursor-pointer">
                        <circle
                          cx={x}
                          cy={y}
                          r="5.5"
                          className="fill-white stroke-[#2e67b1] stroke-[3px] shadow-sm hover:r-7 transition-all"
                        />
                        <text
                          x={x}
                          y={y - 12}
                          textAnchor="middle"
                          className="opacity-0 group-hover/dot:opacity-100 fill-slate-800 text-[10px] font-bold font-urbanist transition-opacity pointer-events-none"
                        >
                          {item.percentage}%
                        </text>
                      </g>
                    )
                  })}
                </>
              )}
            </svg>
          </div>

          {/* Month labels */}
          <div className="flex justify-between px-2.5 text-xs font-semibold text-slate-400 tracking-wider mt-2.5">
            {attendanceTrend.map((item, idx) => (
              <span key={idx} className="w-12 text-center">{item.month}</span>
            ))}
          </div>
        </div>

        {/* Chart Card 2: Fee Collection Status (Grouped Bar Chart) */}
        <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-xl shadow-slate-150/10 relative overflow-hidden flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800 font-urbanist flex items-center gap-2">
              <TrendingUp className="size-5 text-indigo-650" />
              Fee Collection Status
            </h3>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Monthly Collections vs Pending</p>
          </div>

          {/* SVG Custom Bar Chart */}
          <div className="w-full overflow-x-auto no-scrollbar py-2">
            <svg
              viewBox={`0 0 ${barChartWidth} ${barChartHeight}`}
              width="100%"
              height="200"
              className="min-w-[500px]"
            >
              {/* Grids and Axis lines */}
              <line x1="0" y1="0" x2={barChartWidth} y2="0" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={barChartHeight * 0.25} x2={barChartWidth} y2={barChartHeight * 0.25} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={barChartHeight * 0.5} x2={barChartWidth} y2={barChartHeight * 0.5} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={barChartHeight * 0.75} x2={barChartWidth} y2={barChartHeight * 0.75} stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={barChartHeight} x2={barChartWidth} y2={barChartHeight} stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Draw Grouped Bars */}
              {feeStatus.map((item, idx) => {
                const groupWidth = barChartWidth / feeStatus.length
                const colX = idx * groupWidth + groupWidth / 2 - 24

                // Heights calculations
                const colH1 = (item.collected / maxFeeValue) * barChartHeight
                const colH2 = (item.pending / maxFeeValue) * barChartHeight

                return (
                  <g key={idx} className="group/bar cursor-pointer">
                    {/* Collected Bar (Blue) */}
                    <rect
                      x={colX}
                      y={barChartHeight - colH1}
                      width="16"
                      height={colH1}
                      rx="4"
                      className="fill-[#2e67b1] hover:fill-[#2e67b1]/90 transition-colors"
                    />

                    {/* Pending Bar (Light Slate/Lavender) */}
                    <rect
                      x={colX + 22}
                      y={barChartHeight - colH2}
                      width="16"
                      height={colH2}
                      rx="4"
                      className="fill-slate-200 hover:fill-slate-300 transition-colors"
                    />

                    {/* Tooltip labels */}
                    <text
                      x={colX + 11}
                      y={barChartHeight - Math.max(colH1, colH2) - 10}
                      textAnchor="middle"
                      className="opacity-0 group-hover/bar:opacity-100 fill-slate-800 text-[10px] font-bold font-urbanist transition-opacity pointer-events-none"
                    >
                      ${(item.collected / 1000).toFixed(0)}k / ${(item.pending / 1000).toFixed(0)}k
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Month labels and Chart Legends */}
          <div className="flex justify-between px-6 text-xs font-semibold text-slate-400 tracking-wider mt-2.5">
            {feeStatus.map((item, idx) => (
              <span key={idx} className="w-12 text-center">{item.month}</span>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-4.5 border-t border-slate-50 pt-3">
            <div className="flex items-center gap-2">
              <span className="size-3.5 rounded-full bg-[#2e67b1]" />
              <span className="text-xs font-bold text-slate-655 font-urbanist">Collected Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3.5 rounded-full bg-slate-200" />
              <span className="text-xs font-bold text-slate-655 font-urbanist">Pending Fees</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Chronological Recent Activity Timeline */}
      <div className="bg-white border border-slate-100 rounded-[28px] p-6 md:p-8 shadow-xl shadow-slate-150/10">
        <h3 className="text-lg font-bold text-slate-800 font-urbanist mb-6">
          Recent Activity Logs
        </h3>

        {metrics.recent_activities.length === 0 ? (
          <p className="text-slate-400 text-sm font-semibold">No recent activity logs available.</p>
        ) : (
          <div className="relative border-l-2 border-slate-100 pl-6 ml-3.5 space-y-8 py-2">
            {metrics.recent_activities.map((act, idx) => (
              <div key={idx} className="relative animate-in slide-in-from-left-5 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                {/* Visual timeline circle node */}
                <span className="absolute -left-[33px] top-1.5 size-4 rounded-full bg-[#2e67b1] border-[3px] border-white shadow-md ring-2 ring-blue-100" />
                
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 font-urbanist leading-tight">
                    {act.message}
                  </p>
                  <p className="text-xs text-slate-450 font-semibold uppercase tracking-wider">
                    {act.relativeTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
