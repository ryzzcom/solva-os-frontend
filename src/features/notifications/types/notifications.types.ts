export type NotificationType =
  | 'ANNOUNCEMENT'
  | 'ATTENDANCE'
  | 'HOMEWORK'
  | 'LEAVE_REQUEST'
  | 'PTM'
  | 'SYSTEM'

export interface NotificationItem {
  id: string
  school_id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  metadata?: {
    entity_id?: string
    entity_type?: string
    sender_name?: string
    action_url?: string
  } | null
  is_read: boolean
  read_at?: string | null
  created_at: string
}

export interface NotificationsQueryParams {
  page?: number
  limit?: number
  is_read?: boolean | string
  type?: NotificationType | string
  search?: string
}

export interface NotificationsListResponse {
  notifications: NotificationItem[]
  unreadCount?: number
  unread_count?: number
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface UnreadCountResponse {
  unread_count: number
}
