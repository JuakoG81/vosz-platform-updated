// Tipos para el sistema de reacciones con emojis

export type EmojiType = '❤️' | '😂' | '😮' | '😢' | '😡' | '👍' | '👎'

export interface CommentReaction {
  id: string
  comment_id: string
  user_id: string
  emoji_type: EmojiType
  created_at: string
  user?: {
    id: string
    username: string
    avatar_url?: string
  }
}

export interface ReactionCount {
  emoji_type: EmojiType
  count: number
  users?: {
    id: string
    username: string
    avatar_url?: string
  }[]
}

export interface AddReactionData {
  comment_id: string
  emoji_type: EmojiType
}

export interface ReactionResponse {
  success: boolean
  data?: {
    reaction?: CommentReaction
    counts?: ReactionCount[]
  }
  error?: string
}

export interface GetReactionsResponse {
  success: boolean
  data?: {
    reactions: CommentReaction[]
    counts: ReactionCount[]
  }
  error?: string
}

// Mapeo de emojis para accesibilidad
export const EMOJI_MAPPING: Record<EmojiType, { name: string; label: string }> = {
  '❤️': { name: 'heart', label: 'Me encanta' },
  '😂': { name: 'laugh', label: 'Me divierte' },
  '😮': { name: 'wow', label: 'Me asombra' },
  '😢': { name: 'sad', label: 'Me entristece' },
  '😡': { name: 'angry', label: 'Me enoja' },
  '👍': { name: 'thumbs_up', label: 'Me gusta' },
  '👎': { name: 'thumbs_down', label: 'No me gusta' }
}

// Lista de emojis soportados
export const SUPPORTED_EMOJIS: EmojiType[] = ['❤️', '😂', '😮', '😢', '😡', '👍', '👎']