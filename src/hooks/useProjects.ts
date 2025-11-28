// Hook para gestionar proyectos
import { useState, useEffect } from 'react'

// Mock data para proyectos
const mockProjects = [
  {
    id: '1',
    title: 'Mejoramiento de calles del centro',
    description: 'Proyecto para renovar el pavimento de las calles principales',
    status: 'in_progress',
    progress: 65,
    created_at: '2024-01-15',
    votes: 89
  },
  {
    id: '2',
    title: 'Nuevo parque infantil',
    description: 'Crear un área de juegos para niños en el barrio norte',
    status: 'planned',
    progress: 25,
    created_at: '2024-01-10',
    votes: 156
  }
]

export function useProjects() {
  const [projects, setProjects] = useState(mockProjects)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TODO: Conectar con backend real cuando esté disponible
  const fetchProjects = async () => {
    try {
      setLoading(true)
      // Simulamos una carga
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProjects(mockProjects)
    } catch (err) {
      setError('Error al cargar proyectos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    refresh: fetchProjects
  }
}