import React from 'react'
import { createPortal } from 'react-dom'
import { X, Clock, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotificationDetails } from '../api/useNotificationDetails'

interface NotificationDetailModalProps {
  notificationId: string | null
  onClose: () => void
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notificationId,
  onClose,
}) => {
  const { data: notification, isLoading, isError } = useNotificationDetails(notificationId || undefined)

  if (!notificationId) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 p-6 md:p-8 space-y-6 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {isLoading ? (
          <div className="p-8 text-center space-y-3 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="size-8 text-brand-primary animate-spin" />
            <span className="text-sm font-medium">Loading notification details...</span>
          </div>
        ) : isError || !notification ? (
          <div className="p-6 text-center space-y-3 text-rose-700">
            <AlertCircle className="size-8 text-rose-600 mx-auto" />
            <p className="text-sm font-semibold">Failed to load notification details.</p>
            <Button onClick={onClose} variant="outline" className="rounded-xl">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Type Badge & Category */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-primary border border-blue-100 text-xs font-semibold uppercase tracking-wider font-urbanist">
                {notification.type}
              </span>
              <span className="text-xs text-slate-400 font-sans flex items-center gap-1 ml-auto">
                <Clock className="size-3.5" />
                {new Date(notification.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Notification Title */}
            <h2 className="text-xl font-bold font-urbanist text-slate-900 leading-snug">
              {notification.title}
            </h2>

            {/* Notification Message Content Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 md:p-5 text-sm text-slate-700 font-sans leading-relaxed whitespace-pre-wrap">
              {notification.message}
            </div>

            {/* Metadata Information if present */}
            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800 font-urbanist block">Additional Details:</span>
                {notification.metadata.sender_name && (
                  <p>Sender: <span className="font-medium text-slate-900">{notification.metadata.sender_name}</span></p>
                )}
                {notification.metadata.entity_type && (
                  <p>Related Entity: <span className="font-medium text-slate-900">{notification.metadata.entity_type}</span></p>
                )}
              </div>
            )}

            {/* Close Action */}
            <div className="pt-2">
              <Button
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
