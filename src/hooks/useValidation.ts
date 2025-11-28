import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface ValidationVote {
  id: string
  proposal_id: string
  voter_id: string
  voter_name: string
  vote_type: 'support' | 'reject'
  reason?: string
  created_at: string
}

export interface ValidationStats {
  total_votes: number
  support_votes: number
  reject_votes: number
  support_percentage: number
  rejection_percentage: number
  threshold_met: boolean
  days_remaining: number
  validation_ends_at: string
}

export function useValidation() {
  const [validationStats, setValidationStats] = useState<ValidationStats | null>(null)
  const [userVotes, setUserVotes] = useState<ValidationVote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchValidationStats = useCallback(async (proposalId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-validation-stats', {
        body: { proposalId }
      })
      
      if (error) throw error
      
      setValidationStats(data.stats)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const castVote = useCallback(async (
    proposalId: string, 
    voteType: 'support' | 'reject', 
    reason?: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('cast-validation-vote', {
        body: { proposalId, voteType, reason }
      })
      
      if (error) throw error
      
      // Actualizar estado local si es necesario
      await fetchValidationStats(proposalId)
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchValidationStats])

  const changeVote = useCallback(async (
    voteId: string, 
    newVoteType: 'support' | 'reject', 
    newReason?: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('change-validation-vote', {
        body: { voteId, voteType: newVoteType, reason: newReason }
      })
      
      if (error) throw error
      
      // Actualizar lista local de votos
      setUserVotes(prev => prev.map(vote => 
        vote.id === voteId 
          ? { ...vote, vote_type: newVoteType, reason: newReason }
          : vote
      ))
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  const removeVote = useCallback(async (voteId: string, proposalId: string) => {
    try {
      const { error } = await supabase.functions.invoke('remove-validation-vote', {
        body: { voteId }
      })
      
      if (error) throw error
      
      // Remover de la lista local
      setUserVotes(prev => prev.filter(vote => vote.id !== voteId))
      
      // Actualizar estadísticas
      await fetchValidationStats(proposalId)
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchValidationStats])

  const fetchUserVotes = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-user-validation-votes')
      
      if (error) throw error
      
      setUserVotes(data.votes || [])
      
      return { success: true, data: data.votes }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  const getValidationRequirements = useCallback((proposalId: string) => {
    // Requisitos por defecto para validación
    // Estos podrían venir del backend o ser configurables
    return {
      min_votes: 10,
      support_threshold: 0.6, // 60% de apoyo mínimo
      max_days: 7,
      max_votes_per_user: 1 // Un voto por usuario
    }
  }, [])

  const checkValidationStatus = useCallback((stats: ValidationStats) => {
    const requirements = validationStats ? getValidationRequirements('') : null
    
    if (!stats || !requirements) {
      return {
        canVote: true,
        hasVoted: false,
        status: 'unknown',
        message: 'No se pueden cargar los requisitos de validación'
      }
    }

    const userVote = userVotes.find(vote => vote.proposal_id === stats.proposal_id)
    const thresholdMet = stats.support_percentage >= (requirements.support_threshold * 100)
    const minVotesReached = stats.total_votes >= requirements.min_votes

    let status: 'pending' | 'approved' | 'rejected' | 'expired' = 'pending'
    let message = ''

    if (stats.days_remaining <= 0) {
      status = 'expired'
      message = 'El período de validación ha expirado'
    } else if (thresholdMet && minVotesReached) {
      status = 'approved'
      message = 'La propuesta ha sido aprobada'
    } else if (stats.support_votes < (stats.total_votes * (1 - requirements.support_threshold))) {
      status = 'rejected'
      message = 'La propuesta ha sido rechazada'
    }

    return {
      canVote: !userVote && status === 'pending' && stats.days_remaining > 0,
      hasVoted: !!userVote,
      status,
      message,
      requirements,
      threshold: requirements.support_threshold * 100,
      progress: {
        votes: stats.total_votes,
        required: requirements.min_votes,
        percentage: (stats.total_votes / requirements.min_votes) * 100
      }
    }
  }, [userVotes, validationStats, getValidationRequirements])

  // Inicializar votos del usuario
  useEffect(() => {
    fetchUserVotes()
  }, [fetchUserVotes])

  return {
    validationStats,
    userVotes,
    loading,
    error,
    fetchValidationStats,
    castVote,
    changeVote,
    removeVote,
    fetchUserVotes,
    checkValidationStatus,
    getValidationRequirements,
  }
}