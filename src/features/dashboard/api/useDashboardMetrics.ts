import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/lib/axios'

interface MonthTrend {
  month: string
  percentage: number
}

interface FeeStat {
  month: string
  collected: number
  pending: number
}

interface RecentActivity {
  message: string
  relativeTime: string
}

export interface DashboardMetricsResponse {
  student_stats: {
    total_count: number
    low_attendance_count: number
  }
  teacher_stats: {
    total_count: number
  }
  attendance_stats: {
    today_rate: number
    trend: MonthTrend[]
  }
  financial_stats: {
    pending_fees: number
    fee_collection_status: FeeStat[]
  }
  ptm_stats: {
    upcoming_count: number
  }
  parent_engagement: {
    grade: string
  }
  recent_activities: RecentActivity[]
}

export const useDashboardMetrics = () => {
  return useQuery<DashboardMetricsResponse, Error>({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await axiosInstance.get<{ status: string; data: DashboardMetricsResponse }>('/dashboard/metrics')
      return response.data.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep stats dynamic
  })
}
