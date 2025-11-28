import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface LeaderboardEntry {
  rank: number
  user_id: string
  user_name: string
  user_avatar?: string
  score: number
  position: 'global' | 'city' | 'province' | 'neighborhood'
  change_from_last_week: number
}

export function useLeaderboard(position: 'global' | 'city' | 'province' | 'neighborhood' = 'global', location?: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-leaderboard', {
        body: { position, location }
      })
      
      if (error) throw error
      
      setLeaderboard(data.leaderboard || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [position, location])

  useEffect(() => {
    fetchLeaderboard()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [fetchLeaderboard])

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard,
  }
}