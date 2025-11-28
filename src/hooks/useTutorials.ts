import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Tutorial {
  id: string
  title: string
  description: string
  category: 'basics' | 'advanced' | 'community' | 'projects' | 'proposals'
  estimated_duration: number // en minutos
  steps: {
    id: string
    title: string
    content: string
    video_url?: string
    image_url?: string
    action?: {
      type: 'click' | 'form' | 'navigation'
      selector?: string
      description: string
    }
  }[]
  is_completed: boolean
  is_started: boolean
  completed_at?: string
  progress: number // porcentaje de completado
  points_reward?: number
}

export function useTutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTutorials = useCallback(async (category?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-tutorials', {
        body: { category }
      })
      
      if (error) throw error
      
      setTutorials(data.tutorials || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const startTutorial = useCallback(async (tutorialId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('start-tutorial', {
        body: { tutorialId }
      })
      
      if (error) throw error
      
      await fetchTutorials()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchTutorials])

  const completeTutorial = useCallback(async (tutorialId: string, progress: number = 100) => {
    try {
      const { data, error } = await supabase.functions.invoke('complete-tutorial', {
        body: { tutorialId, progress }
      })
      
      if (error) throw error
      
      await fetchTutorials()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchTutorials])

  const updateProgress = useCallback(async (tutorialId: string, stepIndex: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-tutorial-progress', {
        body: { tutorialId, stepIndex }
      })
      
      if (error) throw error
      
      await fetchTutorials()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchTutorials])

  const resetTutorial = useCallback(async (tutorialId: string) => {
    try {
      const { error } = await supabase.functions.invoke('reset-tutorial', {
        body: { tutorialId }
      })
      
      if (error) throw error
      
      await fetchTutorials()
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchTutorials])

  const getRecommendedTutorials = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-recommended-tutorials')
      
      if (error) throw error
      
      return { success: true, data: data.recommendedTutorials || [] }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  // Calcular estadísticas
  const stats = {
    total: tutorials.length,
    completed: tutorials.filter(t => t.is_completed).length,
    inProgress: tutorials.filter(t => t.is_started && !t.is_completed).length,
    notStarted: tutorials.filter(t => !t.is_started).length,
    totalPoints: tutorials
      .filter(t => t.is_completed && t.points_reward)
      .reduce((sum, t) => sum + (t.points_reward || 0), 0),
    averageProgress: tutorials.length > 0 
      ? tutorials.reduce((sum, t) => sum + t.progress, 0) / tutorials.length 
      : 0
  }

  // Agrupar por categoría
  const tutorialsByCategory = tutorials.reduce((acc, tutorial) => {
    if (!acc[tutorial.category]) {
      acc[tutorial.category] = []
    }
    acc[tutorial.category].push(tutorial)
    return acc
  }, {} as Record<string, Tutorial[]>)

  useEffect(() => {
    fetchTutorials()
  }, [fetchTutorials])

  return {
    tutorials,
    tutorialsByCategory,
    loading,
    error,
    stats,
    fetchTutorials,
    startTutorial,
    completeTutorial,
    updateProgress,
    resetTutorial,
    getRecommendedTutorials,
  }
}