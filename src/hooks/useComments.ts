import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useReactions } from './useReactions'

export interface Comment {
  id: string
  content: string
  author_id: string
  author_name: string
  author_avatar?: string
  parent_id?: string
  target_type: 'proposal' | 'project' | 'claim' | 'comment'
  target_id: string
  created_at: string
  updated_at: string
  is_edited: boolean
  reactions: any[]
  replies?: Comment[]
}

export function useComments(targetType: string, targetId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { reactions, toggleReaction } = useReactions()

  const fetchComments = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-comments', {
        body: { targetType, targetId }
      })
      
      if (error) throw error
      
      setComments(data.comments || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [targetType, targetId])

  const createComment = useCallback(async (content: string, parentId?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-comment', {
        body: {
          content,
          targetType,
          targetId,
          parentId
        }
      })
      
      if (error) throw error
      
      await fetchComments()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [targetType, targetId, fetchComments])

  const updateComment = useCallback(async (commentId: string, content: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-comment', {
        body: { commentId, content }
      })
      
      if (error) throw error
      
      await fetchComments()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchComments])

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-comment', {
        body: { commentId }
      })
      
      if (error) throw error
      
      await fetchComments()
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchComments])

  const handleReaction = useCallback(async (commentId: string, emoji: string) => {
    try {
      await toggleReaction(`comment_${commentId}`, emoji)
      await fetchComments() // Refrescar comentarios para actualizar contadores
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [toggleReaction, fetchComments])

  useEffect(() => {
    if (targetType && targetId) {
      fetchComments()
      
      // Actualizar cada 30 segundos
      const interval = setInterval(fetchComments, 30000)
      return () => clearInterval(interval)
    }
  }, [targetType, targetId, fetchComments])

  return {
    comments,
    loading,
    error,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    handleReaction,
  }
}