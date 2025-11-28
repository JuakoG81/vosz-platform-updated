// Hook para gestionar validacion de propuestas
import { useState } from 'react'
import { validateProposal } from '../lib/supabase'

export function useValidation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const vote = async (proposalId: string, voteType: 'support' | 'reject') => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await validateProposal(proposalId, voteType)
      
      if (response?.data) {
        return response.data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al votar'
      setError(errorMessage)
      console.error('Error voting:', err)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    vote,
    loading,
    error,
    clearError
  }
}