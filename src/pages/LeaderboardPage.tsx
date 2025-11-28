// Pagina de Ranking/Leaderboard
import { useState } from 'react'
import { Trophy, Globe, Building, MapPin, Home } from 'lucide-react'
import { MainLayoutV1 } from '../components/v1/MainLayoutV1'
import { CommunitySelector } from '../components/v1/CommunitySelector'
import { LeaderboardTable } from '../components/gamification/LeaderboardTable'
import { useLeaderboard, type LeaderboardScope } from '../hooks/useLeaderboard'

const scopeOptions: { value: LeaderboardScope; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'global', label: 'Global', icon: Globe },
  { value: 'province', label: 'Provincia', icon: Building },
  { value: 'city', label: 'Ciudad', icon: MapPin },
  { value: 'neighborhood', label: 'Barrio', icon: Home }
]

export function LeaderboardPage() {
  const [selectedScope, setSelectedScope] = useState<LeaderboardScope>('global')
  const [locationFilter, setLocationFilter] = useState<string>('')
  const { leaderboard, loading, error, changeScope } = useLeaderboard(selectedScope)

  const handleScopeChange = (scope: LeaderboardScope) => {
    setSelectedScope(scope)
    setLocationFilter('')
    changeScope(scope, scope === 'global' ? undefined : locationFilter)
  }

  const handleLocationSearch = () => {
    if (locationFilter.trim()) {
      changeScope(selectedScope, locationFilter)
    }
  }

  return (
    <MainLayoutV1>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Ranking</h1>
          </div>
          <p className="text-gray-600">
            Descubre a los ciudadanos mas activos de tu comunidad
          </p>
        </div>

        {/* CommunitySelector */}
        <CommunitySelector showMetrics={false} />

        {/* Scope selector */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {scopeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleScopeChange(option.value)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedScope === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <option.icon className="w-4 h-4" />
                {option.label}
              </button>
            ))}
          </div>

          {/* Location filter */}
          {selectedScope !== 'global' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder={`Buscar por ${
                  selectedScope === 'province' ? 'provincia' :
                  selectedScope === 'city' ? 'ciudad' : 'barrio'
                }...`}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
              />
              <button
                onClick={handleLocationSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Buscar
              </button>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm">
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <LeaderboardTable 
              users={leaderboard} 
              showLocation={selectedScope === 'global'} 
            />
          )}
        </div>
      </div>
    </MainLayoutV1>
  )
}