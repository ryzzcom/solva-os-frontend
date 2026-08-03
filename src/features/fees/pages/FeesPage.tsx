import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  Sparkles,
  CreditCard,
  PieChart,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  BellRing,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function FeesPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubscribed(true)
      setEmail('')
    }
  }

  const features = [
    {
      icon: CreditCard,
      title: 'Automated Fee Invoicing',
      description: 'Generate monthly, term-based, and custom fee vouchers effortlessly for all classes.',
      badge: 'Core Feature',
    },
    {
      icon: Wallet,
      title: 'Online Parent Gateway',
      description: 'Accept instant digital payments with automated PDF receipts and transaction logging.',
      badge: 'Instant Sync',
    },
    {
      icon: ShieldCheck,
      title: 'Concessions & Waivers',
      description: 'Manage student scholarships, sibling discounts, and special financial assistance rules.',
      badge: 'Flexible Rules',
    },
    {
      icon: PieChart,
      title: 'Real-time Financial Audit',
      description: 'Comprehensive dashboard for tracking collection rates, dues, and revenue forecasts.',
      badge: 'Analytics',
    },
  ]

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Dashboard</span>
        </button>
        <ChevronRight className="size-3.5 text-slate-400" />
        <span className="text-slate-900">Fees & Finance</span>
      </div>

      {/* Hero Coming Soon Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700/50">
        {/* Background Decorative Glow Effect */}
        <div className="absolute -top-24 -right-24 size-96 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="size-3.5 text-blue-400 animate-pulse" />
            <span>Module Under Active Development</span>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-extrabold font-urbanist tracking-tight leading-tight">
              Fees & Financial Management <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg font-sans leading-relaxed max-w-2xl">
              We are building an all-in-one financial engine for your school. Soon you’ll be able to manage fee structures, accept digital payments, and track dues seamlessly.
            </p>
          </div>

          {/* Notification Signup Form */}
          <div className="pt-4 max-w-md">
            {isSubscribed ? (
              <div className="flex items-center gap-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl text-sm font-semibold animate-in fade-in">
                <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
                <span>Thank you! We’ll notify you as soon as Fees module goes live.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email for early access..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-sm focus-visible:ring-brand-primary focus-visible:border-transparent backdrop-blur-md pr-10"
                  />
                  <BellRing className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>
                <Button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 shrink-0 cursor-pointer"
                >
                  Notify Me
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Feature Preview Section Header */}
      <div className="space-y-1 pt-2">
        <h2 className="text-xl font-bold text-slate-900 font-urbanist tracking-tight">
          What to Expect in Fees & Finance
        </h2>
        <p className="text-sm text-slate-500 font-sans">
          Preview the core features designed to simplify tuition and account management.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="size-12 rounded-xl bg-blue-50 text-brand-primary border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="size-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary font-urbanist">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-urbanist">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-sans leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-400 group-hover:text-brand-primary transition-colors">
                <span>In Development</span>
                <ChevronRight className="size-3.5 ml-auto" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
