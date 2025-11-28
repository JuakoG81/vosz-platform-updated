import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProjects } from '@/hooks/useProjects'
import { 
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

interface ProjectMetrics {
  total: number
  active: number
  completed: number
  paused: number
  delayed: number
  budget: {
    allocated: number
    spent: number
    remaining: number
  }
  progress: {
    overall: number
    byPhase: {
      planning: number
      development: number
      testing: number
      implementation: number
    }
  }
  stakeholders: {
    contributors: number
    beneficiaries: number
    investors: number
  }
}

interface RecentProject {
  id: string
  title: string
  status: 'planning' | 'active' | 'testing' | 'completed' | 'paused' | 'cancelled'
  progress: number
  dueDate: string
  category: string
  budget: number
  contributors: number
  location: string
}

export const ProjectDashboard: React.FC = () => {
  const { user } = useAuth()
  const { projects, loading } = useProjects()
  
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null)
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  useEffect(() => {
    // Simulación de métricas del dashboard
    const mockMetrics: ProjectMetrics = {
      total: 12,
      active: 5,
      completed: 4,
      paused: 2,
      delayed: 1,
      budget: {
        allocated: 2500000,
        spent: 1875000,
        remaining: 625000
      },
      progress: {
        overall: 78,
        byPhase: {
          planning: 85,
          development: 72,
          testing: 65,
          implementation: 90
        }
      },
      stakeholders: {
        contributors: 89,
        beneficiaries: 15420,
        investors: 23
      }
    }

    const mockRecentProjects: RecentProject[] = [
      {
        id: 'proj_1',
        title: 'Renovación del Parque Central',
        status: 'active',
        progress: 65,
        dueDate: '2024-04-15T00:00:00Z',
        category: 'Espacios Verdes',
        budget: 450000,
        contributors: 12,
        location: 'Parque Central'
      },
      {
        id: 'proj_2',
        title: 'Sistema de Transporte Inteligente',
        status: 'planning',
        progress: 25,
        dueDate: '2024-06-30T00:00:00Z',
        category: 'Transporte',
        budget: 1200000,
        contributors: 18,
        location: 'Zona Norte'
      },
      {
        id: 'proj_3',
        title: 'Centro de Tecnología Comunitaria',
        status: 'testing',
        progress: 90,
        dueDate: '2024-03-01T00:00:00Z',
        category: 'Educación',
        budget: 280000,
        contributors: 8,
        location: 'Barrio Sur'
      },
      {
        id: 'proj_4',
        title: 'Mejoras en Transporte Público',
        status: 'completed',
        progress: 100,
        dueDate: '2024-01-30T00:00:00Z',
        category: 'Transporte',
        budget: 750000,
        contributors: 15,
        location: 'Centro'
      }
    ]

    setMetrics(mockMetrics)
    setRecentProjects(mockRecentProjects)
  }, [])

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

  const calculateBudgetUsage = () => {
    if (!metrics) return 0
    return (metrics.budget.spent / metrics.budget.allocated) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Proyectos</h1>
              <p className="mt-2 text-gray-600">
                Resumen general de todos los proyectos en curso
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
                <option value="year">Este año</option>
              </select>
              <Link
                to="/projects/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Nuevo Proyecto
              </Link>
            </div>
          </div>
        </div>

        {metrics && (
          <>
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Proyectos</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">+2</span>
                  <span className="text-gray-500 ml-1">este mes</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Proyectos Activos</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.active}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-blue-600 font-medium">{Math.round((metrics.active / metrics.total) * 100)}%</span>
                  <span className="text-gray-500 ml-1">del total</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Contribuyentes</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.stakeholders.contributors}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">+12</span>
                  <span className="text-gray-500 ml-1">nuevos</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Presupuesto</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.budget.remaining)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-orange-600 font-medium">{Math.round(calculateBudgetUsage())}%</span>
                  <span className="text-gray-500 ml-1">usado</span>
                </div>
              </div>
            </div>

            {/* Estado de proyectos y presupuesto */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Estado de proyectos */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Estado de Proyectos</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Activos</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{metrics.active}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Completados</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{metrics.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Pausados</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{metrics.paused}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Retrasados</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{metrics.delayed}</span>
                  </div>
                </div>
              </div>

              {/* Resumen financiero */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Resumen Financiero</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Presupuesto Asignado</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(metrics.budget.allocated)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Gastado</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(metrics.budget.spent)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${calculateBudgetUsage()}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Restante</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(metrics.budget.remaining)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progreso por fase */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Progreso por Fase</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{metrics.progress.byPhase.planning}%</div>
                  <div className="text-sm font-medium text-gray-700">Planificación</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">{metrics.progress.byPhase.development}%</div>
                  <div className="text-sm font-medium text-gray-700">Desarrollo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">{metrics.progress.byPhase.testing}%</div>
                  <div className="text-sm font-medium text-gray-700">Pruebas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">{metrics.progress.byPhase.implementation}%</div>
                  <div className="text-sm font-medium text-gray-700">Implementación</div>
                </div>
              </div>
            </div>

            {/* Proyectos recientes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Proyectos Recientes</h3>
                  <Link
                    to="/projects"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1">{getStatusLabel(project.status)}</span>
                          </span>
                          <span className="text-sm text-gray-500">{project.category}</span>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-1">
                          <Link 
                            to={`/projects/${project.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {project.title}
                          </Link>
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {project.location}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(project.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-1" />
                            {project.contributors} contribuidores
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 ml-6">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{project.progress}%</div>
                          <div className="text-xs text-gray-500">Completado</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(project.budget)}</div>
                          <div className="text-xs text-gray-500">Presupuesto</div>
                        </div>
                        <div className="w-20">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}