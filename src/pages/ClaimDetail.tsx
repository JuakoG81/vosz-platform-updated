// Página de detalle de reclamo con sistema de comentarios completo
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Tag, MessageSquare, Share2, MoreHorizontal } from 'lucide-react'
import { supabase, DEV_USER } from '../lib/supabase'
import type { Claim } from '../lib/supabase'
import { CommentList } from '../components/gamification/CommentList'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { MainLayoutV1 } from '../components/v1/MainLayoutV1'

export function ClaimDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('ID de reclamo no proporcionado')
      setLoading(false)
      return
    }

    fetchClaim()
  }, [id])

  const fetchClaim = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      if (!data) {
        setError('Reclamo no encontrado')
        return
      }

      setClaim(data)
    } catch (err) {
      console.error('Error fetching claim:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar el reclamo')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Solicitado
          </Badge>
        )
      case 'in_progress':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            En Proceso
          </Badge>
        )
      case 'resolved':
        return (
          <Badge variant="success" className="bg-green-100 text-green-800 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Resuelto
          </Badge>
        )
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency) return null
    
    const urgencyConfig = {
      low: { variant: 'default' as const, text: 'Baja', color: 'text-gray-600' },
      medium: { variant: 'warning' as const, text: 'Media', color: 'text-yellow-600' },
      high: { variant: 'danger' as const, text: 'Alta', color: 'text-red-600' },
      critical: { variant: 'danger' as const, text: 'Crítica', color: 'text-red-800' }
    }
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.medium
    return <Badge variant={config.variant} className={config.color}>{config.text}</Badge>
  }

  const getCategoryBadge = (category?: string) => {
    if (!category) return null
    
    const categoryConfig = {
      general: 'bg-gray-100 text-gray-800',
      infrastructure: 'bg-blue-100 text-blue-800',
      services: 'bg-green-100 text-green-800',
      safety: 'bg-red-100 text-red-800',
      environment: 'bg-emerald-100 text-emerald-800',
      other: 'bg-purple-100 text-purple-800'
    }
    
    const categoryNames = {
      general: 'General',
      infrastructure: 'Infraestructura',
      services: 'Servicios',
      safety: 'Seguridad',
      environment: 'Medio Ambiente',
      other: 'Otro'
    }
    
    const className = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.general
    const name = categoryNames[category as keyof typeof categoryNames] || category
    
    return <Badge className={className}>{name}</Badge>
  }

  const handleShare = async () => {
    if (navigator.share && claim) {
      try {
        await navigator.share({
          title: `Reclamo: ${claim.title}`,
          text: claim.description,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  if (loading) {
    return (
      <MainLayoutV1>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </MainLayoutV1>
    )
  }

  if (error || !claim) {
    return (
      <MainLayoutV1>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Error al cargar el reclamo</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/reclamos')}>
              Volver a reclamos
            </Button>
          </div>
        </div>
      </MainLayoutV1>
    )
  }

  return (
    <MainLayoutV1>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/reclamos" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Reclamos
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{claim.title}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{claim.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Creador: {claim.creator_id === DEV_USER.id ? 'Tú' : claim.creator_id}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Creado: {formatDate(claim.created_at)}</span>
              </div>
              {claim.updated_at !== claim.created_at && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>Actualizado: {formatDate(claim.updated_at)}</span>
                </div>
              )}
            </div>

            {/* Metadatos del reclamo */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {getCategoryBadge(claim.category)}
              {getUrgencyBadge(claim.urgency)}
              {claim.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {claim.location}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(claim.status)}
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del reclamo */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Descripción del Reclamo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {claim.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sistema de Comentarios */}
            <CommentList
              entityType="claim"
              entityId={claim.id}
            />
          </div>

          {/* Sidebar con información adicional */}
          <div className="space-y-6">
            {/* Información rápida */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <div className="mt-1">
                    {getStatusBadge(claim.status)}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">ID:</span>
                  <div className="text-sm text-gray-900 font-mono">{claim.id}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Creador:</span>
                  <div className="text-sm text-gray-900">
                    {claim.creator_id === DEV_USER.id ? 'Tú' : claim.creator_id}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Creado:</span>
                  <div className="text-sm text-gray-900">
                    {formatDate(claim.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/crear-propuesta', { 
                    state: { 
                      from: 'claim',
                      claimId: claim.id,
                      claimTitle: claim.title
                    }
                  })}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Convertir en Propuesta
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/proyectos')}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Ver Proyectos Relacionados
                </Button>
              </CardContent>
            </Card>

            {/* Navegación rápida */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navegación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  to="/reclamos"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  ← Volver a Reclamos
                </Link>
                <Link
                  to="/propuestas"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h8v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Explorar Propuestas
                </Link>
                <Link
                  to="/proyectos"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Ver Proyectos
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayoutV1>
  )
}