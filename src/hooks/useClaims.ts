import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Claim {
  id: string
  title: string
  description: string
  category: 'infrastructure' | 'safety' | 'environment' | 'social' | 'other'
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  location: {
    address: string
    latitude: number
    longitude: number
  }
  user_id: string
  created_at: string
  updated_at: string
  upvotes: number
  downvotes: number
  comments_count: number
  photos?: string[]
}

export function useClaims() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClaims = useCallback(async (filters?: {
    category?: string
    status?: string
    priority?: string
    limit?: number
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-claims', {
        body: { filters }
      })
      
      if (error) throw error
      
      setClaims(data.claims || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createClaim = useCallback(async (claimData: Omit<Claim, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes' | 'comments_count'>) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-claim', {
        body: { claimData }
      })
      
      if (error) throw error
      
      // Actualizar la lista local
      await fetchClaims()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchClaims])

  const updateClaim = useCallback(async (claimId: string, updates: Partial<Claim>) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-claim', {
        body: { claimId, updates }
      })
      
      if (error) throw error
      
      await fetchClaims()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchClaims])

  const deleteClaim = useCallback(async (claimId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-claim', {
        body: { claimId }
      })
      
      if (error) throw error
      
      await fetchClaims()
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchClaims])

  useEffect(() => {
    fetchClaims()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => fetchClaims(), 30000)
    return () => clearInterval(interval)
  }, [fetchClaims])

  return {
    claims,
    loading,
    error,
    fetchClaims,
    createClaim,
    updateClaim,
    deleteClaim,
  }
}