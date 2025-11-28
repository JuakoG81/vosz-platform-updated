// Hook para gestionar notificaciones con polling automatico
import { useState, useEffect, useCallback, useRef } from 'react'
import { getNotifications, markNotificationsRead, type Notification } from '../lib/supabase'

const POLLING_INTERVAL = 30000 // 30 segundos

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchNotifications = useCallback(async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) {
        setLoading(true)
      }
      setError(null)
      const response = await getNotifications(false, 50)
      
      if (response?.data) {
        setNotifications(response.data.notifications || [])
        setUnreadCount(response.data.unread_count || 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar notificaciones')
      console.error('Error fetching notifications:', err)
    } finally {
      if (!isBackgroundRefresh) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    // Carga inicial
    fetchNotifications()

    // Configurar polling automatico cada 30 segundos
    intervalRef.current = setInterval(() => {
      fetchNotifications(true) // Background refresh sin loading state
    }, POLLING_INTERVAL)

    // Cleanup al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchNotifications])

  const markAsRead = async (notificationIds: string[]) => {
    try {
      setError(null)
      await markNotificationsRead(notificationIds)
      await fetchNotifications()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar notificacion')
      console.error('Error marking notification as read:', err)
      throw err
    }
  }

  const markAllAsRead = async () => {
    try {
      setError(null)
      await markNotificationsRead(undefined, true)
      await fetchNotifications()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar notificaciones')
      console.error('Error marking all as read:', err)
      throw err
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
    fetchNotifications
  }
}