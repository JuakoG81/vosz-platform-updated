// Hook para gestionar claims (reclamos)
import { useState, useEffect } from 'react'
import { createClaim } from '../lib/supabase'

export function useClaims() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (
    title: string,
    description: string,
    category?: string,
    urgency?: string,
    location?: string
  ) => {
    try {
      setLoading(true)
      setError(null)
      const response = await createClaim(title, description, category, urgency, location)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear reclamo'
      setError(errorMessage)
      console.error('Error creating claim:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    create
  }
}