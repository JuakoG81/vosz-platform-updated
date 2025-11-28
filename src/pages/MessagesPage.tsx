import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { ConversationList } from '@/components/messages/ConversationList'
import { MessageThread } from '@/components/messages/MessageThread'

interface Conversation {
  id: string
  participants: Array<{
    id: string
    name: string
    avatar?: string
    isOnline?: boolean
  }>
  lastMessage?: {
    id: string
    content: string
    timestamp: string
    senderId: string
  }
  unreadCount: number
  updatedAt: string
}

export const MessagesPage: React.FC = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(true)

  // Simulación de conversaciones
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participants: [
          {
            id: '2',
            name: 'María González',
            avatar: '/avatars/maria.jpg',
            isOnline: true
          },
          {
            id: user?.id || '',
            name: 'Tú',
            isOnline: true
          }
        ],
        lastMessage: {
          id: 'msg1',
          content: '¿Podrías revisar la propuesta del parque?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          senderId: '2'
        },
        unreadCount: 2,
        updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        participants: [
          {
            id: '3',
            name: 'Carlos Ruiz',
            avatar: '/avatars/carlos.jpg',
            isOnline: false
          },
          {
            id: user?.id || '',
            name: 'Tú',
            isOnline: true
          }
        ],
        lastMessage: {
          id: 'msg2',
          content: 'Gracias por la información sobre el proyecto.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          senderId: user?.id || ''
        },
        unreadCount: 0,
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      }
    ]
    
    setTimeout(() => {
      setConversations(mockConversations)
      setLoading(false)
    }, 500)
  }, [user?.id])

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesFilter = activeFilter === 'all' || conv.unreadCount > 0
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mensajes</h1>
              <p className="mt-2 text-gray-600">
                Gestiona tus conversaciones con otros usuarios
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <EnvelopeIcon className="h-5 w-5" />
              <span>{conversations.length} conversaciones</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de conversaciones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Búsqueda y filtros */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-4">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar conversaciones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activeFilter === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setActiveFilter('unread')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activeFilter === 'unread'
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    No leídas
                  </button>
                </div>
              </div>

              {/* Lista de conversaciones */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    Cargando conversaciones...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No se encontraron conversaciones
                  </div>
                ) : (
                  <ConversationList
                    conversations={filteredConversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                    currentUserId={user?.id || ''}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Hilo de mensajes */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <MessageThread
                conversationId={selectedConversation}
                currentUserId={user?.id || ''}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecciona una conversación
                </h3>
                <p className="text-gray-500">
                  Elige una conversación de la lista para comenzar a chatear
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}