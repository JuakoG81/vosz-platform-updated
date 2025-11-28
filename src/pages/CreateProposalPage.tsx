// Pagina CreateProposal - Formulario para crear nueva propuesta
import { useNavigate } from 'react-router-dom'
import { ProposalForm } from '../components/ProposalForm'
import { useProposals } from '../hooks/useProposals'
import { MainLayoutV1 } from '../components/v1/MainLayoutV1'

export function CreateProposalPage() {
  const navigate = useNavigate()
  const { create } = useProposals()

  const handleSubmit = async (title: string, description: string) => {
    await create(title, description)
  }

  const handleSuccess = () => {
    // Redirigir a la lista de propuestas después de crear
    setTimeout(() => {
      navigate('/propuestas')
    }, 1500)
  }

  return (
    <MainLayoutV1>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Propuesta</h1>
          <p className="text-gray-600 mt-1">
            Comparte tu idea con la comunidad y gana +3 puntos
          </p>
        </div>

        <ProposalForm onSubmit={handleSubmit} onSuccess={handleSuccess} />

        {/* Consejos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">Consejos para una buena propuesta</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Se claro y conciso en tu titulo</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Explica el problema que quieres resolver</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Describe tu solucion propuesta</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Menciona el beneficio para la comunidad</span>
            </li>
          </ul>
        </div>

        {/* Reglas de Validacion */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-3">Reglas de Validacion</h3>
          <p className="text-sm text-gray-700">
            Tu propuesta necesita obtener al menos <strong>60% de apoyos</strong> para ser validada.
            La comunidad votara y determinara si tu propuesta es viable.
          </p>
        </div>
      </div>
    </MainLayoutV1>
  )
}