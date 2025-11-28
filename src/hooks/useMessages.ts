import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_avatar?: string
  content: string
  type: 'text' | 'image' | 'file'
  attachment_url?: string
  created_at: string
  is_read: boolean
  read_at?: string
}

export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const fetchMessages = useCallback(async (reset = false) => {
    if (!conversationId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const currentPage = reset ? 1 : page
      
      const { data, error } = await supabase.functions.invoke('get-messages', {
        body: { 
          conversationId,
          page: currentPage,
          limit: 20
        }
      })
      
      if (error) throw error
      
      if (reset) {
        setMessages(data.messages || [])
        setPage(2)
      } else {
        setMessages(prev => [...prev, ...(data.messages || [])])
        setPage(prev => prev + 1)
      }
      
      setHasMore(data.hasMore !== false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [conversationId, page])

  const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'file' = 'text', attachmentUrl?: string) => {
    if (!conversationId) return { success: false, error: 'No conversation selected' }
    
    try {
      const { data, error } = await supabase.functions.invoke('send-message', {
        body: {
          conversationId,
          content,
          type,
          attachmentUrl
        }
      })
      
      if (error) throw error
      
      // Añadir mensaje a la lista local
      setMessages(prev => [...prev, data.message])
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [conversationId])

  const markAsRead = useCallback(async (messageIds: string[]) => {
    try {
      const { error } = await supabase.functions.invoke('mark-messages-read', {
        body: { messageIds }
      })
      
      if (error) throw error
      
      // Actualizar estado local
      setMessages(prev => prev.map(msg => 
        messageIds.includes(msg.id) ? { ...msg, is_read: true, read_at: new Date().toISOString() } : msg
      ))
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-message', {
        body: { messageId }
      })
      
      if (error) throw error
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  useEffect(() => {
    if (conversationId) {
      fetchMessages(true)
      
      // Actualizar cada 30 segundos
      const interval = setInterval(() => fetchMessages(), 30000)
      return () => clearInterval(interval)
    }
  }, [conversationId, fetchMessages])

  return {
    messages,
    loading,
    error,
    hasMore,
    fetchMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
  }
}