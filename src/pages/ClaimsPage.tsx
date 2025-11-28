// ClaimsPage.tsx - Página principal de reclamos independiente
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MainLayoutV1 } from '../components/v1/MainLayoutV1'
import { CommunitySelector } from '../components/v1/CommunitySelector'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useClaims } from '../hooks/useClaims'
import { useTranslation } from '../i18n'
import { Plus, Search, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import type { Claim } from '../lib/supabase'

interface ClaimFilters {
  status: string
  category: string
  urgency: string
  search: string
}

export function ClaimsPage() {
  const navigate = useNavigate()
  const { getClaims, loading, error } = useClaims()
  const { t } = useTranslation()
  const [claims, setClaims] = useState<Claim[]>([])
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ClaimFilters>({
    status: 'all',
    category: 'all',
    urgency: 'all',
    search: ''
  })

  const loadClaims = async () => {
    const data = await getClaims()
    setClaims(data)
  }

  useEffect(() => {
    loadClaims()
  }, [])

  // Filtrar reclamos basado en los filtros activos
  useEffect(() => {
    let filtered = [...claims]

    // Filtro por estado
    if (filters.status !== 'all') {
      filtered = filtered.filter(claim => claim.status === filters.status)
    }

    // Filtro por categoría
    if (filters.category !== 'all') {
      filtered = filtered.filter(claim => claim.category === filters.category)
    }

    // Filtro por urgencia
    if (filters.urgency !== 'all') {
      filtered = filtered.filter(claim => claim.urgency === filters.urgency)
    }

    // Filtro por búsqueda
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(claim => 
        claim.title.toLowerCase().includes(searchTerm) ||
        claim.description.toLowerCase().includes(searchTerm) ||
        (claim.location && claim.location.toLowerCase().includes(searchTerm))
      )
    }

    setFilteredClaims(filtered)
  }, [claims, filters])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Solicitado
        </Badge>
      case 'in_progress':
        return <Badge variant="default" className="flex items-center gap-1 bg-blue-500">
          <AlertCircle className="w-3 h-3" />
          En Proceso
        </Badge>
      case 'resolved':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Resuelto
        </Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      low: { variant: 'default' as const, text: 'Baja', color: 'text-gray-600' },
      medium: { variant: 'warning' as const, text: 'Media', color: 'text-yellow-600' },
      high: { variant: 'danger' as const, text: 'Alta', color: 'text-red-600' },
      critical: { variant: 'danger' as const, text: 'Crítica', color: 'text-red-800' }
    }
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.medium
    return <Badge variant={config.variant} className={config.color}>{config.text}</Badge>
  }

  const getCategoryBadge = (category: string) => {
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

  const clearFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      urgency: 'all',
      search: ''
    })
  }

  if (loading && claims.length === 0) {
    return (
      <MainLayoutV1>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayoutV1>
    )
  }

  return (
    <MainLayoutV1>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reclamos Comunitarios</h1>
            <p className="text-muted-foreground mt-1">
              Denuncia problemas que necesitan atención en tu comunidad
            </p>
          </div>
          <Link to="/crear-reclamo">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              {t('claims.create_new')}
            </Button>
          </Link>
        </div>

        {/* CommunitySelector */}
        <CommunitySelector showMetrics={false} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-primary">{claims.length}</div>
              <div className="text-sm text-muted-foreground">{t('claims.total_claims')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-accent">
                {claims.filter(c => c.status === 'requested').length}
              </div>
              <div className="text-sm text-muted-foreground">{t('claims.requested_claims')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-secondary">
                {claims.filter(c => c.status === 'in_progress').length}
              </div>
              <div className="text-sm text-muted-foreground">{t('claims.in_progress_claims')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-green-600">
                {claims.filter(c => c.status === 'resolved').length}
              </div>
              <div className="text-sm text-muted-foreground">{t('claims.resolved_claims')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={t('claims.search_placeholder')}
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {t('actions.filter')}
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('claims.filter_status')}
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">{t('claims.filter_all_status')}</option>
                      <option value="requested">{t('claims.status_requested')}</option>
                      <option value="in_progress">{t('claims.status_in_progress')}</option>
                      <option value="resolved">{t('claims.status_resolved')}</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('claims.filter_category')}
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">{t('claims.filter_all_category')}</option>
                      <option value="infrastructure">{t('claims.category_infrastructure')}</option>
                      <option value="security">{t('claims.category_security')}</option>
                      <option value="health">{t('claims.category_health')}</option>
                      <option value="environment">{t('claims.category_environment')}</option>
                      <option value="education">{t('claims.category_education')}</option>
                      <option value="other">{t('claims.category_other')}</option>
                    </select>
                  </div>

                  {/* Urgency Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('claims.filter_urgency')}
                    </label>
                    <select
                      value={filters.urgency}
                      onChange={(e) => setFilters({...filters, urgency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">{t('claims.filter_all_urgency')}</option>
                      <option value="low">{t('claims.urgency_low')}</option>
                      <option value="medium">{t('claims.urgency_medium')}</option>
                      <option value="high">{t('claims.urgency_high')}</option>
                      <option value="critical">{t('claims.urgency_critical')}</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Claims List */}
        <div className="space-y-4">
          {filteredClaims.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {claims.length === 0 ? t('claims.no_claims') : t('claims.no_claims_found')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {claims.length === 0 
                    ? t('claims.create_first_claim')
                    : t('claims.adjust_filters')
                  }
                </p>
                {claims.length === 0 && (
                  <Link to="/crear-reclamo">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('claims.create_claim_cta')}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredClaims.map((claim) => (
              <Card key={claim.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        <Link 
                          to={`/reclamo/${claim.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {claim.title}
                        </Link>
                      </CardTitle>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getStatusBadge(claim.status)}
                        {getCategoryBadge(claim.category || 'general')}
                        {getUrgencyBadge(claim.urgency || 'medium')}
                      </div>

                      {claim.location && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {claim.location}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right text-sm text-gray-500">
                      {new Date(claim.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 line-clamp-3">
                    {claim.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Creado por: {claim.creator_id === '00000000-0000-0000-0000-000000000001' ? 'Usuario Demo' : 'Usuario'}</span>
                    </div>
                    
                    <Link to={`/reclamo/${claim.id}`}>
                      <Button variant="outline" size="sm">
                        {t('actions.view')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More (placeholder for future pagination) */}
        {filteredClaims.length > 0 && filteredClaims.length >= 10 && (
          <div className="text-center">
            <Button variant="outline">
              {t('claims.load_more')}
            </Button>
          </div>
        )}
      </div>
    </MainLayoutV1>
  )
}