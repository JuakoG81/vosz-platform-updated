import React from 'react'
import { Button, Card, Divider, List, Progress, Statistic, StatisticGroup, Tag, Title } from 'uiw'
import MainLayoutV1 from '@/components/layout/MainLayoutV1'
import CommunitySelector from '@/components/CommunitySelector'
import { useBadges } from '@/hooks/useBadges'
import { CardType } from 'uiw'

export default function BadgesPage() {
  const { badgesByCategory, loading, error } = useBadges()

  if (loading) return <div className="p-4">Cargando insignias...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  const categories = Object.keys(badgesByCategory || {})

  return (
    <MainLayoutV1>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Mis Insignias</h1>
            <CommunitySelector />
          </div>
          <p className="text-gray-600">
            Descubre todas las insignias disponibles en la plataforma VOSZ.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay insignias disponibles en este momento.</p>
          </div>
        ) : (
          categories.map(category => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badgesByCategory[category].map(badge => (
                  <Card key={badge.id} className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{badge.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{badge.description}</p>
                        <div className="mb-2">
                          <Progress 
                            percent={badge.progress} 
                            strokeColor="#3b82f6"
                            size="small"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <Tag color="blue">{badge.progress}% completado</Tag>
                          {badge.unlocked_at && (
                            <Tag color="green">Desbloqueada</Tag>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {categories.indexOf(category) < categories.length - 1 && (
                <Divider />
              )}
            </div>
          ))}
        )}
      </div>
    </MainLayoutV1>
  )
}