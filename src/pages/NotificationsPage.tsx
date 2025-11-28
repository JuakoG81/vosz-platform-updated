import React from 'react'
import { Card, Divider, List } from 'uiw'
import MainLayoutV1 from '@/components/layout/MainLayoutV1'
import CommunitySelector from '@/components/CommunitySelector'
import NotificationBell from '@/components/NotificationBell'

export default function NotificationsPage() {
  return (
    <MainLayoutV1>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
            <CommunitySelector />
          </div>
          <p className="text-gray-600">
            Gestiona todas tus notificaciones de la plataforma VOSZ.
          </p>
        </div>

        <NotificationBell />
        
        <Divider />
        
        <div className="mt-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Configuración de Notificaciones</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Propuestas nuevas</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span>Comentarios en mis propuestas</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span>Respuestas a mis comentarios</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span>Nuevos proyectos en mi zona</span>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex justify-between items-center">
                <span>Actualizaciones de misiones</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayoutV1>
  )
}