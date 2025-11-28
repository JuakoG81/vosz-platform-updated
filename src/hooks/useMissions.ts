import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Mission {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'achievement' | 'special'
  category: 'participation' | 'social' | 'education' | 'community'
  difficulty: 'easy' | 'medium' | 'hard'
  points_reward: number
  badge_reward?: string
  requirements: {
    type: string
    count: number
    description: string
  }[]
  progress: number
  is_completed: boolean
  is_claimed: boolean
  expires_at?: string
  created_at: string
}

export interface MissionsByType {
  [type: string]: Mission[]
}

export function useMissions() {
  const [missionsByType, setMissionsByType] = useState<MissionsByType>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMissions = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-missions')
      
      if (error) throw error
      
      // Agrupar misiones por tipo
      const grouped: MissionsByType = {}
      data.missions.forEach((mission: Mission) => {
        if (!grouped[mission.type]) {
          grouped[mission.type] = []
        }
        grouped[mission.type].push(mission)
      })
      
      setMissionsByType(grouped)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const claimMission = useCallback(async (missionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('claim-mission', {
        body: { missionId }
      })
      
      if (error) throw error
      
      await fetchMissions()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchMissions])

  const refreshProgress = useCallback(async () => {
    try {
      const { error } = await supabase.functions.invoke('refresh-mission-progress')
      
      if (error) throw error
      
      await fetchMissions()
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchMissions])

  useEffect(() => {
    fetchMissions()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchMissions, 30000)
    return () => clearInterval(interval)
  }, [fetchMissions])

  const allMissions = Object.values(missionsByType).flat()
  const activeMissions = allMissions.filter(m => !m.is_completed)
  const completedMissions = allMissions.filter(m => m.is_completed && !m.is_claimed)
  const claimedMissions = allMissions.filter(m => m.is_claimed)

  return {
    missionsByType,
    allMissions,
    activeMissions,
    completedMissions,
    claimedMissions,
    loading,
    error,
    fetchMissions,
    claimMission,
    refreshProgress,
  }
}