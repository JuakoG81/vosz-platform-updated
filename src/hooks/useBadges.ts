// Hook para gestionar badges del usuario
import { useState, useEffect, useCallback } from 'react'
import { getUserBadges, type Badge } from '../lib/supabase'

interface BadgesByCategory {
  participation: Badge[]
  validation: Badge[]
  projects: Badge[]
  community: Badge[]
  special: Badge[]
}

export function useBadges(userId?: string) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [badgesByCategory, setBadgesByCategory] = useState<BadgesByCategory>({
    participation: [],
    validation: [],
    projects: [],
    community: [],
    special: []
  })
  const [totalEarned, setTotalEarned] = useState(0)
  const [totalAvailable, setTotalAvailable] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBadges = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getUserBadges(userId)
      
      if (response?.data) {
        setBadges(response.data.badges || [])
        setBadgesByCategory(response.data.badges_by_category || {
          participation: [],
          validation: [],
          projects: [],
          community: [],
          special: []
        })
        setTotalEarned(response.data.total_earned || 0)
        setTotalAvailable(response.data.total_available || 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar insignias')
      console.error('Error fetching badges:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchBadges()
  }, [fetchBadges])

  return {
    badges,
    badgesByCategory,
    totalEarned,
    totalAvailable,
    loading,
    error,
    refresh: fetchBadges
  }
}