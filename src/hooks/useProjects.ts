import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export interface Project {
  id: string
  title: string
  description: string
  category: 'infrastructure' | 'environment' | 'social' | 'culture' | 'technology' | 'other'
  status: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled'
  budget?: number
  location: {
    address: string
    latitude: number
    longitude: number
  }
  created_by: string
  team_members: {
    user_id: string
    role: 'leader' | 'member' | 'volunteer'
    joined_at: string
  }[]
  milestones: {
    id: string
    title: string
    description: string
    due_date: string
    is_completed: boolean
    completed_at?: string
  }[]
  updates: {
    id: string
    title: string
    content: string
    images?: string[]
    created_at: string
    created_by: string
  }[]
  supporters_count: number
  volunteers_needed: number
  volunteers_count: number
  created_at: string
  updated_at: string
}

export function useProjects(filters?: {
  status?: string
  category?: string
  location?: string
}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('get-projects', {
        body: { filters }
      })
      
      if (error) throw error
      
      setProjects(data.projects || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const getProject = useCallback(async (projectId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-project', {
        body: { projectId }
      })
      
      if (error) throw error
      
      return { success: true, data: data.project }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [])

  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'supporters_count' | 'volunteers_count'>) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-project', {
        body: { projectData }
      })
      
      if (error) throw error
      
      await fetchProjects()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProjects])

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase.functions.invoke('update-project', {
        body: { projectId, updates }
      })
      
      if (error) throw error
      
      await fetchProjects()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProjects])

  const joinProject = useCallback(async (projectId: string, role: 'member' | 'volunteer' = 'volunteer') => {
    try {
      const { data, error } = await supabase.functions.invoke('join-project', {
        body: { projectId, role }
      })
      
      if (error) throw error
      
      await fetchProjects()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProjects])

  const leaveProject = useCallback(async (projectId: string) => {
    try {
      const { error } = await supabase.functions.invoke('leave-project', {
        body: { projectId }
      })
      
      if (error) throw error
      
      await fetchProjects()
      
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProjects])

  const addMilestone = useCallback(async (projectId: string, milestone: Omit<Project['milestones'][0], 'id'>) => {
    try {
      const { data, error } = await supabase.functions.invoke('add-milestone', {
        body: { projectId, milestone }
      })
      
      if (error) throw error
      
      await fetchProjects()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProjects])

  const addUpdate = useCallback(async (projectId: string, update: Omit<Project['updates'][0], 'id' | 'created_at' | 'created_by'>) => {
    try {
      const { data, error } = await supabase.functions.invoke('add-project-update', {
        body: { projectId, update }
      })
      
      if (error) throw error
      
      await fetchProjects()
      
      return { success: true, data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }, [fetchProjects])

  useEffect(() => {
    fetchProjects()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchProjects, 30000)
    return () => clearInterval(interval)
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    joinProject,
    leaveProject,
    addMilestone,
    addUpdate,
  }
}