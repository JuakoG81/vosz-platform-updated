// Hook para gestionar estadisticas de usuario
import { useState, useEffect } from 'react'
import { getUserStats, type UserStats, DEV_USER } from '../lib/supabase'

export function useUserStats(userId?: string) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const targetUserId = userId || DEV_USER.id
      const response = await getUserStats(targetUserId)
      
      if (response?.data) {
        setStats(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadisticas')
      console.error('Error fetching user stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [userId])

  const refresh = () => {
    fetchStats()
  }

  return {
    stats,
    loading,
    error,
    refresh
  }
}