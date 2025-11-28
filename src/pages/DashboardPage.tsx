// Pagina DashboardPage - Panel personal del usuario
import { Dashboard } from '../components/Dashboard'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1>
        <p className="text-gray-600 mt-1">
          Revisa tus estadisticas y actividades recientes
        </p>
      </div>

      <Dashboard />
    </div>
  )
}