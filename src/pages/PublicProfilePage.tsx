import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useUserStats } from '@/hooks/useUserStats'
import { 
  UserIcon,
  CheckCircleIcon,
  MapPinIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  EyeIcon,
  TrophyIcon,
  StarIcon,
  PencilIcon,
  ShareIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid'

interface UserProfile {
  id: string
  name: string
  username: string
  avatar?: string
  bio: string
  location: {
    city: string
    country: string
    coordinates?: [number, number]
  }
  joinedAt: string
  verified: boolean
  level: number
  points: number
  badges: string[]
  stats: {
    proposals: number
    projects: number
    comments: number
    reactions: number
    followers: number
    following: number
    totalViews: number
    impactScore: number
  }
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    earnedAt: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }>
  recentActivity: Array<{
    id: string
    type: 'proposal' | 'comment' | 'reaction' | 'project'
    title: string
    description: string
    createdAt: string
    stats?: {
      views?: number
      reactions?: number
      comments?: number
    }
  }>
  socialLinks?: {
    website?: string
    twitter?: string
    linkedin?: string
  }
}

export const PublicProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const { user: currentUser } = useAuth()
  const { getUserStats } = useUserStats()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'projects' | 'activity'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulación de datos del perfil público
    const mockProfile: UserProfile = {
      id: 'user_1',
      name: 'María González',
      username: 'maria_gonzalez',
      avatar: '/avatars/maria.jpg',
      bio: 'Activista ciudadana y defensora del medio ambiente. Me apasiona crear espacios verdes sostenibles y promover la movilidad urbana responsable. Ingeniera ambiental con 8 años de experiencia.',
      location: {
        city: 'Buenos Aires',
        country: 'Argentina',
        coordinates: [-34.6037, -58.3816]
      },
      joinedAt: '2022-03-15T10:30:00Z',
      verified: true,
      level: 15,
      points: 2840,
      badges: ['Eco Warrior', 'Community Leader', 'Project Pioneer', 'Early Adopter'],
      stats: {
        proposals: 23,
        projects: 8,
        comments: 156,
        reactions: 892,
        followers: 342,
        following: 89,
        totalViews: 12345,
        impactScore: 94
      },
      achievements: [
        {
          id: 'ach_1',
          title: 'Pionera del Cambio',
          description: 'Crear su primera propuesta exitosa',
          icon: 'lightning-bolt',
          earnedAt: '2022-04-10T00:00:00Z',
          rarity: 'rare'
        },
        {
          id: 'ach_2',
          title: 'Líder Comunitario',
          description: 'Alcanzar 100 seguidores',
          icon: 'users',
          earnedAt: '2022-08-15T00:00:00Z',
          rarity: 'epic'
        },
        {
          id: 'ach_3',
          title: 'Guardián Verde',
          description: 'Crear 5 propuestas relacionadas con el medio ambiente',
          icon: 'leaf',
          earnedAt: '2023-01-20T00:00:00Z',
          rarity: 'legendary'
        }
      ],
      recentActivity: [
        {
          id: 'activity_1',
          type: 'proposal',
          title: 'Mejora del transporte público con buses eléctricos',
          description: 'Propuesta para modernizar el sistema de transporte',
          createdAt: '2024-01-25T14:30:00Z',
          stats: {
            views: 892,
            reactions: 156,
            comments: 47
          }
        },
        {
          id: 'activity_2',
          type: 'project',
          title: 'Renovación del Parque Central',
          description: 'Proyecto completado exitosamente',
          createdAt: '2024-01-20T10:15:00Z',
          stats: {
            views: 2345,
            reactions: 203,
            comments: 89
          }
        },
        {
          id: 'activity_3',
          type: 'comment',
          title: 'Comentario en "Zona de mascotas en el parque"',
          description: 'Excelente propuesta, podría mejorarse agregando...',
          createdAt: '2024-01-18T16:45:00Z'
        }
      ],
      socialLinks: {
        website: 'https://maria-gonzalez.com',
        twitter: '@maria_green_arg',
        linkedin: 'maria-gonzalez-activist'
      }
    }

    setTimeout(() => {
      setProfile(mockProfile)
      setLoading(false)
    }, 500)
  }, [userId])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const getAchievementColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100'
      case 'rare':
        return 'text-blue-600 bg-blue-100'
      case 'epic':
        return 'text-purple-600 bg-purple-100'
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'proposal':
        return <EyeIcon className="h-4 w-4" />
      case 'project':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'comment':
        return <ChatBubbleLeftIcon className="h-4 w-4" />
      case 'reaction':
        return <HeartIcon className="h-4 w-4" />
      default:
        return <UserIcon className="h-4 w-4" />
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'proposal':
        return 'Propuesta'
      case 'project':
        return 'Proyecto'
      case 'comment':
        return 'Comentario'
      case 'reaction':
        return 'Reacción'
      default:
        return 'Actividad'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Usuario no encontrado</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === profile.id

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del perfil */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Banner de fondo */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-green-500"></div>
          
          <div className="px-6 pb-6">
            {/* Foto de perfil y info básica */}
            <div className="flex items-start space-x-6 -mt-20">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center">
                    <UserIcon className="h-16 w-16 text-gray-600" />
                  </div>
                )}
                {profile.verified && (
                  <CheckCircleIcon className="absolute bottom-2 right-2 h-8 w-8 text-blue-500 bg-white rounded-full" />
                )}
              </div>
              
              <div className="flex-1 pt-20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                      <span className="text-lg text-gray-500">@{profile.username}</span>
                      {profile.verified && (
                        <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {profile.location.city}, {profile.location.country}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Se unió en {new Date(profile.joinedAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-gray-700 max-w-2xl">{profile.bio}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {!isOwnProfile && (
                      <button
                        onClick={handleFollow}
                        className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          isFollowing
                            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            : 'border-blue-500 text-white bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isFollowing ? 'Siguiendo' : 'Seguir'}
                      </button>
                    )}
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <ShareIcon className="h-4 w-4 mr-2" />
                      Compartir
                    </button>
                    {isOwnProfile && (
                      <Link
                        to="/profile/edit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Editar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Nivel y puntos */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <StarIconSolid className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Nivel {profile.level}</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(profile.points % 1000) / 10}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{profile.points} pts</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{profile.stats.proposals}</p>
            <p className="text-sm text-gray-500">Propuestas</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{profile.stats.projects}</p>
            <p className="text-sm text-gray-500">Proyectos</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{profile.stats.comments}</p>
            <p className="text-sm text-gray-500">Comentarios</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{profile.stats.reactions}</p>
            <p className="text-sm text-gray-500">Reacciones</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{profile.stats.followers}</p>
            <p className="text-sm text-gray-500">Seguidores</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{profile.stats.following}</p>
            <p className="text-sm text-gray-500">Siguiendo</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{profile.stats.impactScore}</p>
            <p className="text-sm text-gray-500">Impacto</p>
          </div>
        </div>

        {/* Tabs de contenido */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Resumen' },
                { key: 'proposals', label: `Propuestas (${profile.stats.proposals})` },
                { key: 'projects', label: `Proyectos (${profile.stats.projects})` },
                { key: 'activity', label: 'Actividad Reciente' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Tab: Resumen */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Logros */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Logros Destacados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profile.achievements.map((achievement) => (
                      <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 p-2 rounded-full ${getAchievementColor(achievement.rarity)}`}>
                            <TrophyIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{achievement.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              Ganado el {new Date(achievement.earnedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enlaces sociales */}
                {profile.socialLinks && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Enlaces</h3>
                    <div className="flex flex-wrap gap-4">
                      {profile.socialLinks.website && (
                        <a
                          href={profile.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500 text-sm"
                        >
                          Sitio Web
                        </a>
                      )}
                      {profile.socialLinks.twitter && (
                        <a
                          href={`https://twitter.com/${profile.socialLinks.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500 text-sm"
                        >
                          Twitter
                        </a>
                      )}
                      {profile.socialLinks.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500 text-sm"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Propuestas */}
            {activeTab === 'proposals' && (
              <div className="space-y-6">
                {profile.recentActivity
                  .filter(activity => activity.type === 'proposal')
                  .map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getActivityIcon(activity.type)}
                            <span className="text-sm font-medium text-gray-500">
                              {getActivityLabel(activity.type)}
                            </span>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{activity.title}</h4>
                          <p className="text-gray-600 mb-4">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {activity.stats && (
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              {activity.stats.views}
                            </span>
                            <span className="flex items-center">
                              <HeartIcon className="h-4 w-4 mr-1" />
                              {activity.stats.reactions}
                            </span>
                            <span className="flex items-center">
                              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                              {activity.stats.comments}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                
                {profile.stats.proposals > 3 && (
                  <div className="text-center">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Ver todas las propuestas ({profile.stats.proposals})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Proyectos */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {profile.recentActivity
                  .filter(activity => activity.type === 'project')
                  .map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getActivityIcon(activity.type)}
                            <span className="text-sm font-medium text-gray-500">
                              {getActivityLabel(activity.type)}
                            </span>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{activity.title}</h4>
                          <p className="text-gray-600 mb-4">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {activity.stats && (
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              {activity.stats.views}
                            </span>
                            <span className="flex items-center">
                              <HandThumbUpIcon className="h-4 w-4 mr-1" />
                              {activity.stats.reactions}
                            </span>
                            <span className="flex items-center">
                              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                              {activity.stats.comments}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                
                {profile.stats.projects > 2 && (
                  <div className="text-center">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Ver todos los proyectos ({profile.stats.projects})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Actividad Reciente */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                {profile.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {getActivityLabel(activity.type)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      {activity.stats && (
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          {activity.stats.views && (
                            <span className="flex items-center">
                              <EyeIcon className="h-3 w-3 mr-1" />
                              {activity.stats.views} vistas
                            </span>
                          )}
                          {activity.stats.reactions && (
                            <span className="flex items-center">
                              <HeartIcon className="h-3 w-3 mr-1" />
                              {activity.stats.reactions} reacciones
                            </span>
                          )}
                          {activity.stats.comments && (
                            <span className="flex items-center">
                              <ChatBubbleLeftIcon className="h-3 w-3 mr-1" />
                              {activity.stats.comments} comentarios
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}