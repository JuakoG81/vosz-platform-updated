// Configuracion del cliente Supabase para VOSZ Platform
// MODO DEV: Sin autenticacion real, usuario simulado

import { createClient } from '@supabase/supabase-js'

// Configuracion de Supabase
const supabaseUrl = "https://stojepugrnrngejhqlfq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0b2plcHVncm5ybmdlamhxbGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjY1NDAsImV4cCI6MjA3ODgwMjU0MH0.eKyC50Jcj-soxMntR2J3ECeLU-S8-lULkMYMgdIbdrs"

// Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// MODO DEV: Usuario simulado para desarrollo sin autenticacion
export const DEV_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  username: 'dev',
  points: 0
}

// Funciones helper para interactuar con edge functions

/**
 * Crear una nueva propuesta
 * @param title - Titulo de la propuesta
 * @param description - Descripcion de la propuesta
 * @returns Propuesta creada con puntos asignados
 */
export async function createProposal(title: string, description: string) {
  const { data, error } = await supabase.functions.invoke('create-proposal', {
    body: {
      title,
      description,
      user_id: DEV_USER.id // MODO DEV: usar usuario simulado
      // TODO FASE X: Reemplazar con auth.uid() cuando se active autenticacion
    }
  })

  if (error) {
    console.error('Error al crear propuesta:', error)
    throw error
  }

  return data
}

/**
 * Validar una propuesta (apoyo o rechazo)
 * @param proposalId - ID de la propuesta
 * @param voteType - 'support' o 'reject'
 * @returns Estado actualizado de la propuesta
 */
export async function validateProposal(proposalId: string, voteType: 'support' | 'reject') {
  const { data, error } = await supabase.functions.invoke('validate-proposal', {
    body: {
      proposal_id: proposalId,
      user_id: DEV_USER.id, // MODO DEV
      vote_type: voteType
    }
  })

  if (error) {
    console.error('Error al validar propuesta:', error)
    throw error
  }

  return data
}

/**
 * Obtener todas las propuestas
 * @param status - Filtro opcional por estado ('pending', 'validated', 'rejected')
 * @returns Lista de propuestas con porcentaje de validacion
 */
export async function getProposals(status?: string) {
  const { data, error } = await supabase.functions.invoke('get-proposals', {
    body: status ? { status } : {}
  })

  if (error) {
    console.error('Error al obtener propuestas:', error)
    throw error
  }

  return data
}

/**
 * Obtener estadisticas del usuario
 * @param userId - ID del usuario (opcional, usa DEV_USER por defecto)
 * @returns Estadisticas completas del usuario
 */
export async function getUserStats(userId?: string) {
  const targetUserId = userId || DEV_USER.id
  
  const { data, error } = await supabase.functions.invoke('get-user-stats', {
    body: { user_id: targetUserId }
  })

  if (error) {
    console.error('Error al obtener estadisticas:', error)
    throw error
  }

  return data
}

/**
 * Crear un nuevo reclamo
 * @param title - Titulo del reclamo
 * @param description - Descripcion del reclamo
 * @param category - Categoria del reclamo (opcional)
 * @param urgency - Urgencia del reclamo: 'low', 'medium', 'high' (opcional)
 * @param location - Ubicación del reclamo (opcional)
 * @returns Reclamo creado con puntos asignados
 */
export async function createClaim(
  title: string, 
  description: string, 
  category?: string, 
  urgency?: string, 
  location?: string
) {
  const { data, error } = await supabase.functions.invoke('create-claim', {
    body: {
      title,
      description,
      user_id: DEV_USER.id, // MODO DEV
      category: category || 'general',
      urgency: urgency || 'medium',
      location: location || null
    }
  })

  if (error) {
    console.error('Error al crear reclamo:', error)
    throw error
  }

  return data
}

/**
 * Convertir una propuesta validada en proyecto
 * @param proposalId - ID de la propuesta validada
 * @returns Proyecto creado con puntos asignados
 */
export async function convertProposalToProject(proposalId: string) {
  const { data, error } = await supabase.functions.invoke('convert-proposal-to-project', {
    body: {
      proposal_id: proposalId
    }
  })

  if (error) {
    console.error('Error al convertir propuesta a proyecto:', error)
    throw error
  }

  return data
}

// Tipos TypeScript para las entidades

export interface Profile {
  id: string
  username: string
  points: number
  created_at: string
  level?: number
  rank?: string
  neighborhood?: string
  city?: string
  province?: string
  country?: string
  bio?: string
  avatar_url?: string
}

export interface Proposal {
  id: string
  title: string
  description: string
  creator_id: string
  status: 'pending' | 'validated' | 'rejected'
  support_count_cache: number
  reject_count_cache: number
  created_at: string
  updated_at: string
  validation_percentage?: number
  total_votes?: number
}

export interface Validation {
  id: string
  proposal_id: string
  user_id: string
  vote_type: 'support' | 'reject'
  created_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  activity_type: 'proposal_created' | 'validation_made' | 'claim_created'
  points_awarded: number
  created_at: string
}

export interface Claim {
  id: string
  title: string
  description: string
  creator_id: string
  status: 'requested' | 'in_progress' | 'resolved'
  created_at: string
  updated_at?: string
  category?: string
  urgency?: 'low' | 'medium' | 'high'
  location?: string
}

export interface UserStats {
  user_id: string
  username: string
  total_points: number
  proposals_created: number
  validations_made: number
  recent_activities: UserActivity[]
  member_since: string
}

// Tipos Fase 5 - Gamificacion

export interface Comment {
  id: string
  content: string
  author_id: string
  entity_type: 'proposal' | 'project' | 'claim'
  entity_id: string
  parent_id?: string
  is_edited: boolean
  created_at: string
  updated_at: string
  author?: Profile
  replies?: Comment[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: 'participation' | 'validation' | 'projects' | 'community' | 'special'
  requirement_type: string
  requirement_value: number
  points_reward: number
  is_earned?: boolean
  earned_at?: string
  current_progress?: number
  progress_percentage?: number
}

export interface Mission {
  id: string
  title: string
  description: string
  icon: string
  mission_type: 'daily' | 'weekly' | 'achievement'
  action_type: string
  target_count: number
  points_reward: number
  is_active: boolean
  current_progress?: number
  is_completed?: boolean
  completed_at?: string
  progress_percentage?: number
}

export interface Notification {
  id: string
  user_id: string
  type: 'proposal_validated' | 'project_created' | 'milestone_completed' | 'new_comment' | 'badge_earned' | 'mission_completed' | 'points_earned'
  title: string
  message: string
  reference_type?: string
  reference_id?: string
  is_read: boolean
  created_at: string
}

export interface LeaderboardUser {
  id: string
  username: string
  points: number
  level: number
  rank: string
  city?: string
  province?: string
  neighborhood?: string
  avatar_url?: string
  position: number
}

// Funciones Fase 5

export async function createComment(content: string, entityType: string, entityId: string, parentId?: string) {
  const { data, error } = await supabase.functions.invoke('create-comment', {
    body: {
      content,
      entity_type: entityType,
      entity_id: entityId,
      parent_id: parentId,
      user_id: DEV_USER.id
    }
  })
  if (error) throw error
  return data
}

export async function getComments(entityType: string, entityId: string) {
  const { data, error } = await supabase.functions.invoke('get-comments', {
    body: { entity_type: entityType, entity_id: entityId }
  })
  if (error) throw error
  return data
}

export async function deleteComment(commentId: string, confirmDelete?: boolean) {
  const { data, error } = await supabase.functions.invoke('delete-comment', {
    body: { 
      comment_id: commentId, 
      user_id: DEV_USER.id,
      confirm_delete: confirmDelete || false
    }
  })
  if (error) throw error
  return data
}

export async function getLeaderboard(scope?: string, location?: string, limit?: number) {
  const { data, error } = await supabase.functions.invoke('get-leaderboard', {
    body: { scope: scope || 'global', location, limit: limit || 50 }
  })
  if (error) throw error
  return data
}

export async function getUserBadges(userId?: string) {
  const { data, error } = await supabase.functions.invoke('get-user-badges', {
    body: { user_id: userId || DEV_USER.id }
  })
  if (error) throw error
  return data
}

export async function getMissions(userId?: string) {
  const { data, error } = await supabase.functions.invoke('get-missions', {
    body: { user_id: userId || DEV_USER.id }
  })
  if (error) throw error
  return data
}

export async function getNotifications(unreadOnly?: boolean, limit?: number) {
  const { data, error } = await supabase.functions.invoke('get-notifications', {
    body: { 
      user_id: DEV_USER.id, 
      unread_only: unreadOnly || false,
      limit: limit || 50
    }
  })
  if (error) throw error
  return data
}

export async function markNotificationsRead(notificationIds?: string[], markAll?: boolean) {
  const { data, error } = await supabase.functions.invoke('mark-notifications-read', {
    body: {
      user_id: DEV_USER.id,
      notification_ids: notificationIds,
      mark_all: markAll || false
    }
  })
  if (error) throw error
  return data
}

export async function getTerritorialStats(scope?: string, location?: string) {
  const { data, error } = await supabase.functions.invoke('get-territorial-stats', {
    body: { scope, location }
  })
  if (error) throw error
  return data
}

// Interfaces para respuestas de edge functions
export interface EdgeFunctionResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface ReactionsResponse {
  reactions: any[]
  counts: any[]
}

// Funciones del sistema de reacciones

export async function getReactions(commentIds: string[]): Promise<EdgeFunctionResponse<ReactionsResponse>> {
  const { data, error } = await supabase.functions.invoke('get-reactions', {
    body: { comment_ids: commentIds }
  })
  if (error) throw error
  return data
}

export async function addReaction(commentId: string, emojiType: string): Promise<EdgeFunctionResponse<any>> {
  const { data, error } = await supabase.functions.invoke('add-reaction', {
    body: {
      comment_id: commentId,
      emoji_type: emojiType
    }
  })
  if (error) throw error
  return data
}

export async function removeReaction(commentId: string, emojiType: string): Promise<EdgeFunctionResponse<any>> {
  const { data, error } = await supabase.functions.invoke('remove-reaction', {
    body: {
      comment_id: commentId,
      emoji_type: emojiType
    }
  })
  if (error) throw error
  return data
}