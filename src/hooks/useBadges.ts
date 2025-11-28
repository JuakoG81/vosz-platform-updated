import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: string
  progress: number
  unlocked_at?: string
  requirements: {
    type: 'proposals' | 'comments' | 'votes' | 'streak' | 'special'
    count: number
    description: string
  }
}

export interface BadgesByCategory {
  [category: string]: Badge[]
}

export function useBadges() {
  const [badgesByCategory, setBadgesByCategory] = useState<BadgesByCategory>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBadges = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-badges')
      
      if (error) throw error
      
      // Agrupar insignias por categoría
      const grouped: BadgesByCategory = {}
      data.badges.forEach((badge: Badge) => {
        if (!grouped[badge.category]) {
          grouped[badge.category] = []
        }
        grouped[badge.category].push(badge)
      })
      
      setBadgesByCategory(grouped)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBadges()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchBadges, 30000)
    return () => clearInterval(interval)
  }, [fetchBadges])

  return {
    badgesByCategory,
    loading,
    error,
    refetch: fetchBadges,
  }
}