import { useState, useCallback } from 'react'

export const DEV_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'dev@vosz.app',
  user_metadata: {
    first_name: 'Usuario',
    last_name: 'Desarrollo',
    avatar: 'avatar1',
    show_email: false,
    show_location: false,
    allow_messages: true,
    public_profile: true,
  }
}

export function useAuth() {
  const [user, setUser] = useState(DEV_USER)

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Simular autenticación exitosa
      setUser(DEV_USER)
      return { user: DEV_USER, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setUser(null)
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }, [])

  const updateUser = useCallback((updates: any) => {
    setUser(prev => ({
      ...prev,
      ...updates,
      user_metadata: {
        ...prev.user_metadata,
        ...updates.user_metadata,
      }
    }))
  }, [])

  return {
    user,
    loading: false,
    signIn,
    signOut,
    updateUser,
  }
}