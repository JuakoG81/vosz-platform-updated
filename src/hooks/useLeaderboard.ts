// Hook para gestionar leaderboards territoriales
import { useState, useEffect, useCallback } from 'react'
import { getLeaderboard, type LeaderboardUser } from '../lib/supabase'

export type LeaderboardScope = 'global' | 'city' | 'province' | 'neighborhood'

export function useLeaderboard(initialScope: LeaderboardScope = 'global', initialLocation?: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [scope, setScope] = useState<LeaderboardScope>(initialScope)
  const [location, setLocation] = useState<string | undefined>(initialLocation)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getLeaderboard(scope, location, 50)
      
      if (response?.data?.leaderboard) {
        setLeaderboard(response.data.leaderboard)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ranking')
      console.error('Error fetching leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }, [scope, location])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  const changeScope = (newScope: LeaderboardScope, newLocation?: string) => {
    setScope(newScope)
    setLocation(newLocation)
  }

  return {
    leaderboard,
    scope,
    location,
    loading,
    error,
    changeScope,
    refresh: fetchLeaderboard
  }
}