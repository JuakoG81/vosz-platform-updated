import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Notification {
  id: string
  type: 'proposal_comment' | 'project_update' | 'mission_reward' | 'mention' | 'system'
  title: string
  message: string
  data: {
    proposal_id?: string
    project_id?: string
    comment_id?: string
    user_id?: string
  }
  is_read: boolean
  created_at: string
  read_at?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async (limit = 50) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-notifications', {
        body: { limit }
      })
      
      if (error) throw error
      
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      const { error } = await supabase.functions.invoke('mark-notifications-read', {
        body: { notificationIds }
      })
      
      if (error) throw error
      
      // Actualizar estado local
      setNotifications(prev => prev.map(notif => 
        notificationIds.includes(notif.id) ? { ...notif, is_read: true, read_at: new Date().toISOString() } : notif
      ))
      
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length))
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
      
      if (unreadIds.length === 0) return { success: true }
      
      const { error } = await supabase.functions.invoke('mark-notifications-read', {
        body: { notificationIds: unreadIds }
      })
      
      if (error) throw error
      
      // Actualizar estado local
      setNotifications(prev => prev.map(notif => ({ 
        ...notif, 
        is_read: true, 
        read_at: new Date().toISOString() 
      })))
      
      setUnreadCount(0)
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [notifications])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-notification', {
        body: { notificationId }
      })
      
      if (error) throw error
      
      const deletedNotif = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      // Actualizar contador si la notificación no había sido leída
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [notifications])

  const clearAll = useCallback(async () => {
    try {
      const { error } = await supabase.functions.invoke('clear-notifications')
      
      if (error) throw error
      
      setNotifications([])
      setUnreadCount(0)
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  }
}