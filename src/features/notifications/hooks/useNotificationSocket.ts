import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'

export const useNotificationSocket = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
      : 'http://localhost:5000'

    const socket: Socket = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      // Connected to notification socket
    })

    socket.on('notification_received', () => {
      // Auto invalidate notifications query cache on new real-time event
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] })
    })

    return () => {
      socket.disconnect()
    }
  }, [queryClient])
}
