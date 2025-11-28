// Página para crear un nuevo reclamo
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useClaims } from '../hooks/useClaims'
import { useTranslation } from '../i18n'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { MainLayoutV1 } from '../components/v1/MainLayoutV1'

export function CreateClaimPage() {
  const navigate = useNavigate()
  const { create, loading, error } = useClaims()
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('general')
  const [urgency, setUrgency] = useState('medium')
  const [location, setLocation] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!title.trim()) {
      setLocalError(t('claims.errors.title_required'))
      return
    }

    if (!description.trim()) {
      setLocalError(t('claims.errors.description_required'))
      return
    }

    if (title.length < 10) {
      setLocalError(t('claims.errors.title_min_length'))
      return
    }

    if (description.length < 20) {
      setLocalError(t('claims.errors.description_min_length'))
      return
    }

    try {
      await create(
        title.trim(), 
        description.trim(), 
        category, 
        urgency, 
        location.trim() || undefined
      )
      navigate(t('navigation.claims'))
    } catch (err) {
      console.error('Error creating claim:', err)
    }
  }

  const handleCancel = () => {
    navigate(t('navigation.claims'))
  }

  return (
    <MainLayoutV1>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={handleCancel}
            className="hover:text-blue-600 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('claims.breadcrumb_claims')}
          </button>
          <span>/</span>
          <span className="text-gray-900">{t('claims.breadcrumb_create')}</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('claims.create_new_claim')}</h1>
          <p className="text-gray-600">
            {t('claims.subtitle')}
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              {t('claims.claim_details')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error messages */}
              {(error || localError) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error || localError}</p>
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('claims.claim_title')} *
                </label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('claims.claim_title_placeholder')}
                  maxLength={200}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {title.length}/200 caracteres (mínimo 10)
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('claims.claim_description_label')} *
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('claims.claim_description_placeholder')}
                  rows={8}
                  maxLength={2000}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/2000 caracteres (mínimo 20)
                </p>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('claims.claim_category_label')}
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="general">{t('claims.category_general')}</option>
                  <option value="infrastructure">{t('claims.category_infrastructure')}</option>
                  <option value="services">{t('claims.category_services')}</option>
                  <option value="security">{t('claims.category_security')}</option>
                  <option value="environment">{t('claims.category_environment')}</option>
                  <option value="other">{t('claims.category_other')}</option>
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('claims.claim_urgency_label')}
                </label>
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="low">{t('claims.urgency_low')}</option>
                  <option value="medium">{t('claims.urgency_medium')}</option>
                  <option value="high">{t('claims.urgency_high')}</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('claims.claim_location_label')}
                </label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('claims.claim_location_placeholder')}
                  maxLength={200}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {location.length}/200 caracteres (opcional)
                </p>
              </div>

              {/* Information box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  {t('claims.tips_title')}
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Sé específico con la ubicación y horarios</li>
                  <li>• Incluye detalles que ayuden a entender el problema</li>
                  <li>• Menciona si has intentado resolverlo de otras formas</li>
                  <li>• Sé respetuoso en el lenguaje</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  {t('actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !title.trim() || !description.trim()}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('claims.creating')}
                    </div>
                  ) : (
                    t('claims.create_new')
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Points information */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{t('claims.claim_points_info')}</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              {t('claims.claim_creation_points')}
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayoutV1>
  )
}