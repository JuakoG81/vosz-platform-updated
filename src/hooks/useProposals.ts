import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Proposal {
  id: string
  title: string
  description: string
  category: 'infrastructure' | 'environment' | 'social' | 'culture' | 'technology' | 'other'
  status: 'pending' | 'validated' | 'rejected' | 'in_progress' | 'completed'
  author_id: string
  author_name: string
  author_avatar?: string
  location: {
    address: string
    latitude: number
    longitude: number
  }
  votes: {
    support: number
    reject: number
  }
  user_vote?: 'support' | 'reject'
  supporters_count: number
  comments_count: number
  created_at: string
  updated_at: string
  expires_at: string
  images?: string[]
  tags?: string[]
}

export function useProposals(filters?: {
  status?: string
  category?: string
  location?: string
  limit?: number
}) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProposals = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-proposals', {
        body: { filters }
      })
      
      if (error) throw error
      
      setProposals(data.proposals || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const getProposal = useCallback(async (proposalId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-proposal', {
        body: { proposalId }
      })
      
      if (error) throw error
      
      return { success: true, data: data.proposal }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  const createProposal = useCallback(async (proposalData: Omit<Proposal, 'id' | 'author_id' | 'created_at' | 'updated_at' | 'votes' | 'supporters_count' | 'comments_count' | 'user_vote'>) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-proposal', {
        body: { proposalData }
      })
      
      if (error) throw error
      
      await fetchProposals()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProposals])

  const updateProposal = useCallback(async (proposalId: string, updates: Partial<Proposal>) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-proposal', {
        body: { proposalId, updates }
      })
      
      if (error) throw error
      
      await fetchProposals()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProposals])

  const deleteProposal = useCallback(async (proposalId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-proposal', {
        body: { proposalId }
      })
      
      if (error) throw error
      
      await fetchProposals()
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProposals])

  const voteProposal = useCallback(async (proposalId: string, voteType: 'support' | 'reject') => {
    try {
      const { data, error } = await supabase.functions.invoke('vote-proposal', {
        body: { proposalId, voteType }
      })
      
      if (error) throw error
      
      await fetchProposals()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProposals])

  const supportProposal = useCallback(async (proposalId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('support-proposal', {
        body: { proposalId }
      })
      
      if (error) throw error
      
      await fetchProposals()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProposals])

  useEffect(() => {
    fetchProposals()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchProposals, 30000)
    return () => clearInterval(interval)
  }, [fetchProposals])

  return {
    proposals,
    loading,
    error,
    fetchProposals,
    getProposal,
    createProposal,
    updateProposal,
    deleteProposal,
    voteProposal,
    supportProposal,
  }
}