import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTutorials } from '@/hooks/useTutorials'
import { useShepherdTour } from '@/hooks/useShepherdTour'
import { 
  AcademicCapIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  BookOpenIcon,
  LightBulbIcon,
  TrophyIcon,
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline'

interface Tutorial {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // en minutos
  steps: TutorialStep[]
  prerequisites?: string[]
  tags: string[]
  rating: number
  completions: number
  isCompleted?: boolean
  isStarted?: boolean
  progress?: number
  author: {
    id: string
    name: string
    avatar?: string
  }
}

interface TutorialStep {
  id: string
  title: string
  content: string
  type: 'text' | 'video' | 'interactive' | 'quiz'
  videoUrl?: string
  interactiveElement?: string
  quiz?: {
    question: string
    options: string[]
    correctAnswer: number
  }
}

interface TutorialCategory {
  id: string
  name: string
  description: string
  icon: any
  tutorialsCount: number
  color: string
}

export const TutorialsPage: React.FC = () => {
  const { user } = useAuth()
  const { tutorials, loading, getTutorials, updateProgress } = useTutorials()
  const { startTour, tours } = useShepherdTour()
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const categories: TutorialCategory[] = [
    {
      id: 'getting-started',
      name: 'Primeros Pasos',
      description: 'Tutoriales básicos para comenzar',
      icon: AcademicCapIcon,
      tutorialsCount: 5,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'proposals',
      name: 'Propuestas',
      description: 'Cómo crear y gestionar propuestas',
      icon: BookOpenIcon,
      tutorialsCount: 8,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'projects',
      name: 'Proyectos',
      description: 'Administración de proyectos',
      icon: TrophyIcon,
      tutorialsCount: 6,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'community',
      name: 'Comunidad',
      description: 'Interacción y colaboración',
      icon: UserGroupIcon,
      tutorialsCount: 4,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'advanced',
      name: 'Avanzado',
      description: 'Funciones avanzadas',
      icon: LightBulbIcon,
      tutorialsCount: 3,
      color: 'bg-red-100 text-red-800'
    }
  ]

  useEffect(() => {
    // Simulación de datos de tutoriales
    const mockTutorials: Tutorial[] = [
      {
        id: 'tutorial_1',
        title: 'Bienvenido a VOSZ Platform',
        description: 'Introducción completa a la plataforma y sus funcionalidades principales.',
        category: 'getting-started',
        difficulty: 'beginner',
        duration: 15,
        steps: [
          {
            id: 'step_1',
            title: 'Bienvenido',
            content: 'Te damos la bienvenida a VOSZ Platform. Este tutorial te ayudará a familiarizarte con todas las funcionalidades disponibles.',
            type: 'text'
          },
          {
            id: 'step_2',
            title: 'Navegación básica',
            content: 'Aprende cómo navegar por la plataforma usando el menú principal y la barra de búsqueda.',
            type: 'interactive',
            interactiveElement: 'main-navigation'
          },
          {
            id: 'step_3',
            title: 'Tu perfil',
            content: 'Configura tu perfil personal y ajusta tus preferencias de usuario.',
            type: 'interactive',
            interactiveElement: 'user-profile'
          },
          {
            id: 'step_4',
            title: 'Primera propuesta',
            content: 'Crea tu primera propuesta siguiendo estos sencillos pasos.',
            type: 'interactive',
            interactiveElement: 'create-proposal-button'
          }
        ],
        tags: ['introducción', 'básico', 'navegación'],
        rating: 4.8,
        completions: 1247,
        isCompleted: false,
        isStarted: true,
        progress: 50,
        author: {
          id: 'admin_1',
          name: 'Equipo VOSZ',
          avatar: '/avatars/vosz-team.jpg'
        }
      },
      {
        id: 'tutorial_2',
        title: 'Crear una propuesta efectiva',
        description: 'Aprende a redactar propuestas que generen impacto y consigan apoyo de la comunidad.',
        category: 'proposals',
        difficulty: 'intermediate',
        duration: 25,
        steps: [
          {
            id: 'step_1',
            title: 'Estructura de una propuesta',
            content: 'Una buena propuesta debe tener una estructura clara: título descriptivo, descripción detallada y ubicación específica.',
            type: 'text'
          },
          {
            id: 'step_2',
            title: 'Redacción del título',
            content: 'El título debe ser claro, específico y atractivo. Evita títulos muy largos o genéricos.',
            type: 'text'
          },
          {
            id: 'step_3',
            title: 'Descripción detallada',
            content: 'Explica el problema que resuelve tu propuesta y cómo lo solucionará. Incluye beneficios concretos.',
            type: 'text'
          },
          {
            id: 'step_4',
            title: 'Quiz: Mejores prácticas',
            content: 'Pon a prueba tus conocimientos con este quiz rápido.',
            type: 'quiz',
            quiz: {
              question: '¿Cuál es la longitud ideal para el título de una propuesta?',
              options: ['10-15 palabras', '5-10 palabras', '20-25 palabras', 'No importa la longitud'],
              correctAnswer: 1
            }
          }
        ],
        prerequisites: ['tutorial_1'],
        tags: ['propuestas', 'redacción', 'efectividad'],
        rating: 4.9,
        completions: 892,
        isCompleted: false,
        isStarted: false,
        progress: 0,
        author: {
          id: 'expert_1',
          name: 'María González',
          avatar: '/avatars/maria.jpg'
        }
      },
      {
        id: 'tutorial_3',
        title: 'Gestión avanzada de proyectos',
        description: 'Domina las herramientas avanzadas para gestionar proyectos complejos y equipos grandes.',
        category: 'projects',
        difficulty: 'advanced',
        duration: 45,
        steps: [
          {
            id: 'step_1',
            title: 'Planificación estratégica',
            content: 'Aprende a crear un plan de proyecto sólido con objetivos claros y métricas definidas.',
            type: 'text'
          },
          {
            id: 'step_2',
            title: 'Gestión de recursos',
            content: 'Optimiza el uso de recursos humanos, financieros y materiales.',
            type: 'video',
            videoUrl: '/videos/project-management.mp4'
          },
          {
            id: 'step_3',
            title: 'Comunicación del equipo',
            content: 'Establece canales de comunicación efectivos y protocolos de reporte.',
            type: 'interactive',
            interactiveElement: 'project-communication'
          }
        ],
        prerequisites: ['tutorial_1', 'tutorial_2'],
        tags: ['proyectos', 'gestión', 'avanzado'],
        rating: 4.7,
        completions: 234,
        isCompleted: false,
        isStarted: false,
        progress: 0,
        author: {
          id: 'expert_2',
          name: 'Carlos Ruiz',
          avatar: '/avatars/carlos.jpg'
        }
      },
      {
        id: 'tutorial_4',
        title: 'Fortalecimiento de la comunidad',
        description: 'Estrategias para construir y mantener una comunidad activa y comprometida.',
        category: 'community',
        difficulty: 'intermediate',
        duration: 30,
        steps: [
          {
            id: 'step_1',
            title: 'Construcción de relaciones',
            content: 'Aprende a conectar con otros usuarios y construir relaciones duraderas.',
            type: 'text'
          },
          {
            id: 'step_2',
            title: 'Facilitación de discusiones',
            content: 'Técnicas para moderar discusiones constructivas y resolver conflictos.',
            type: 'text'
          },
          {
            id: 'step_3',
            title: 'Organización de eventos',
            content: 'Planifica y ejecuta eventos comunitarios exitosos.',
            type: 'interactive',
            interactiveElement: 'event-organization'
          }
        ],
        tags: ['comunidad', 'relaciones', 'eventos'],
        rating: 4.6,
        completions: 567,
        isCompleted: false,
        isStarted: false,
        progress: 0,
        author: {
          id: 'expert_3',
          name: 'Ana Fernández',
          avatar: '/avatars/ana.jpg'
        }
      }
    ]
    
    getTutorials(mockTutorials)
  }, [])

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty
    const matchesSearch = searchQuery === '' || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const startTutorial = (tutorial: Tutorial) => {
    setActiveTutorial(tutorial)
    setCurrentStep(0)
    setCompletedSteps(new Set())
    
    // Iniciar tour interactivo con Shepherd.js
    if (tutorial.steps.some(step => step.type === 'interactive')) {
      startTour('tutorial_' + tutorial.id, {
        defaultStepOptions: {
          cancelIcon: {
            enabled: true
          },
          scrollTo: {
            behavior: 'smooth',
            block: 'center'
          }
        }
      })
    }
  }

  const completeStep = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
    
    if (activeTutorial) {
      const progress = ((completedSteps.size + 1) / activeTutorial.steps.length) * 100
      updateProgress(activeTutorial.id, progress)
    }
  }

  const nextStep = () => {
    if (activeTutorial && currentStep < activeTutorial.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Principiante'
      case 'intermediate':
        return 'Intermedio'
      case 'advanced':
        return 'Avanzado'
      default:
        return difficulty
    }
  }

  const formatDuration = (minutes: number) => {
    return `${minutes} min`
  }

  const TutorialPlayer = ({ tutorial }: { tutorial: Tutorial }) => {
    const step = tutorial.steps[currentStep]
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header del tutorial */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{tutorial.title}</h2>
            <button
              onClick={() => setActiveTutorial(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
              {getDifficultyLabel(tutorial.difficulty)}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {formatDuration(tutorial.duration)}
            </span>
            <span className="text-sm text-gray-500">
              Paso {currentStep + 1} de {tutorial.steps.length}
            </span>
          </div>
        </div>

        {/* Contenido del paso */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{step.title}</h3>
            
            {step.type === 'text' && (
              <div className="prose max-w-none text-gray-700">
                <p>{step.content}</p>
              </div>
            )}
            
            {step.type === 'video' && step.videoUrl && (
              <div className="aspect-w-16 aspect-h-9">
                <video
                  controls
                  className="w-full h-full rounded-lg"
                  src={step.videoUrl}
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
            )}
            
            {step.type === 'interactive' && (
              <div className="text-gray-700">
                <p>{step.content}</p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Interactivo:</strong> Busca el elemento "{step.interactiveElement}" en la página y interactsúa con él para continuar.
                  </p>
                </div>
              </div>
            )}
            
            {step.type === 'quiz' && step.quiz && (
              <div className="space-y-4">
                <p className="text-gray-700">{step.content}</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{step.quiz.question}</h4>
                  <div className="space-y-2">
                    {step.quiz.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`quiz-${step.id}`}
                          value={index}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between">
            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              Anterior
            </button>

            <div className="flex items-center space-x-2">
              {tutorial.steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep || completedSteps.has(tutorial.steps[index].id)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => completeStep(step.id)}
              disabled={completedSteps.has(step.id)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {completedSteps.has(step.id) ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Completado
                </>
              ) : currentStep === tutorial.steps.length - 1 ? (
                'Finalizar Tutorial'
              ) : (
                <>
                  Siguiente
                  <ChevronRightIcon className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando tutoriales...</p>
        </div>
      </div>
    )
  }

  if (activeTutorial) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TutorialPlayer tutorial={activeTutorial} />
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
              <h1 className="text-3xl font-bold text-gray-900">Tutoriales</h1>
              <p className="mt-2 text-gray-600">
                Aprende a usar VOSZ Platform con nuestros tutoriales interactivos
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <AcademicCapIcon className="h-5 w-5" />
              <span>{tutorials.length} tutoriales disponibles</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div>
              <input
                type="text"
                placeholder="Buscar tutoriales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por categoría */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Filtro por dificultad */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las dificultades</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>

            {/* Estado del tutorial */}
            <div>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="completed">Completados</option>
                <option value="in-progress">En progreso</option>
                <option value="not-started">No iniciados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categorías destacadas */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? 'all' : category.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-full ${category.color} mb-3`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{category.tutorialsCount} tutoriales</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de tutoriales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <div key={tutorial.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header de la tarjeta */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                    {getDifficultyLabel(tutorial.difficulty)}
                  </span>
                  {tutorial.isCompleted && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tutorial.description}</p>

                {/* Metadatos */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {formatDuration(tutorial.duration)}
                  </span>
                  <span className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    {tutorial.rating}
                  </span>
                  <span className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {tutorial.completions}
                  </span>
                </div>

                {/* Progreso */}
                {tutorial.progress !== undefined && tutorial.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{tutorial.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${tutorial.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Autor */}
                <div className="flex items-center space-x-2 mb-4">
                  {tutorial.author.avatar ? (
                    <img
                      src={tutorial.author.avatar}
                      alt={tutorial.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {tutorial.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-600">{tutorial.author.name}</span>
                </div>

                {/* Etiquetas */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {tutorial.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {tutorial.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{tutorial.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => startTutorial(tutorial)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  {tutorial.isStarted && tutorial.progress && tutorial.progress < 100 
                    ? 'Continuar Tutorial' 
                    : 'Iniciar Tutorial'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No hay resultados */}
        {filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron tutoriales</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  )
}