import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProposals } from '@/hooks/useProposals'
import { useReactions } from '@/hooks/useReactions'
import { 
  PlusIcon, 
  MapPinIcon, 
  CalendarIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

interface MyProposal {
  id: string
  title: string
  description: string
  category: string
  location: {
    address: string
    coordinates: [number, number]
  }
  createdAt: string
  status: 'draft' | 'published' | 'under_review' | 'approved' | 'rejected' | 'implemented'
  votes: {
    support: number
    reject: number
    total: number
  }
  reactions: {
    like: number
    dislike: number
    support: number
    total: number
  }
  comments: number
  views: number
  validationStage?: 'gathering_support' | 'validation' | 'decision_pending' | 'final_decision'
  conversionToProject?: {
    isConverted: boolean
    projectId?: string
    convertedAt?: string
  }
}

export const MyProposalsPage: React.FC = () => {
  const { user } = useAuth()
  const { proposals, loading } = useProposals()
  const { getReactions } = useReactions()
  
  const [myProposals, setMyProposals] = useState<MyProposal[]>([])
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'implemented'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'views'>('recent')

  // Simulación de datos del usuario
  useEffect(() => {
    const mockProposals: MyProposal[] = [
      {
        id: '1',
        title: 'Mejora del parque central',
        description: 'Renovación de la infraestructura del parque con áreas de juegos para niños y zonas de ejercicio.',
        category: 'Espacios Verdes',
        location: {
          address: 'Parque Central, Ciudad',
          coordinates: [-34.6037, -58.3816]
        },
        createdAt: '2024-01-15T10:30:00Z',
        status: 'published',
        votes: {
          support: 45,
          reject: 12,
          total: 57
        },
        reactions: {
          like: 38,
          dislike: 3,
          support: 42,
          total: 83
        },
        comments: 15,
        views: 234,
        validationStage: 'validation'
      },
      {
        id: '2',
        title: 'Nuevo sistema de transporte público',
        description: 'Implementación de una línea de buses eléctricos con paradas inteligentes.',
        category: 'Transporte',
        location: {
          address: 'Zona Norte, Ciudad',
          coordinates: [-34.5923, -58.3775]
        },
        createdAt: '2024-01-10T14:20:00Z',
        status: 'implemented',
        votes: {
          support: 89,
          reject: 5,
          total: 94
        },
        reactions: {
          like: 76,
          dislike: 2,
          support: 81,
          total: 159
        },
        comments: 28,
        views: 567,
        conversionToProject: {
          isConverted: true,
          projectId: 'proj_1',
          convertedAt: '2024-02-15T09:00:00Z'
        }
      },
      {
        id: '3',
        title: 'Centro comunitario de tecnología',
        description: 'Creación de un espacio donde los ciudadanos puedan acceder a computadoras e internet.',
        category: 'Educación',
        location: {
          address: 'Barrio Sur, Ciudad',
          coordinates: [-34.6284, -58.3845]
        },
        createdAt: '2024-01-12T16:45:00Z',
        status: 'draft',
        votes: {
          support: 0,
          reject: 0,
          total: 0
        },
        reactions: {
          like: 5,
          dislike: 0,
          support: 7,
          total: 12
        },
        comments: 2,
        views: 45
      }
    ]
    
    setMyProposals(mockProposals)
  }, [])

  const filteredProposals = myProposals.filter(proposal => {
    if (filter === 'all') return true
    return proposal.status === filter
  })

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.reactions.total - a.reactions.total
      case 'views':
        return b.views - a.views
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'published':
        return 'bg-blue-100 text-blue-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'implemented':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Borrador'
      case 'published':
        return 'Publicada'
      case 'under_review':
        return 'En Revisión'
      case 'approved':
        return 'Aprobada'
      case 'rejected':
        return 'Rechazada'
      case 'implemented':
        return 'Implementada'
      default:
        return status
    }
  }

  const stats = {
    total: myProposals.length,
    published: myProposals.filter(p => p.status === 'published').length,
    implemented: myProposals.filter(p => p.status === 'implemented').length,
    totalSupport: myProposals.reduce((acc, p) => acc + p.votes.support, 0),
    totalViews: myProposals.reduce((acc, p) => acc + p.views, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Propuestas</h1>
              <p className="mt-2 text-gray-600">
                Gestiona y rastrea el progreso de tus propuestas
              </p>
            </div>
            <Link
              to="/proposals/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Propuesta
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Publicadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Implementadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.implemented}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HandThumbUpIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Soportes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSupport}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Vistas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y ordenamiento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  filter === 'draft'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Borradores
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  filter === 'published'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Publicadas
              </button>
              <button
                onClick={() => setFilter('implemented')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  filter === 'implemented'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Implementadas
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'views')}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Más recientes</option>
                <option value="popular">Más populares</option>
                <option value="views">Más vistas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de propuestas */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Cargando propuestas...</p>
            </div>
          ) : sortedProposals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No tienes propuestas en esta categoría</p>
              <Link
                to="/proposals/create"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Crear primera propuesta
              </Link>
            </div>
          ) : (
            sortedProposals.map((proposal) => (
              <div key={proposal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {getStatusLabel(proposal.status)}
                        </span>
                        {proposal.conversionToProject?.isConverted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Convertida a Proyecto
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link 
                          to={`/proposals/${proposal.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {proposal.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{proposal.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {proposal.location.address}
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-1">
                        <HandThumbUpIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">{proposal.votes.support}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChatBubbleLeftIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{proposal.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{proposal.views}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/proposals/${proposal.id}`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Ver Detalles
                      </Link>
                      {proposal.status === 'draft' && (
                        <Link
                          to={`/proposals/${proposal.id}/edit`}
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Editar
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}