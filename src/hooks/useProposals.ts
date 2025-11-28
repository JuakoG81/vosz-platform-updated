// Hook para gestionar propuestas
import { useState, useEffect } from 'react'
import { getProposals, createProposal, type Proposal } from '../lib/supabase'

export function useProposals(statusFilter?: string) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProposals = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getProposals(statusFilter)
      
      if (response?.data?.proposals) {
        setProposals(response.data.proposals)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar propuestas')
      console.error('Error fetching proposals:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProposals()
  }, [statusFilter])

  const create = async (title: string, description: string) => {
    try {
      setError(null)
      const response = await createProposal(title, description)
      
      if (response?.data?.proposal) {
        // Recargar propuestas después de crear una nueva
        await fetchProposals()
        return response.data
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear propuesta')
      console.error('Error creating proposal:', err)
      throw err
    }
  }

  const refresh = () => {
    fetchProposals()
  }

  return {
    proposals,
    loading,
    error,
    create,
    refresh
  }
}