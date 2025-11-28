// Pagina Home - Landing con propuestas destacadas
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { ProposalList } from '../components/ProposalList'
import { useProposals } from '../hooks/useProposals'

export function HomePage() {
  const { proposals, loading } = useProposals()

  // Mostrar solo las primeras 5 propuestas
  const featuredProposals = proposals.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Bienvenido a VOSZ
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Plataforma de participacion y validacion comunitaria.
          Crea propuestas, valida las de otros y gana puntos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/crear">
            <Button variant="primary" size="lg">
              Crear Propuesta (+3 pts)
            </Button>
          </Link>
          <Link to="/propuestas">
            <Button variant="outline" size="lg">
              Ver Todas las Propuestas
            </Button>
          </Link>
        </div>
      </div>

      {/* Como Funciona */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center py-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">1. Crea Propuestas</h3>
            <p className="text-gray-600 text-sm">
              Comparte tus ideas para mejorar tu comunidad y gana +3 puntos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">2. Valida</h3>
            <p className="text-gray-600 text-sm">
              Apoya o rechaza propuestas de otros usuarios y gana +1 punto por voto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center py-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">3. Gana Puntos</h3>
            <p className="text-gray-600 text-sm">
              Acumula puntos por tu participacion activa en la comunidad
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Propuestas Destacadas */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Propuestas Destacadas
          </h2>
          <Link to="/propuestas">
            <Button variant="ghost">
              Ver todas
            </Button>
          </Link>
        </div>
        <ProposalList proposals={featuredProposals} loading={loading} />
      </div>

      {/* Sistema de Puntos */}
      <Card>
        <CardContent className="py-6">
          <h3 className="font-bold text-lg mb-4 text-center">Sistema de Puntos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">+3</div>
              <div className="text-sm text-gray-600">Crear Propuesta</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-1">+1</div>
              <div className="text-sm text-gray-600">Validar Propuesta</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 mb-1">+2</div>
              <div className="text-sm text-gray-600">Crear Reclamo</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}