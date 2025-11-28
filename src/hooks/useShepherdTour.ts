import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface TourStep {
  id: string
  title: string
  text: string
  attachTo?: {
    element: string
    on: 'top' | 'bottom' | 'left' | 'right'
  }
  buttons?: {
    text: string
    action: 'next' | 'back' | 'close' | 'skip'
    classes?: string
  }[]
  classes?: string
  scrollTo?: boolean
  canClickTarget?: boolean
}

export interface Tour {
  id: string
  name: string
  description: string
  steps: TourStep[]
  is_completed: boolean
  started_at?: string
  completed_at?: string
}

export function useShepherdTour() {
  const [currentTour, setCurrentTour] = useState<Tour | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startTour = useCallback(async (tourId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('start-tour', {
        body: { tourId }
      })
      
      if (error) throw error
      
      setCurrentTour(data.tour)
      setCurrentStepIndex(0)
      setIsActive(true)
      
      return { success: true, data }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const nextStep = useCallback(async () => {
    if (!currentTour || currentStepIndex >= currentTour.steps.length - 1) {
      return await completeTour()
    }

    const nextIndex = currentStepIndex + 1
    setCurrentStepIndex(nextIndex)

    // Registrar progreso del tour
    try {
      await supabase.functions.invoke('update-tour-progress', {
        body: {
          tourId: currentTour.id,
          stepIndex: nextIndex,
          action: 'next'
        }
      })
    } catch (err) {
      console.error('Error updating tour progress:', err)
    }
  }, [currentTour, currentStepIndex])

  const previousStep = useCallback(async () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1
      setCurrentStepIndex(prevIndex)

      // Registrar progreso del tour
      try {
        await supabase.functions.invoke('update-tour-progress', {
          body: {
            tourId: currentTour?.id,
            stepIndex: prevIndex,
            action: 'back'
          }
        })
      } catch (err) {
        console.error('Error updating tour progress:', err)
      }
    }
  }, [currentTour, currentStepIndex])

  const skipTour = useCallback(async () => {
    if (!currentTour) return

    try {
      await supabase.functions.invoke('complete-tour', {
        body: {
          tourId: currentTour.id,
          skipped: true
        }
      })
      
      resetTour()
      return { success: true }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [currentTour])

  const completeTour = useCallback(async () => {
    if (!currentTour) return { success: false, error: 'No active tour' }

    try {
      await supabase.functions.invoke('complete-tour', {
        body: {
          tourId: currentTour.id,
          stepIndex: currentStepIndex
        }
      })
      
      resetTour()
      return { success: true }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [currentTour, currentStepIndex])

  const resetTour = useCallback(() => {
    setCurrentTour(null)
    setCurrentStepIndex(0)
    setIsActive(false)
    setError(null)
  }, [])

  const getAvailableTours = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-available-tours')
      
      if (error) throw error
      
      return { success: true, data: data.tours || [] }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  const getCompletedTours = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-completed-tours')
      
      if (error) throw error
      
      return { success: true, data: data.completedTours || [] }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  // Limpiar tour si se desmonta el componente
  useEffect(() => {
    return () => {
      if (isActive) {
        resetTour()
      }
    }
  }, [isActive, resetTour])

  const currentStep = currentTour?.steps[currentStepIndex] || null
  const hasNext = currentStepIndex < (currentTour?.steps.length || 0) - 1
  const hasPrevious = currentStepIndex > 0
  const progress = currentTour?.steps.length ? ((currentStepIndex + 1) / currentTour.steps.length) * 100 : 0

  return {
    // Estado
    currentTour,
    currentStep,
    currentStepIndex,
    isActive,
    loading,
    error,
    hasNext,
    hasPrevious,
    progress,
    
    // Acciones
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    resetTour,
    getAvailableTours,
    getCompletedTours,
  }
}