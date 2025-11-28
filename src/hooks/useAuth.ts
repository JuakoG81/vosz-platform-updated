import { DEV_USER } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  name?: string;
  points?: number;
}

/**
 * Hook de autenticación para VOSZ Platform
 * MODO DEV: Devuelve usuario simulado para desarrollo
 */
export function useAuth(): { user: AuthUser | null; loading: boolean; error: string | null } {
  // MODO DEV: Siempre retornamos el usuario de desarrollo
  // En producción, aquí iría la lógica real de autenticación
  const user = {
    id: DEV_USER.id,
    username: DEV_USER.username,
    points: DEV_USER.points,
    email: 'dev@vosz.com',
    name: 'Usuario de Desarrollo'
  };

  return {
    user,
    loading: false,
    error: null
  };
}