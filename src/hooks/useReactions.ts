import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ReactionCounts, ReactionEmoji } from '@/types/reactions'

export function useReactions() {
  const [reactions, setReactions] = useState<ReactionCounts>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReactions = useCallback(async (targetId: string, targetType: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-reactions', {
        body: { targetId, targetType }
      })
      
      if (error) throw error
      
      setReactions(data.reactions || {})
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleReaction = useCallback(async (targetId: string, emoji: ReactionEmoji) => {
    try {
      const { data, error } = await supabase.functions.invoke('toggle-reaction', {
        body: { targetId, emoji }
      })
      
      if (error) throw error
      
      // Actualizar estado local
      setReactions(prev => {
        const currentCount = prev[emoji] || 0
        const hasReacted = data.userReactions?.includes(emoji)
        
        return {
          ...prev,
          [emoji]: hasReacted ? currentCount + 1 : Math.max(0, currentCount - 1)
        }
      })
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  const getUserReactions = useCallback(async (targetId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-user-reactions', {
        body: { targetId }
      })
      
      if (error) throw error
      
      return { success: true, data: data.reactions || [] }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  const clearAllReactions = useCallback(async (targetId: string) => {
    try {
      const { error } = await supabase.functions.invoke('clear-all-reactions', {
        body: { targetId }
      })
      
      if (error) throw error
      
      setReactions({})
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  // Función para agregar una reacción sin remover otras (solo añadir)
  const addReaction = useCallback(async (targetId: string, emoji: ReactionEmoji) => {
    try {
      const { data, error } = await supabase.functions.invoke('add-reaction', {
        body: { targetId, emoji }
      })
      
      if (error) throw error
      
      setReactions(prev => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1
      }))
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  // Función para remover una reacción específica
  const removeReaction = useCallback(async (targetId: string, emoji: ReactionEmoji) => {
    try {
      const { data, error } = await supabase.functions.invoke('remove-reaction', {
        body: { targetId, emoji }
      })
      
      if (error) throw error
      
      setReactions(prev => ({
        ...prev,
        [emoji]: Math.max(0, (prev[emoji] || 0) - 1)
      }))
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  // Obtener el emoji con más reacciones
  const getMostPopularReaction = useCallback(() => {
    let maxCount = 0
    let mostPopularEmoji: ReactionEmoji | null = null
    
    Object.entries(reactions).forEach(([emoji, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostPopularEmoji = emoji as ReactionEmoji
      }
    })
    
    return mostPopularEmoji
  }, [reactions])

  // Obtener total de reacciones
  const getTotalReactions = useCallback(() => {
    return Object.values(reactions).reduce((sum, count) => sum + count, 0)
  }, [reactions])

  return {
    reactions,
    loading,
    error,
    fetchReactions,
    toggleReaction,
    addReaction,
    removeReaction,
    getUserReactions,
    clearAllReactions,
    getMostPopularReaction,
    getTotalReactions,
  }
}