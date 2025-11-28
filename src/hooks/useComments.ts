// Hook para gestionar comentarios
import { useState, useEffect, useCallback } from 'react'
import { getComments, createComment, deleteComment as deleteCommentFromSupabase, type Comment } from '../lib/supabase'
import { useReactions } from './useReactions'

export function useComments(entityType: string, entityId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getReactions } = useReactions()

  const fetchComments = useCallback(async () => {
    if (!entityId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await getComments(entityType, entityId)
      
      if (response?.data?.comments) {
        setComments(response.data.comments)
        
        // Inicializar reacciones para todos los comentarios cargados
        const commentIds = response.data.comments.map((comment: Comment) => comment.id)
        if (commentIds.length > 0) {
          await getReactions(commentIds)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar comentarios')
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }, [entityType, entityId, getReactions])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Polling automático cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchComments()
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [fetchComments])

  const addComment = async (content: string, parentId?: string) => {
    try {
      setError(null)
      const response = await createComment(content, entityType, entityId, parentId)
      
      if (response?.data?.comment) {
        await fetchComments()
        return response.data
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear comentario')
      console.error('Error creating comment:', err)
      throw err
    }
  }

  const [loadingDelete, setLoadingDelete] = useState<string | null>(null)
  const [errorDelete, setErrorDelete] = useState<string | null>(null)

  const removeComment = async (commentId: string, confirmDelete?: boolean) => {
    try {
      setErrorDelete(null)
      setLoadingDelete(commentId)
      
      // Obtener el comentario para verificar si tiene respuestas
      const commentToDelete = comments.find(c => c.id === commentId)
      if (!commentToDelete) {
        throw new Error('Comentario no encontrado')
      }

      const hasReplies = commentToDelete.replies && commentToDelete.replies.length > 0
      
      // Si el comentario tiene respuestas y no se confirmó la eliminación, pedir confirmación
      if (hasReplies && !confirmDelete) {
        const error = new Error('CONFIRMATION_REQUIRED') as any
        error.hasReplies = true
        error.commentId = commentId
        throw error
      }

      await deleteCommentFromSupabase(commentId, confirmDelete)
      
      // Actualización inmediata del estado sin necesidad de recargar
      setComments(prev => prev.filter(comment => comment.id !== commentId))
      
      // También eliminar de las respuestas anidadas
      const removeFromReplies = (replies: any[]): any[] => {
        return replies.filter(reply => reply.id !== commentId).map(reply => ({
          ...reply,
          replies: reply.replies ? removeFromReplies(reply.replies) : []
        }))
      }
      
      setComments(prev => prev.map(comment => ({
        ...comment,
        replies: comment.replies ? removeFromReplies(comment.replies) : []
      })))
      
      return { success: true, hasReplies }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar comentario'
      setErrorDelete(errorMessage)
      console.error('Error deleting comment:', err)
      throw err
    } finally {
      setLoadingDelete(null)
    }
  }

  return {
    comments,
    loading,
    error,
    addComment,
    removeComment,
    loadingDelete,
    errorDelete,
    refresh: fetchComments
  }
}