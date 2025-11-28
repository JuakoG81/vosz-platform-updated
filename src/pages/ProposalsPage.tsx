// Pagina Proposals - Listado completo de propuestas con filtros
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProposalList } from '../components/ProposalList'
import { CommunitySelector } from '../components/v1/CommunitySelector'
import { Button } from '../components/ui/Button'
import { useProposals } from '../hooks/useProposals'
import { MainLayoutV1 } from '../components/v1/MainLayoutV1'

export function ProposalsPage() {
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const { proposals, loading, refresh } = useProposals(filter)

  const filterButtons = [
    { label: 'Todas', value: undefined },
    { label: 'Pendientes', value: 'pending' },
    { label: 'Validadas', value: 'validated' },
    { label: 'Rechazadas', value: 'rejected' }
  ]

  return (
    <MainLayoutV1>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Propuestas</h1>
            <p className="text-muted-foreground mt-1">
              Explora y valida propuestas de la comunidad
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/reclamos"
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Ver Reclamos
            </Link>
            <Button onClick={refresh} variant="outline">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Actualizar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <Button
              key={btn.label}
              variant={filter === btn.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(btn.value)}
            >
              {btn.label}
            </Button>
          ))}
        </div>

        {/* CommunitySelector */}
        <CommunitySelector showMetrics={false} />

        {/* Lista de Propuestas */}
        <ProposalList proposals={proposals} loading={loading} />

        {/* Contador */}
        {!loading && proposals.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Mostrando {proposals.length} propuesta{proposals.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </MainLayoutV1>
  )
}