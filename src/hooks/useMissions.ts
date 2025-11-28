// Hook para gestionar misiones
import { useState, useEffect, useCallback } from 'react'
import { getMissions, type Mission } from '../lib/supabase'

interface MissionsByType {
  daily: Mission[]
  weekly: Mission[]
  achievement: Mission[]
}

export function useMissions(userId?: string) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [missionsByType, setMissionsByType] = useState<MissionsByType>({
    daily: [],
    weekly: [],
    achievement: []
  })
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [totalMissions, setTotalMissions] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getMissions(userId)
      
      if (response?.data) {
        setMissions(response.data.missions || [])
        setMissionsByType(response.data.missions_by_type || {
          daily: [],
          weekly: [],
          achievement: []
        })
        setTotalCompleted(response.data.total_completed || 0)
        setTotalMissions(response.data.total_missions || 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar misiones')
      console.error('Error fetching missions:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchMissions()
  }, [fetchMissions])

  return {
    missions,
    missionsByType,
    totalCompleted,
    totalMissions,
    loading,
    error,
    refresh: fetchMissions
  }
}