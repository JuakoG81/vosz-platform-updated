import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useProjects } from '@/hooks/useProjects'
import { 
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  PhotoIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

interface Milestone {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  dueDate: string
  progress: number
  assignedTo: string[]
}

interface ProjectUpdate {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  attachments?: Array<{
    type: 'image' | 'document'
    url: string
    name: string
  }>
}

interface ProjectContributor {
  id: string
  name: string
  role: string
  avatar?: string
  contribution: string
  joinedAt: string
}

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { projects, loading } = useProjects()
  
  const [project, setProject] = useState<any>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [contributors, setContributors] = useState<ProjectContributor[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'updates' | 'contributors'>('overview')

  useEffect(() => {
    // Simulación de datos del proyecto
    const mockProject = {
      id: 'proj_1',
      title: 'Renovación del Parque Central',
      description: 'Proyecto integral para la renovación y modernización del parque central de la ciudad, incluyendo nuevas áreas de juegos infantiles, zonas de ejercicio, mejoras en la iluminación y espacios verdes.',
      category: 'Espacios Verdes',
      status: 'active',
      progress: 65,
      budget: {
        allocated: 450000,
        spent: 292500,
        remaining: 157500
      },
      location: {
        address: 'Parque Central, Ciudad',
        coordinates: [-34.6037, -58.3816]
      },
      startDate: '2023-11-01T00:00:00Z',
      endDate: '2024-04-15T00:00:00Z',
      createdBy: {
        id: 'user_1',
        name: 'María González'
      },
      tags: ['Parque', 'Espacios verdes', 'Familias', 'Deporte'],
      images: ['/images/park-1.jpg', '/images/park-2.jpg'],
      metrics: {
        views: 1234,
        supporters: 89,
        contributors: 12
      }
    }

    const mockMilestones: Milestone[] = [
      {
        id: 'milestone_1',
        title: 'Fase de Planificación',
        description: 'Diseño detallado y permisos',
        status: 'completed',
        dueDate: '2023-12-15T00:00:00Z',
        progress: 100,
        assignedTo: ['user_1', 'user_2']
      },
      {
        id: 'milestone_2',
        title: 'Limpieza del Área',
        description: 'Preparación del terreno existente',
        status: 'completed',
        dueDate: '2024-01-15T00:00:00Z',
        progress: 100,
        assignedTo: ['user_3', 'user_4']
      },
      {
        id: 'milestone_3',
        title: 'Construcción de Áreas de Juego',
        description: 'Instalación de juegos infantiles',
        status: 'in_progress',
        dueDate: '2024-02-28T00:00:00Z',
        progress: 75,
        assignedTo: ['user_5', 'user_6']
      },
      {
        id: 'milestone_4',
        title: 'Zonas de Ejercicio',
        description: 'Instalación de equipos de gimnasio al aire libre',
        status: 'pending',
        dueDate: '2024-03-31T00:00:00Z',
        progress: 0,
        assignedTo: ['user_7']
      },
      {
        id: 'milestone_5',
        title: 'Finalización y Entrega',
        description: 'Revisión final y apertura oficial',
        status: 'pending',
        dueDate: '2024-04-15T00:00:00Z',
        progress: 0,
        assignedTo: ['user_1']
      }
    ]

    const mockUpdates: ProjectUpdate[] = [
      {
        id: 'update_1',
        title: 'Avance en la construcción de áreas de juego',
        content: 'Se ha completado el 75% de la instalación de los nuevos juegos infantiles. Los equipos han llegado y el proceso de montaje avanza según lo planificado.',
        author: {
          id: 'user_5',
          name: 'Carlos Ruiz',
          avatar: '/avatars/carlos.jpg'
        },
        createdAt: '2024-01-25T14:30:00Z',
        attachments: [
          {
            type: 'image',
            url: '/images/construction-progress-1.jpg',
            name: 'Progreso de construcción'
          }
        ]
      },
      {
        id: 'update_2',
        title: 'Inicio de fase de construcción',
        content: 'Comenzamos oficialmente la fase de construcción después de completar exitosamente la limpieza del área. Las máquinas están funcionando y el proyecto está avanzando según cronograma.',
        author: {
          id: 'user_1',
          name: 'María González'
        },
        createdAt: '2024-01-20T10:15:00Z',
        attachments: [
          {
            type: 'image',
            url: '/images/construction-start.jpg',
            name: 'Inicio de construcción'
          },
          {
            type: 'document',
            url: '/documents/cronograma-construccion.pdf',
            name: 'Cronograma detallado'
          }
        ]
      }
    ]

    const mockContributors: ProjectContributor[] = [
      {
        id: 'user_1',
        name: 'María González',
        role: 'Coordinadora del Proyecto',
        avatar: '/avatars/maria.jpg',
        contribution: 'Coordinación general y comunicación con la comunidad',
        joinedAt: '2023-11-01T00:00:00Z'
      },
      {
        id: 'user_5',
        name: 'Luis Martínez',
        role: 'Ingeniero de Construcción',
        contribution: 'Supervisión técnica de la construcción',
        joinedAt: '2023-11-15T00:00:00Z'
      },
      {
        id: 'user_6',
        name: 'Ana Fernández',
        role: 'Diseñadora Paisajista',
        contribution: 'Diseño de áreas verdes y espacios comunes',
        joinedAt: '2023-11-10T00:00:00Z'
      },
      {
        id: 'user_7',
        name: 'Roberto Silva',
        role: 'Especialista en Equipamiento',
        contribution: 'Selección e instalación de equipos de ejercicio',
        joinedAt: '2024-01-05T00:00:00Z'
      }
    ]

    setProject(mockProject)
    setMilestones(mockMilestones)
    setUpdates(mockUpdates)
    setContributors(mockContributors)
  }, [id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'planning':
        return 'bg-blue-100 text-blue-800'
      case 'paused':
        return 'bg-orange-100 text-orange-800'
      case 'completed':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo'
      case 'planning':
        return 'Planificación'
      case 'paused':
        return 'Pausado'
      case 'completed':
        return 'Completado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-600" />
      case 'delayed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-400" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />
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

  const calculateBudgetUsage = () => {
    if (!project) return 0
    return (project.budget.spent / project.budget.allocated) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando proyecto...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Proyecto no encontrado</p>
          <Link
            to="/projects"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Volver a proyectos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con navegación */}
        <div className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver a proyectos
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
                <span className="text-sm text-gray-500">{project.category}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{project.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {project.location.address}
                </span>
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  {project.metrics.contributors} contribuidores
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ShareIcon className="h-4 w-4 mr-2" />
                Compartir
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Unirse al Proyecto
              </button>
            </div>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{project.progress}%</p>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Presupuesto Restante</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.budget.remaining)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-orange-600 font-medium">{Math.round(calculateBudgetUsage())}%</span>
              <span className="text-gray-500 ml-1">usado</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Contribuyentes</p>
                <p className="text-2xl font-bold text-gray-900">{project.metrics.contributors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Apoyos</p>
                <p className="text-2xl font-bold text-gray-900">{project.metrics.supporters}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de contenido */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Resumen', icon: DocumentTextIcon },
                { key: 'milestones', label: 'Hitos', icon: CheckCircleIcon },
                { key: 'updates', label: 'Actualizaciones', icon: ChatBubbleLeftIcon },
                { key: 'contributors', label: 'Contribuyentes', icon: UsersIcon }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Tab: Resumen */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Proyecto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Detalles Financieros</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Asignado:</span>
                          <span className="text-sm font-medium">{formatCurrency(project.budget.allocated)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Gastado:</span>
                          <span className="text-sm font-medium">{formatCurrency(project.budget.spent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Restante:</span>
                          <span className="text-sm font-medium">{formatCurrency(project.budget.remaining)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cronograma</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Inicio:</span>
                          <span className="text-sm font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Fin estimado:</span>
                          <span className="text-sm font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Duración:</span>
                          <span className="text-sm font-medium">5.5 meses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {project.images && project.images.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Imágenes del Proyecto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.images.map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Proyecto imagen ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Hitos */}
            {activeTab === 'milestones' && (
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        {getMilestoneStatusIcon(milestone.status)}
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{milestone.title}</h4>
                          <p className="text-gray-600 mt-1">{milestone.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {new Date(milestone.dueDate).toLocaleDateString()}
                            </span>
                            <span>
                              Asignado a: {milestone.assignedTo.length} persona{milestone.assignedTo.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{milestone.progress}%</div>
                        <div className="text-xs text-gray-500">Completado</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Actualizaciones */}
            {activeTab === 'updates' && (
              <div className="space-y-6">
                {updates.map((update) => (
                  <div key={update.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      {update.author.avatar ? (
                        <img
                          src={update.author.avatar}
                          alt={update.author.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {update.author.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{update.title}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(update.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{update.content}</p>
                        <div className="text-sm text-gray-500 mb-4">
                          Por {update.author.name}
                        </div>
                        {update.attachments && update.attachments.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-900">Archivos adjuntos:</h5>
                            {update.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                {attachment.type === 'image' ? (
                                  <PhotoIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-sm text-blue-600 hover:text-blue-500">
                                  {attachment.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Contribuyentes */}
            {activeTab === 'contributors' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contributors.map((contributor) => (
                  <div key={contributor.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      {contributor.avatar ? (
                        <img
                          src={contributor.avatar}
                          alt={contributor.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-700">
                            {contributor.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{contributor.name}</h4>
                        <p className="text-sm text-blue-600 mb-2">{contributor.role}</p>
                        <p className="text-gray-600 text-sm">{contributor.contribution}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Se unió: {new Date(contributor.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
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