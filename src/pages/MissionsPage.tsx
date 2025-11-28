// Pagina de Misiones
import { Target } from 'lucide-react'
import { MainLayoutV1 } from '../components/v1/MainLayoutV1'
import { MissionCard } from '../components/gamification/MissionCard'
import { useMissions } from '../hooks/useMissions'

const typeLabels: Record<string, { title: string; description: string }> = {
  daily: { 
    title: 'Misiones Diarias', 
    description: 'Se reinician cada dia a medianoche' 
  },
  weekly: { 
    title: 'Misiones Semanales', 
    description: 'Se reinician cada lunes' 
  },
  achievement: { 
    title: 'Logros', 
    description: 'Completa una vez para desbloquear' 
  }
}

export function MissionsPage() {
  const { missionsByType, totalCompleted, totalMissions, loading, error } = useMissions()

  return (
    <MainLayoutV1>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Misiones</h1>
          </div>
          <p className="text-gray-600">
            Completa misiones para ganar puntos adicionales
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Misiones completadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCompleted} / {totalMissions}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Progreso</p>
              <p className="text-2xl font-bold text-green-600">
                {totalMissions > 0 ? Math.round((totalCompleted / totalMissions) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Missions by type */}
        {loading ? (
          <div className="animate-pulse space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-24 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(missionsByType).map(([type, missions]) => {
              const typeInfo = typeLabels[type] || typeLabels.daily
              
              return missions.length > 0 && (
                <div key={type}>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {typeInfo.title}
                    </h2>
                    <p className="text-sm text-gray-500">{typeInfo.description}</p>
                  </div>
                  <div className="space-y-4">
                    {missions.map((mission) => (
                      <MissionCard key={mission.id} mission={mission} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </MainLayoutV1>
  )
}