import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface UserStats {
  level: number
  total_points: number
  rank: {
    global: number
    city: number
    province: number
    neighborhood: number
  }
  contributions: {
    proposals_created: number
    proposals_supported: number
    comments_made: number
    projects_joined: number
    missions_completed: number
    tutorials_completed: number
    days_active: number
  }
  badges_earned: number
  current_streak: number
  longest_streak: number
  last_activity: string
  created_at: string
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-user-stats')
      
      if (error) throw error
      
      setStats(data.stats)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const getLevelFromPoints = useCallback((points: number) => {
    // Sistema de niveles: cada 100 puntos = 1 nivel
    // Nivel 1: 0-99 puntos
    // Nivel 2: 100-199 puntos
    // etc.
    return Math.floor(points / 100) + 1
  }, [])

  const getPointsForNextLevel = useCallback((currentPoints: number) => {
    const currentLevel = getLevelFromPoints(currentPoints)
    const nextLevelPoints = currentLevel * 100
    return nextLevelPoints - currentPoints
  }, [getLevelFromPoints])

  const getProgressToNextLevel = useCallback((currentPoints: number) => {
    const currentLevel = getLevelFromPoints(currentPoints)
    const currentLevelMinPoints = (currentLevel - 1) * 100
    const nextLevelPoints = currentLevel * 100
    
    if (currentPoints >= nextLevelPoints) return 100
    
    return Math.round(((currentPoints - currentLevelMinPoints) / 100) * 100)
  }, [getLevelFromPoints])

  // Calcular nivel basado en puntos actuales
  const currentLevel = stats ? getLevelFromPoints(stats.total_points) : 1
  const pointsToNextLevel = stats ? getPointsForNextLevel(stats.total_points) : 100
  const progressToNextLevel = stats ? getProgressToNextLevel(stats.total_points) : 0

  // Función para obtener el título del usuario basado en su nivel y actividad
  const getUserTitle = useCallback(() => {
    if (!stats) return 'Nuevo Usuario'
    
    const { contributions, level } = stats
    
    if (level >= 10 && contributions.proposals_created >= 20) {
      return 'Líder Comunitario'
    } else if (level >= 7 && contributions.projects_joined >= 5) {
      return 'Colaborador Activo'
    } else if (level >= 5 && contributions.comments_made >= 50) {
      return 'Participante Entusiasta'
    } else if (level >= 3 && contributions.missions_completed >= 10) {
      return 'Explorador Dedicado'
    } else if (level >= 2) {
      return 'Usuario Activo'
    } else {
      return 'Nuevo Usuario'
    }
  }, [stats])

  // Función para obtener descripción del nivel
  const getLevelDescription = useCallback(() => {
    if (!stats) return ''
    
    const { contributions } = stats
    
    if (currentLevel >= 10) {
      return 'Veterano de la plataforma con gran influencia comunitaria'
    } else if (currentLevel >= 7) {
      return 'Miembro experimentado con múltiples colaboraciones'
    } else if (currentLevel >= 5) {
      return 'Participante comprometido con la comunidad'
    } else if (currentLevel >= 3) {
      return 'Usuario en crecimiento con misiones completadas'
    } else if (currentLevel >= 2) {
      return 'Usuario activo con participación regular'
    } else {
      return 'Recién llegado a la plataforma VOSZ'
    }
  }, [currentLevel, stats])

  useEffect(() => {
    fetchStats()
    
    // Actualizar estadísticas cada 30 segundos
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    currentLevel,
    pointsToNextLevel,
    progressToNextLevel,
    getUserTitle,
    getLevelDescription,
    refetch: fetchStats,
  }
}