import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    avatar?: string
    last_seen: string
  }[]
  last_message: {
    content: string
    sender_id: string
    created_at: string
    is_read: boolean
  }
  unread_count: number
  created_at: string
  updated_at: string
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-conversations')
      
      if (error) throw error
      
      setConversations(data.conversations || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createConversation = useCallback(async (participantId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-conversation', {
        body: { participantId }
      })
      
      if (error) throw error
      
      await fetchConversations()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchConversations])

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      const { error } = await supabase.functions.invoke('mark-conversation-read', {
        body: { conversationId }
      })
      
      if (error) throw error
      
      await fetchConversations()
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchConversations])

  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-conversation', {
        body: { conversationId }
      })
      
      if (error) throw error
      
      await fetchConversations()
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchConversations])

  useEffect(() => {
    fetchConversations()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchConversations, 30000)
    return () => clearInterval(interval)
  }, [fetchConversations])

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    createConversation,
    markAsRead,
    deleteConversation,
  }
}