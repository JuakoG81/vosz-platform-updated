import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { 
  MapIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  TrophyIcon,
  StarIcon,
  FireIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline'

interface TerritorialMetrics {
  city: {
    name: string
    population: number
    proposals: number
    projects: number
    activeUsers: number
    engagement: number
    topCategory: string
  }
  province: {
    name: string
    population: number
    cities: number
    proposals: number
    projects: number
    activeUsers: number
    engagement: number
  }
  neighborhood: {
    name: string
    population: number
    proposals: number
    projects: number
    activeUsers: number
    engagement: number
  }
}

interface TopUser {
  id: string
  name: string
  avatar?: string
  points: number
  rank: number
  category: string
  level: number
}

interface TrendingTopic {
  id: string
  title: string
  category: string
  mentions: number
  growth: number
  sentiment: 'positive' | 'neutral' | 'negative'
}

interface RegionalStats {
  globalRank: number
  nationalRank: number
  provincialRank: number
  participationRate: number
  proposalSuccessRate: number
  communitySatisfaction: number
}

export const TerritorialDashboard: React.FC = () => {
  const { user } = useAuth()
  const { getLeaderboard } = useLeaderboard()
  
  const [selectedTerritory, setSelectedTerritory] = useState<'neighborhood' | 'city' | 'province' | 'country'>('city')
  const [territorialData, setTerritorialData] = useState<TerritorialMetrics | null>(null)
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [regionalStats, setRegionalStats] = useState<RegionalStats | null>(null)
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  useEffect(() => {
    // Simulación de datos territoriales
    const mockTerritorialData: TerritorialMetrics = {
      city: {
        name: 'Buenos Aires',
        population: 3075646,
        proposals: 1247,
        projects: 89,
        activeUsers: 12453,
        engagement: 78.5,
        topCategory: 'Transporte'
      },
      province: {
        name: 'Provincia de Buenos Aires',
        population: 17569053,
        cities: 134,
        proposals: 5689,
        projects: 423,
        activeUsers: 87634,
        engagement: 65.2
      },
      neighborhood: {
        name: 'Palermo',
        population: 289041,
        proposals: 234,
        projects: 23,
        activeUsers: 3456,
        engagement: 82.1
      }
    }

    const mockTopUsers: TopUser[] = [
      {
        id: 'user_1',
        name: 'María González',
        avatar: '/avatars/maria.jpg',
        points: 2840,
        rank: 1,
        category: 'Espacios Verdes',
        level: 15
      },
      {
        id: 'user_2',
        name: 'Carlos Ruiz',
        avatar: '/avatars/carlos.jpg',
        points: 2650,
        rank: 2,
        category: 'Transporte',
        level: 14
      },
      {
        id: 'user_3',
        name: 'Ana Fernández',
        avatar: '/avatars/ana.jpg',
        points: 2380,
        rank: 3,
        category: 'Educación',
        level: 13
      },
      {
        id: 'user_4',
        name: 'Luis Martínez',
        points: 2200,
        rank: 4,
        category: 'Tecnología',
        level: 12
      },
      {
        id: 'user_5',
        name: 'Roberto Silva',
        points: 2150,
        rank: 5,
        category: 'Seguridad',
        level: 12
      }
    ]

    const mockTrendingTopics: TrendingTopic[] = [
      {
        id: 'topic_1',
        title: 'Buses eléctricos en el transporte público',
        category: 'Transporte',
        mentions: 156,
        growth: 23.5,
        sentiment: 'positive'
      },
      {
        id: 'topic_2',
        title: 'Parques para mascotas',
        category: 'Espacios Verdes',
        mentions: 134,
        growth: 18.2,
        sentiment: 'positive'
      },
      {
        id: 'topic_3',
        title: 'Centros de tecnología comunitaria',
        category: 'Educación',
        mentions: 98,
        growth: 15.7,
        sentiment: 'positive'
      },
      {
        id: 'topic_4',
        title: 'Alumbrado público inteligente',
        category: 'Tecnología',
        mentions: 87,
        growth: 12.3,
        sentiment: 'neutral'
      },
      {
        id: 'topic_5',
        title: 'Seguridad vecinal',
        category: 'Seguridad',
        mentions: 76,
        growth: 8.9,
        sentiment: 'neutral'
      }
    ]

    const mockRegionalStats: RegionalStats = {
      globalRank: 145,
      nationalRank: 12,
      provincialRank: 3,
      participationRate: 68.5,
      proposalSuccessRate: 42.3,
      communitySatisfaction: 8.2
    }

    setTerritorialData(mockTerritorialData)
    setTopUsers(mockTopUsers)
    setTrendingTopics(mockTrendingTopics)
    setRegionalStats(mockRegionalStats)
  }, [selectedTerritory, timeframe])

  const getCurrentTerritoryData = () => {
    if (!territorialData) return null
    
    switch (selectedTerritory) {
      case 'neighborhood':
        return {
          name: territorialData.neighborhood.name,
          population: territorialData.neighborhood.population,
          proposals: territorialData.neighborhood.proposals,
          projects: territorialData.neighborhood.projects,
          activeUsers: territorialData.neighborhood.activeUsers,
          engagement: territorialData.neighborhood.engagement,
          icon: <BuildingOfficeIcon className="h-6 w-6" />,
          subtitle: 'Barrio'
        }
      case 'city':
        return {
          name: territorialData.city.name,
          population: territorialData.city.population,
          proposals: territorialData.city.proposals,
          projects: territorialData.city.projects,
          activeUsers: territorialData.city.activeUsers,
          engagement: territorialData.city.engagement,
          icon: <MapIcon className="h-6 w-6" />,
          subtitle: 'Ciudad'
        }
      case 'province':
        return {
          name: territorialData.province.name,
          population: territorialData.province.population,
          proposals: territorialData.province.proposals,
          projects: territorialData.province.projects,
          activeUsers: territorialData.province.activeUsers,
          engagement: territorialData.province.engagement,
          icon: <GlobeAltIcon className="h-6 w-6" />,
          subtitle: 'Provincia'
        }
      default:
        return {
          name: territorialData.city.name,
          population: territorialData.city.population,
          proposals: territorialData.city.proposals,
          projects: territorialData.city.projects,
          activeUsers: territorialData.city.activeUsers,
          engagement: territorialData.city.engagement,
          icon: <MapIcon className="h-6 w-6" />,
          subtitle: 'Ciudad'
        }
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100'
      case 'neutral':
        return 'text-yellow-600 bg-yellow-100'
      case 'negative':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR').format(num)
  }

  const currentTerritory = getCurrentTerritoryData()

  if (!currentTerritory || !territorialData || !regionalStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando datos territoriales...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Territorial</h1>
              <p className="mt-2 text-gray-600">
                Estadísticas y rankings de participación por territorio
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
                <option value="year">Este año</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selector de territorio */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Territorio</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { key: 'neighborhood', label: 'Barrio', icon: BuildingOfficeIcon },
              { key: 'city', label: 'Ciudad', icon: MapIcon },
              { key: 'province', label: 'Provincia', icon: GlobeAltIcon },
              { key: 'country', label: 'País', icon: GlobeAltIcon }
            ].map((territory) => (
              <button
                key={territory.key}
                onClick={() => setSelectedTerritory(territory.key as any)}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
                  selectedTerritory === territory.key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <territory.icon className="h-6 w-6" />
                <span className="font-medium">{territory.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Métricas principales del territorio actual */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Población</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(currentTerritory.population)}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              {currentTerritory.subtitle}: {currentTerritory.name}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Propuestas</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(currentTerritory.proposals)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+12.5%</span>
              <span className="text-gray-500 ml-1">este mes</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrophyIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Proyectos</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(currentTerritory.projects)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">{currentTerritory.projects}</span>
              <span className="text-gray-500 ml-1">activos</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FireIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Participación</p>
                <p className="text-2xl font-bold text-gray-900">{currentTerritory.engagement}%</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-orange-600 font-medium">{formatNumber(currentTerritory.activeUsers)}</span>
              <span className="text-gray-500 ml-1">usuarios activos</span>
            </div>
          </div>
        </div>

        {/* Rankings regionales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Rankings de posición */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Rankings de Posición</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Ranking Mundial</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">#{regionalStats.globalRank}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Ranking Nacional</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">#{regionalStats.nationalRank}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Ranking Provincial</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">#{regionalStats.provincialRank}</span>
              </div>
            </div>
          </div>

          {/* Métricas de desempeño */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Métricas de Desempeño</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Tasa de Participación</span>
                  <span className="text-sm font-bold text-gray-900">{regionalStats.participationRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${regionalStats.participationRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Tasa de Éxito de Propuestas</span>
                  <span className="text-sm font-bold text-gray-900">{regionalStats.proposalSuccessRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${regionalStats.proposalSuccessRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Satisfacción Comunitaria</span>
                  <span className="text-sm font-bold text-gray-900">{regionalStats.communitySatisfaction}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${regionalStats.communitySatisfaction * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top usuarios y temas trending */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top usuarios */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Top Usuarios - {currentTerritory.subtitle}</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {topUsers.map((user, index) => (
                <div key={user.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {index < 3 && (
                          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            'bg-orange-500 text-white'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                        <span className="text-sm font-bold text-gray-900">{user.points} pts</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{user.category} • Nivel {user.level}</span>
                        <span className="text-xs text-gray-500">#{user.rank}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Temas trending */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Temas Trending</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {trendingTopics.map((topic) => (
                <div key={topic.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{topic.title}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSentimentColor(topic.sentiment)}`}>
                          {topic.sentiment === 'positive' ? 'Positivo' : 
                           topic.sentiment === 'neutral' ? 'Neutral' : 'Negativo'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{topic.category}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{topic.mentions} menciones</span>
                        <span className="flex items-center">
                          <TrendingUpIcon className="h-3 w-3 mr-1" />
                          +{topic.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{topic.mentions}</div>
                      <div className="text-xs text-gray-500">menciones</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Categoría Principal</h4>
              <p className="text-lg font-bold text-blue-600">{territorialData.city.topCategory}</p>
              <p className="text-xs text-gray-500">Más actividad en esta categoría</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Crecimiento Mensual</h4>
              <p className="text-lg font-bold text-green-600">+15.2%</p>
              <p className="text-xs text-gray-500">En propuestas activas</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Nuevos Usuarios</h4>
              <p className="text-lg font-bold text-purple-600">+234</p>
              <p className="text-xs text-gray-500">Este mes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}