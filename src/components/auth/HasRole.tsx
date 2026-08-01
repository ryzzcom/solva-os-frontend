import React from 'react'
import { useAuthStore } from '@/store/authStore'

interface HasRoleProps {
  allowedRoles: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const HasRole: React.FC<HasRoleProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const user = useAuthStore((state) => state.user)
  const role = user?.role?.toUpperCase() || ''

  if (!user || (allowedRoles.length > 0 && !allowedRoles.map((r) => r.toUpperCase()).includes(role))) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default HasRole
