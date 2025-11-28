import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useProposals } from '@/hooks/useProposals'
import { useReactions } from '@/hooks/useReactions'
import { useValidation } from '@/hooks/useValidation'
import { useComments } from '@/hooks/useComments'
import { 
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ShareIcon,
  BookmarkIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon,
  ShareIcon as ShareIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid'

interface ProposalData {
  id: string
  title: string
  description: string
  category: string
  location: {
    address: string
    coordinates: [number, number]
  }
  createdAt: string
  createdBy: {
    id: string
    name: string
    avatar?: string
    verification: boolean
  }
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
  tags: string[]
  images?: string[]
  documents?: Array<{
    name: string
    url: string
    type: string
  }>
  validationStage?: 'gathering_support' | 'validation' | 'decision_pending' | 'final_decision'
  conversionToProject?: {
    isConverted: boolean
    projectId?: string
    convertedAt?: string
  }
}

export const ProposalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { proposals, loading } = useProposals()
  const { getReactions, addReaction, removeReaction } = useReactions()
  const { getValidation, addValidation } = useValidation()
  const { getComments } = useComments()
  
  const [proposal, setProposal] = useState<ProposalData | null>(null)
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | 'support' | null>(null)
  const [userValidation, setUserValidation] = useState<'support' | 'reject' | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'validations'>('overview')

  useEffect(() => {
    // Simulación de datos de propuesta
    const mockProposal: ProposalData = {
      id: 'prop_1',
      title: 'Mejora del transporte público con buses eléctricos',
      description: 'Esta propuesta busca modernizar el sistema de transporte público de nuestra ciudad mediante la implementación de una flota de buses eléctricos. Los beneficios incluyen la reducción de la contaminación atmosférica, menores costos operativos a largo plazo, y una experiencia de viaje más cómoda para los ciudadanos.\n\nAdemás, esta iniciativa contribuirá a cumplir con los objetivos de sustentabilidad ambiental establecidos en el plan de desarrollo urbano 2030, posicionando a nuestra ciudad como líder en movilidad sustentable en la región.',
      category: 'Transporte',
      location: {
        address: 'Zona Norte, Ciudad',
        coordinates: [-34.5923, -58.3775]
      },
      createdAt: '2024-01-10T14:20:00Z',
      createdBy: {
        id: 'user_1',
        name: 'María González',
        avatar: '/avatars/maria.jpg',
        verification: true
      },
      status: 'under_review',
      votes: {
        support: 89,
        reject: 15,
        total: 104
      },
      reactions: {
        like: 156,
        dislike: 23,
        support: 89,
        total: 268
      },
      comments: 47,
      views: 892,
      tags: ['Transporte', 'Sustentabilidad', 'Modernización', 'Medio ambiente'],
      images: [
        '/images/bus-electric-1.jpg',
        '/images/bus-electric-2.jpg',
        '/images/route-map.jpg'
      ],
      documents: [
        {
          name: 'Estudio de factibilidad técnica.pdf',
          url: '/documents/feasibility-study.pdf',
          type: 'application/pdf'
        },
        {
          name: 'Análisis de impacto ambiental.pdf',
          url: '/documents/environmental-impact.pdf',
          type: 'application/pdf'
        }
      ],
      validationStage: 'validation'
    }

    setProposal(mockProposal)
    
    // Simulación de interacciones del usuario
    if (user?.id === 'user_1') {
      setUserReaction('like')
      setUserValidation(null)
    } else {
      setUserReaction('support')
      setUserValidation('support')
    }
    
    setIsBookmarked(false)
  }, [id, user?.id])

  const handleReaction = async (type: 'like' | 'dislike' | 'support') => {
    if (!user) return
    
    try {
      if (userReaction === type) {
        await removeReaction(proposal!.id, type)
        setUserReaction(null)
      } else {
        await addReaction(proposal!.id, type)
        setUserReaction(type)
      }
    } catch (error) {
      console.error('Error handling reaction:', error)
    }
  }

  const handleValidation = async (type: 'support' | 'reject') => {
    if (!user) return
    
    try {
      await addValidation(proposal!.id, type)
      setUserValidation(type)
    } catch (error) {
      console.error('Error handling validation:', error)
    }
  }

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

  const getValidationStageColor = (stage: string) => {
    switch (stage) {
      case 'gathering_support':
        return 'bg-blue-100 text-blue-800'
      case 'validation':
        return 'bg-yellow-100 text-yellow-800'
      case 'decision_pending':
        return 'bg-orange-100 text-orange-800'
      case 'final_decision':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getValidationStageLabel = (stage: string) => {
    switch (stage) {
      case 'gathering_support':
        return 'Recopilando Apoyo'
      case 'validation':
        return 'En Validación'
      case 'decision_pending':
        return 'Pendiente de Decisión'
      case 'final_decision':
        return 'Decisión Final'
      default:
        return stage
    }
  }

  const getValidationProgress = () => {
    if (!proposal?.validationStage) return 0
    switch (proposal.validationStage) {
      case 'gathering_support':
        return 25
      case 'validation':
        return 50
      case 'decision_pending':
        return 75
      case 'final_decision':
        return 100
      default:
        return 0
    }
  }

  const handleShare = async () => {
    if (navigator.share && proposal) {
      try {
        await navigator.share({
          title: proposal.title,
          text: proposal.description,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando propuesta...</p>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Propuesta no encontrada</p>
          <Link
            to="/proposals"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver a propuestas
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
            to="/proposals"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver a propuestas
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
                  {getStatusLabel(proposal.status)}
                </span>
                <span className="text-sm text-gray-500">{proposal.category}</span>
                {proposal.conversionToProject?.isConverted && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Convertida a Proyecto
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{proposal.title}</h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <span className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {proposal.location.address}
                </span>
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  {proposal.views} vistas
                </span>
                <span className="flex items-center">
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                  {proposal.comments} comentarios
                </span>
              </div>

              {/* Autor */}
              <div className="flex items-center space-x-3">
                {proposal.createdBy.avatar ? (
                  <img
                    src={proposal.createdBy.avatar}
                    alt={proposal.createdBy.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">{proposal.createdBy.name}</p>
                    {proposal.createdBy.verification && (
                      <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Autor de la propuesta</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Compartir
              </button>
              <button
                onClick={handleBookmark}
                className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${
                  isBookmarked
                    ? 'border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {isBookmarked ? (
                  <BookmarkIconSolid className="h-4 w-4 mr-2" />
                ) : (
                  <BookmarkIcon className="h-4 w-4 mr-2" />
                )}
                {isBookmarked ? 'Guardado' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HandThumbUpIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Apoyos</p>
                <p className="text-2xl font-bold text-gray-900">{proposal.reactions.support}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">
                {proposal.reactions.total > 0 ? Math.round((proposal.reactions.support / proposal.reactions.total) * 100) : 0}%
              </span>
              <span className="text-gray-500 ml-1">del total</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Me Gusta</p>
                <p className="text-2xl font-bold text-gray-900">{proposal.reactions.like}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Comentarios</p>
                <p className="text-2xl font-bold text-gray-900">{proposal.comments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Vistas</p>
                <p className="text-2xl font-bold text-gray-900">{proposal.views}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Etapas de validación */}
        {proposal.validationStage && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Validación</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getValidationStageColor(proposal.validationStage)}`}>
                  {getValidationStageLabel(proposal.validationStage)}
                </span>
                <span className="text-sm text-gray-500">{getValidationProgress()}% completado</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${getValidationProgress()}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Votos a favor</span>
                  <span className="text-sm font-bold text-green-600">{proposal.votes.support}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Votos en contra</span>
                  <span className="text-sm font-bold text-red-600">{proposal.votes.reject}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs de contenido */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Descripción' },
                { key: 'comments', label: `Comentarios (${proposal.comments})` },
                { key: 'validations', label: 'Validación' }
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
            {/* Tab: Descripción */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Descripción</h3>
                  <div className="prose max-w-none text-gray-700">
                    {proposal.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Imágenes */}
                {proposal.images && proposal.images.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Imágenes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {proposal.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Documentos */}
                {proposal.documents && proposal.documents.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Documentos</h4>
                    <div className="space-y-2">
                      {proposal.documents.map((doc, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">Documento PDF</p>
                          </div>
                          <button className="text-sm text-blue-600 hover:text-blue-500">
                            Descargar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Etiquetas */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {proposal.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Comentarios */}
            {activeTab === 'comments' && (
              <div className="space-y-6">
                <div className="text-center text-gray-500 py-8">
                  <ChatBubbleLeftIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Los comentarios se cargarán aquí</p>
                </div>
              </div>
            )}

            {/* Tab: Validación */}
            {activeTab === 'validations' && (
              <div className="space-y-6">
                <div className="text-center text-gray-500 py-8">
                  <CheckCircleIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Los detalles de validación se mostrarán aquí</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleReaction('like')}
              className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                userReaction === 'like'
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <HeartIcon className={`h-5 w-5 mr-2 ${userReaction === 'like' ? 'fill-current' : ''}`} />
              Me gusta
            </button>

            <button
              onClick={() => handleReaction('support')}
              className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                userReaction === 'support'
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <HandThumbUpIcon className={`h-5 w-5 mr-2 ${userReaction === 'support' ? 'fill-current' : ''}`} />
              Apoyar propuesta
            </button>

            <button
              onClick={() => handleValidation('reject')}
              className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                userValidation === 'reject'
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <XCircleIcon className={`h-5 w-5 mr-2 ${userValidation === 'reject' ? 'fill-current' : ''}`} />
              Rechazar
            </button>
          </div>

          {user?.id === proposal.createdBy.id && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <Link
                  to={`/proposals/${proposal.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Editar Propuesta
                </Link>
                {proposal.status === 'approved' && (
                  <Link
                    to={`/projects/create?from=${proposal.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Convertir a Proyecto
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}