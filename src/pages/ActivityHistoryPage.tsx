// Pagina Activity History - Historial de actividades del usuario con puntos
import { useEffect, useState } from 'react'
import { MainLayoutV1 } from '../components/v1/MainLayoutV1'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { supabase, DEV_USER } from '../lib/supabase'
import type { UserActivity } from '../lib/supabase'

interface ActivityDisplay extends UserActivity {
  icon: string
  color: string
  label: string
}

export function ActivityHistoryPage() {
  const [activities, setActivities] = useState<ActivityDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)

      // Cargar actividades del usuario
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', DEV_USER.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      // Mapear actividades con información visual
      const mappedActivities: ActivityDisplay[] = (data || []).map((activity) => {
        const config = getActivityConfig(activity.activity_type)
        return {
          ...activity,
          ...config
        }
      })

      setActivities(mappedActivities)

      // Calcular total de puntos
      const total = mappedActivities.reduce((sum, act) => sum + (act.points_awarded || 0), 0)
      setTotalPoints(total)

    } catch (error) {
      console.error('Error al cargar actividades:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityConfig = (type: string) => {
    const configs: Record<string, { icon: string; color: string; label: string }> = {
      'proposal_created': {
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        color: 'text-blue-600 bg-blue-100',
        label: 'Propuesta Creada'
      },
      'validation_made': {
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'text-green-600 bg-green-100',
        label: 'Validación Realizada'
      },
      'claim_created': {
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        color: 'text-red-600 bg-red-100',
        label: 'Reclamo Creado'
      },
      'convert_proposal_to_project': {
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        color: 'text-purple-600 bg-purple-100',
        label: 'Propuesta Convertida a Proyecto'
      },
      'milestone_completed': {
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        color: 'text-indigo-600 bg-indigo-100',
        label: 'Hito Completado'
      },
      'project_completed': {
        icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
        color: 'text-yellow-600 bg-yellow-100',
        label: 'Proyecto Completado'
      },
      'tutorial_completed': {
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        color: 'text-teal-600 bg-teal-100',
        label: 'Tutorial Completado'
      }
    }

    return configs[type] || {
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-gray-600 bg-gray-100',
      label: 'Actividad'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
    } else if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
    } else if (diffDays < 7) {
      return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  if (loading) {
    return (
      <MainLayoutV1>
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </MainLayoutV1>
    )
  }

  return (
    <MainLayoutV1>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historial de Actividades</h1>
            <p className="text-gray-600 mt-1">
              Todas tus acciones y puntos ganados
            </p>
          </div>
          <Button onClick={loadActivities} variant="outline">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Actualizar
          </Button>
        </div>

        {/* Resumen de Puntos */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <CardContent className="text-center py-8">
            <svg className="w-16 h-16 text-yellow-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="text-4xl font-bold text-gray-900 mb-2">{totalPoints} puntos</div>
            <div className="text-gray-600">Puntos totales ganados</div>
          </CardContent>
        </Card>

        {/* Lista de Actividades */}
        {activities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay actividades</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza a participar para ver tu historial
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${activity.color} flex items-center justify-center`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activity.icon} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{activity.label}</h3>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(activity.created_at)}</p>
                        </div>
                        <Badge variant="default" className="flex-shrink-0">
                          +{activity.points_awarded} puntos
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contador */}
        {activities.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Mostrando {activities.length} actividad{activities.length !== 1 ? 'es' : ''}
          </div>
        )}
      </div>
    </MainLayoutV1>
  )
}