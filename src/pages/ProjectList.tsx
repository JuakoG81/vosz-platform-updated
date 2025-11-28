import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProjects } from '@/hooks/useProjects'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

interface Project {
  id: string
  title: string
  description: string
  category: string
  status: 'planning' | 'active' | 'testing' | 'completed' | 'paused' | 'cancelled'
  progress: number
  budget: number
  location: {
    address: string
    coordinates: [number, number]
  }
  startDate: string
  endDate: string
  contributors: number
  supporters: number
  tags: string[]
  thumbnail?: string
  community?: {
    id: string
    name: string
    type: 'city' | 'province' | 'neighborhood' | 'country'
  }
}

export const ProjectList: React.FC = () => {
  const { user } = useAuth()
  const { projects, loading } = useProjects()
  
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'progress'>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Simulación de proyectos
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: 'proj_1',
        title: 'Renovación del Parque Central',
        description: 'Proyecto integral para la renovación y modernización del parque central de la ciudad.',
        category: 'Espacios Verdes',
        status: 'active',
        progress: 65,
        budget: 450000,
        location: {
          address: 'Parque Central, Ciudad',
          coordinates: [-34.6037, -58.3816]
        },
        startDate: '2023-11-01T00:00:00Z',
        endDate: '2024-04-15T00:00:00Z',
        contributors: 12,
        supporters: 89,
        tags: ['Parque', 'Familias', 'Deporte'],
        thumbnail: '/images/project-park.jpg',
        community: {
          id: 'city_1',
          name: 'Buenos Aires',
          type: 'city'
        }
      },
      {
        id: 'proj_2',
        title: 'Sistema de Transporte Inteligente',
        description: 'Implementación de una red de buses eléctricos con tecnología inteligente.',
        category: 'Transporte',
        status: 'planning',
        progress: 25,
        budget: 1200000,
        location: {
          address: 'Zona Norte, Ciudad',
          coordinates: [-34.5923, -58.3775]
        },
        startDate: '2024-02-01T00:00:00Z',
        endDate: '2024-12-31T00:00:00Z',
        contributors: 18,
        supporters: 156,
        tags: ['Transporte', 'Sustentable', 'Tecnología'],
        thumbnail: '/images/project-transport.jpg',
        community: {
          id: 'city_1',
          name: 'Buenos Aires',
          type: 'city'
        }
      },
      {
        id: 'proj_3',
        title: 'Centro de Tecnología Comunitaria',
        description: 'Creación de un espacio donde los ciudadanos puedan acceder a tecnología e internet.',
        category: 'Educación',
        status: 'testing',
        progress: 90,
        budget: 280000,
        location: {
          address: 'Barrio Sur, Ciudad',
          coordinates: [-34.6284, -58.3845]
        },
        startDate: '2023-09-01T00:00:00Z',
        endDate: '2024-03-01T00:00:00Z',
        contributors: 8,
        supporters: 67,
        tags: ['Educación', 'Tecnología', 'Inclusión'],
        thumbnail: '/images/project-tech-center.jpg',
        community: {
          id: 'neighborhood_1',
          name: 'Barrio Sur',
          type: 'neighborhood'
        }
      },
      {
        id: 'proj_4',
        title: 'Mejoras en Transporte Público',
        description: 'Actualización de estaciones y mejora en la frecuencia de los servicios.',
        category: 'Transporte',
        status: 'completed',
        progress: 100,
        budget: 750000,
        location: {
          address: 'Centro de la Ciudad',
          coordinates: [-34.6037, -58.3816]
        },
        startDate: '2023-07-01T00:00:00Z',
        endDate: '2024-01-30T00:00:00Z',
        contributors: 15,
        supporters: 203,
        tags: ['Transporte', 'Modernización'],
        thumbnail: '/images/project-public-transport.jpg',
        community: {
          id: 'city_1',
          name: 'Buenos Aires',
          type: 'city'
        }
      },
      {
        id: 'proj_5',
        title: 'Plaza de la Juventud',
        description: 'Creación de una nueva plaza enfocada en actividades para jóvenes.',
        category: 'Espacios Verdes',
        status: 'active',
        progress: 40,
        budget: 320000,
        location: {
          address: 'Zona Este, Ciudad',
          coordinates: [-34.5984, -58.3755]
        },
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-08-15T00:00:00Z',
        contributors: 9,
        supporters: 78,
        tags: ['Juventud', 'Recreativo', 'Cultura'],
        community: {
          id: 'neighborhood_2',
          name: 'Zona Este',
          type: 'neighborhood'
        }
      },
      {
        id: 'proj_6',
        title: 'Biblioteca Digital Comunitaria',
        description: 'Plataforma digital para acceso gratuito a libros y recursos educativos.',
        category: 'Educación',
        status: 'active',
        progress: 55,
        budget: 180000,
        location: {
          address: 'Ciudad Digital',
          coordinates: [-34.6100, -58.3900]
        },
        startDate: '2023-12-01T00:00:00Z',
        endDate: '2024-06-30T00:00:00Z',
        contributors: 6,
        supporters: 94,
        tags: ['Educación', 'Digital', 'Acceso libre'],
        community: {
          id: 'city_1',
          name: 'Buenos Aires',
          type: 'city'
        }
      }
    ]
    
    setFilteredProjects(mockProjects)
  }, [])

  // Filtrar y ordenar proyectos
  useEffect(() => {
    let filtered = filteredProjects

    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    // Filtro por estado
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus)
    }

    // Filtro por comunidad
    if (selectedCommunity !== 'all') {
      filtered = filtered.filter(project => project.community?.id === selectedCommunity)
    }

    // Ordenamiento
    switch (sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.supporters - a.supporters)
        break
      case 'progress':
        filtered = [...filtered].sort((a, b) => b.progress - a.progress)
        break
      case 'recent':
      default:
        filtered = [...filtered].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        break
    }

    setFilteredProjects(filtered)
  }, [searchQuery, selectedCategory, selectedStatus, selectedCommunity, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'testing':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-purple-100 text-purple-800'
      case 'paused':
        return 'bg-orange-100 text-orange-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning':
        return 'Planificación'
      case 'active':
        return 'Activo'
      case 'testing':
        return 'Pruebas'
      case 'completed':
        return 'Completado'
      case 'paused':
        return 'Pausado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <ClockIcon className="h-4 w-4" />
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'testing':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'paused':
        return <ClockIcon className="h-4 w-4" />
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const categories = ['all', 'Espacios Verdes', 'Transporte', 'Educación', 'Tecnología', 'Seguridad', 'Salud']
  const statuses = ['all', 'planning', 'active', 'testing', 'completed', 'paused', 'cancelled']
  const communities = [
    { id: 'all', name: 'Todas las comunidades' },
    { id: 'city_1', name: 'Buenos Aires' },
    { id: 'neighborhood_1', name: 'Barrio Sur' },
    { id: 'neighborhood_2', name: 'Zona Este' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
              <p className="mt-2 text-gray-600">
                Explora y descubre proyectos en desarrollo en tu comunidad
              </p>
            </div>
            <Link
              to="/projects/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Link>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Búsqueda */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro por categoría */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                {statuses.slice(1).map(status => (
                  <option key={status} value={status}>{getStatusLabel(status)}</option>
                ))}
              </select>
            </div>

            {/* Filtro por comunidad */}
            <div>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {communities.map(community => (
                  <option key={community.id} value={community.id}>{community.name}</option>
                ))}
              </select>
            </div>

            {/* Ordenamiento */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Más recientes</option>
                <option value="popular">Más populares</option>
                <option value="progress">Más avanzados</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">
              {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Vista:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 text-sm ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cuadrícula
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de proyectos */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Cargando proyectos...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No se encontraron proyectos con los filtros aplicados</p>
            <Link
              to="/projects/create"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Crear primer proyecto
            </Link>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }`}>
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Imagen del proyecto */}
                {project.thumbnail && (
                  <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full h-48'}`}>
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Estado y categoría */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1">{getStatusLabel(project.status)}</span>
                    </span>
                    <span className="text-sm text-gray-500">{project.category}</span>
                  </div>

                  {/* Título y descripción */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link 
                      to={`/projects/${project.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <p className={`text-gray-600 mb-4 ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'}`}>
                    {project.description}
                  </p>

                  {/* Ubicación y fechas */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {project.location.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Progreso */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Progreso</span>
                      <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Métricas */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-1" />
                        {project.supporters} apoyos
                      </span>
                      <span className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-1" />
                        {project.contributors} contribuidores
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(project.budget)}
                    </div>
                  </div>

                  {/* Etiquetas */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{project.tags.length - 3} más
                      </span>
                    )}
                  </div>

                  {/* Comunidad */}
                  {project.community && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        {project.community.type === 'city' && 'Ciudad'}
                        {project.community.type === 'neighborhood' && 'Barrio'}
                        {project.community.type === 'province' && 'Provincia'}
                        {project.community.type === 'country' && 'País'}: {project.community.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}