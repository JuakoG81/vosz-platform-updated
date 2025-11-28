// Hook para gestionar reacciones con emojis en comentarios
import { useState, useEffect, useCallback } from 'react'
import { getReactions as getReactionsFunc, addReaction as addReactionFunc, removeReaction as removeReactionFunc } from '../lib/supabase'
import type { EmojiType, CommentReaction, ReactionCount, AddReactionData } from '../types/reactions'

interface UseReactionsReturn {
  reactions: Record<string, ReactionCount[]>
  loading: boolean
  error: string | null
  addReaction: (commentId: string, emojiType: EmojiType) => Promise<void>
  removeReaction: (commentId: string, emojiType: EmojiType) => Promise<void>
  getReactions: (commentIds: string[]) => Promise<void>
  refreshReactions: () => void
}

export function useReactions(): UseReactionsReturn {
  const [reactions, setReactions] = useState<Record<string, ReactionCount[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para obtener reacciones de múltiples comentarios
  const fetchReactions = useCallback(async (commentIds: string[]) => {
    if (!commentIds.length) return

    try {
      setError(null)
      const response = await getReactionsFunc(commentIds)

      if (!response?.success && response?.error) {
        throw new Error(response.error.message || 'Error al obtener reacciones')
      }

      if (response?.data) {
        const reactionsMap: Record<string, ReactionCount[]> = {}
        
        // Inicializar mapa para cada comentario
        commentIds.forEach(commentId => {
          reactionsMap[commentId] = []
        })

        // Agregar contadores por emoji
        if (Array.isArray(response.data.counts)) {
          response.data.counts.forEach((countData: any) => {
            const commentId = countData.comment_id
            if (commentId && reactionsMap[commentId]) {
              reactionsMap[commentId].push({
                emoji_type: countData.emoji_type,
                count: countData.count
              })
            }
          })
        }

        setReactions(reactionsMap)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener reacciones'
      setError(errorMessage)
      console.error('Error fetching reactions:', err)
    }
  }, [])

  // Función para agregar una reacción
  const addReaction = async (commentId: string, emojiType: EmojiType) => {
    try {
      setError(null)

      const response = await addReactionFunc(commentId, emojiType)

      if (!response?.success && response?.error) {
        throw new Error(response.error.message || 'Error al agregar reacción')
      }

      // Actualizar estado local inmediatamente para mejor UX
      setReactions(prev => {
        const updated = { ...prev }
        const currentReactions = updated[commentId] || []
        
        // Buscar si el usuario ya reaccionó con este emoji
        const existingIndex = currentReactions.findIndex(
          r => r.emoji_type === emojiType
        )

        if (existingIndex >= 0) {
          // Incrementar contador existente
          updated[commentId] = currentReactions.map((r, index) =>
            index === existingIndex
              ? { ...r, count: r.count + 1 }
              : r
          )
        } else {
          // Agregar nueva reacción
          updated[commentId] = [
            ...currentReactions,
            { emoji_type: emojiType, count: 1 }
          ]
        }

        return updated
      })

      // Refrescar datos del servidor
      await refreshReactions()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar reacción'
      setError(errorMessage)
      console.error('Error adding reaction:', err)
      throw err
    }
  }

  // Función para remover una reacción
  const removeReaction = async (commentId: string, emojiType: EmojiType) => {
    try {
      setError(null)

      const response = await removeReactionFunc(commentId, emojiType)

      if (!response?.success && response?.error) {
        throw new Error(response.error.message || 'Error al remover reacción')
      }

      // Actualizar estado local inmediatamente
      setReactions(prev => {
        const updated = { ...prev }
        const currentReactions = updated[commentId] || []

        const existingIndex = currentReactions.findIndex(
          r => r.emoji_type === emojiType
        )

        if (existingIndex >= 0) {
          const updatedReactions = currentReactions.map((r, index) =>
            index === existingIndex && r.count > 1
              ? { ...r, count: r.count - 1 }
              : index === existingIndex && r.count <= 1
              ? null // Eliminar la reacción si el count llega a 0
              : r
          ).filter(Boolean) as ReactionCount[]

          updated[commentId] = updatedReactions
        }

        return updated
      })

      // Refrescar datos del servidor
      await refreshReactions()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al remover reacción'
      setError(errorMessage)
      console.error('Error removing reaction:', err)
      throw err
    }
  }

  // Función para obtener reacciones de comentarios específicos
  const getReactions = useCallback(async (commentIds: string[]) => {
    setLoading(true)
    try {
      await fetchReactions(commentIds)
    } finally {
      setLoading(false)
    }
  }, [fetchReactions])

  // Función para refrescar todas las reacciones
  const refreshReactions = useCallback(async () => {
    const commentIds = Object.keys(reactions)
    if (commentIds.length > 0) {
      await fetchReactions(commentIds)
    }
  }, [reactions, fetchReactions])

  // Polling automático cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const commentIds = Object.keys(reactions)
      if (commentIds.length > 0) {
        fetchReactions(commentIds)
      }
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [fetchReactions, reactions])

  return {
    reactions,
    loading,
    error,
    addReaction,
    removeReaction,
    getReactions,
    refreshReactions
  }
}