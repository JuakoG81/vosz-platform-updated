import React, { useState, useCallback } from 'react'
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Switch,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from 'uiw'
import MainLayoutV1 from '@/components/layout/MainLayoutV1'
import CommunitySelector from '@/components/CommunitySelector'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

const { Title, Text } = Typography

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  // Estados para el formulario de perfil
  const [profileData, setProfileData] = useState({
    first_name: user?.user_metadata?.first_name || '',
    last_name: user?.user_metadata?.last_name || '',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    interests: user?.user_metadata?.interests || [],
  })
  
  // Estados para preferencias de privacidad
  const [privacySettings, setPrivacySettings] = useState({
    show_email: user?.user_metadata?.show_email || false,
    show_location: user?.user_metadata?.show_location || false,
    allow_messages: user?.user_metadata?.allow_messages || true,
    public_profile: user?.user_metadata?.public_profile || true,
  })
  
  // Estados para notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    proposal_comments: true,
    project_updates: true,
    mission_rewards: true,
    community_news: false,
  })

  const handleProfileUpdate = useCallback(async (data: typeof profileData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          bio: data.bio,
          location: data.location,
          interests: data.interests,
        }
      })
      
      if (error) throw error
      
      message.success('Perfil actualizado exitosamente')
      updateUser({ user_metadata: { ...user?.user_metadata, ...data } })
    } catch (error: any) {
      message.error(`Error al actualizar perfil: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [user, updateUser])

  const handlePrivacyUpdate = useCallback(async (data: typeof privacySettings) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          show_email: data.show_email,
          show_location: data.show_location,
          allow_messages: data.allow_messages,
          public_profile: data.public_profile,
        }
      })
      
      if (error) throw error
      
      message.success('Configuración de privacidad actualizada')
      updateUser({ user_metadata: { ...user?.user_metadata, ...data } })
    } catch (error: any) {
      message.error(`Error al actualizar privacidad: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [user, updateUser])

  const handleNotificationUpdate = useCallback(async (data: typeof notificationSettings) => {
    setLoading(true)
    try {
      // Aquí iría la lógica para guardar en la base de datos
      message.success('Configuración de notificaciones actualizada')
    } catch (error: any) {
      message.error(`Error al actualizar notificaciones: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const avatarOptions = [
    { value: 'avatar1', label: 'Avatar 1', icon: '👨‍💼' },
    { value: 'avatar2', label: 'Avatar 2', icon: '👩‍💻' },
    { value: 'avatar3', label: 'Avatar 3', icon: '🧑‍🎨' },
    { value: 'avatar4', label: 'Avatar 4', icon: '🧑‍🔬' },
    { value: 'avatar5', label: 'Avatar 5', icon: '🧑‍🏫' },
    { value: 'avatar6', label: 'Avatar 6', icon: '🧑‍⚖️' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card>
            <Title level={4}>Información Personal</Title>
            <Form
              onSubmit={({ initialValue, validateError, data }) => {
                if (Object.keys(validateError).length > 0) {
                  return message.error('Por favor complete todos los campos requeridos')
                }
                handleProfileUpdate(data as typeof profileData)
              }}
            >
              <Form.Item label="Nombre" required>
                <Input
                  name="first_name"
                  placeholder="Tu nombre"
                  defaultValue={profileData.first_name}
                />
              </Form.Item>
              <Form.Item label="Apellido" required>
                <Input
                  name="last_name"
                  placeholder="Tu apellido"
                  defaultValue={profileData.last_name}
                />
              </Form.Item>
              <Form.Item label="Biografía">
                <Input.TextArea
                  name="bio"
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                  defaultValue={profileData.bio}
                />
              </Form.Item>
              <Form.Item label="Ubicación">
                <Input
                  name="location"
                  placeholder="Tu ubicación"
                  defaultValue={profileData.location}
                />
              </Form.Item>
              <Form.Item label="Intereses">
                <Select
                  name="interests"
                  mode="multiple"
                  placeholder="Selecciona tus intereses"
                  options={[
                    { label: 'Medio Ambiente', value: 'environment' },
                    { label: 'Educación', value: 'education' },
                    { label: 'Transporte', value: 'transport' },
                    { label: 'Seguridad', value: 'safety' },
                    { label: 'Salud', value: 'health' },
                    { label: 'Cultura', value: 'culture' },
                    { label: 'Deportes', value: 'sports' },
                    { label: 'Tecnología', value: 'technology' },
                  ]}
                  defaultValue={profileData.interests}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Actualizar Perfil
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )

      case 'avatar':
        return (
          <Card>
            <Title level={4}>Avatar de Perfil</Title>
            <Text type="secondary" className="mb-4 block">
              Selecciona un avatar para tu perfil
            </Text>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {avatarOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                  onClick={() => {
                    setProfileData(prev => ({
                      ...prev,
                      avatar: option.value
                    }))
                  }}
                >
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <span className="text-sm">{option.label}</span>
                </div>
              ))}
            </div>
            <Button type="primary" loading={loading}>
              Actualizar Avatar
            </Button>
          </Card>
        )

      case 'privacy':
        return (
          <Card>
            <Title level={4}>Configuración de Privacidad</Title>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div>Mostrar email públicamente</div>
                  <Text type="secondary">Otros usuarios podrán ver tu dirección de email</Text>
                </div>
                <Switch
                  checked={privacySettings.show_email}
                  onChange={(e) => 
                    setPrivacySettings(prev => ({ ...prev, show_email: e.target.checked }))
                  }
                />
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <div>Mostrar ubicación públicamente</div>
                  <Text type="secondary">Otros usuarios podrán ver tu ubicación general</Text>
                </div>
                <Switch
                  checked={privacySettings.show_location}
                  onChange={(e) => 
                    setPrivacySettings(prev => ({ ...prev, show_location: e.target.checked }))
                  }
                />
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <div>Permitir mensajes privados</div>
                  <Text type="secondary">Otros usuarios podrán enviarte mensajes directos</Text>
                </div>
                <Switch
                  checked={privacySettings.allow_messages}
                  onChange={(e) => 
                    setPrivacySettings(prev => ({ ...prev, allow_messages: e.target.checked }))
                  }
                />
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <div>Perfil público</div>
                  <Text type="secondary">Tu perfil será visible para todos los usuarios</Text>
                </div>
                <Switch
                  checked={privacySettings.public_profile}
                  onChange={(e) => 
                    setPrivacySettings(prev => ({ ...prev, public_profile: e.target.checked }))
                  }
                />
              </div>
            </div>
            <Button 
              type="primary" 
              className="mt-6"
              loading={loading}
              onClick={() => handlePrivacyUpdate(privacySettings)}
            >
              Guardar Configuración de Privacidad
            </Button>
          </Card>
        )

      case 'notifications':
        return (
          <Card>
            <Title level={4}>Configuración de Notificaciones</Title>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div>Notificaciones por email</div>
                  <Text type="secondary">Recibir actualizaciones importantes por correo</Text>
                </div>
                <Switch
                  checked={notificationSettings.email_notifications}
                  onChange={(e) => 
                    setNotificationSettings(prev => ({ ...prev, email_notifications: e.target.checked }))
                  }
                />
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <div>Notificaciones push</div>
                  <Text type="secondary">Recibir notificaciones en tiempo real</Text>
                </div>
                <Switch
                  checked={notificationSettings.push_notifications}
                  onChange={(e) => 
                    setNotificationSettings(prev => ({ ...prev, push_notifications: e.target.checked }))
                  }
                />
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <div>Comentarios en propuestas</div>
                  <Text type="secondary">Notificar cuando alguien comente en tus propuestas</Text>
                </div>
                <Switch
                  checked={notificationSettings.proposal_comments}
                  onChange={(e) => 
                    setNotificationSettings(prev => ({ ...prev, proposal_comments: e.target.checked }))
                  }
                />
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <div>Actualizaciones de proyectos</div>
                  <Text type="secondary">Notificar sobre el progreso de proyectos de tu interés</Text>
                </div>
                <Switch
                  checked={notificationSettings.project_updates}
                  onChange={(e) => 
                    setNotificationSettings(prev => ({ ...prev, project_updates: e.target.checked }))
                  }
                />
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <div>Recompensas de misiones</div>
                  <Text type="secondary">Notificar cuando ganes insignias o puntos</Text>
                </div>
                <Switch
                  checked={notificationSettings.mission_rewards}
                  onChange={(e) => 
                    setNotificationSettings(prev => ({ ...prev, mission_rewards: e.target.checked }))
                  }
                />
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div>
                  <div>Noticias de la comunidad</div>
                  <Text type="secondary">Recibir actualizaciones generales de la plataforma</Text>
                </div>
                <Switch
                  checked={notificationSettings.community_news}
                  onChange={(e) => 
                    setNotificationSettings(prev => ({ ...prev, community_news: e.target.checked }))
                  }
                />
              </div>
            </div>
            <Button 
              type="primary" 
              className="mt-6"
              loading={loading}
              onClick={() => handleNotificationUpdate(notificationSettings)}
            >
              Guardar Configuración de Notificaciones
            </Button>
          </Card>
        )

      case 'account':
        return (
          <Card>
            <Title level={4}>Configuración de Cuenta</Title>
            <div className="space-y-6">
              <div>
                <Title level={5}>Cambiar Contraseña</Title>
                <Form
                  onSubmit={({ initialValue, validateError, data }) => {
                    if (Object.keys(validateError).length > 0) {
                      return message.error('Por favor complete todos los campos')
                    }
                    // Lógica para cambiar contraseña
                    message.success('Contraseña actualizada exitosamente')
                  }}
                >
                  <Form.Item label="Contraseña Actual">
                    <Input.Password name="current_password" placeholder="Contraseña actual" />
                  </Form.Item>
                  <Form.Item label="Nueva Contraseña">
                    <Input.Password name="new_password" placeholder="Nueva contraseña" />
                  </Form.Item>
                  <Form.Item label="Confirmar Contraseña">
                    <Input.Password name="confirm_password" placeholder="Confirmar nueva contraseña" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Actualizar Contraseña
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              
              <Divider />
              
              <div>
                <Title level={5}>Zona Peligrosa</Title>
                <Text type="danger">
                  Las siguientes acciones son irreversibles. Procede con cuidado.
                </Text>
                <div className="mt-4">
                  <Button danger>
                    Eliminar Cuenta
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )

      default:
        return null
    }
  }

  const tabs = [
    { key: 'profile', label: 'Perfil', icon: '👤' },
    { key: 'avatar', label: 'Avatar', icon: '🖼️' },
    { key: 'privacy', label: 'Privacidad', icon: '🔒' },
    { key: 'notifications', label: 'Notificaciones', icon: '🔔' },
    { key: 'account', label: 'Cuenta', icon: '⚙️' },
  ]

  return (
    <MainLayoutV1>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <CommunitySelector />
          </div>
          <p className="text-gray-600">
            Gestiona tu perfil, privacidad y preferencias de la plataforma VOSZ.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar con navegación de pestañas */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </MainLayoutV1>
  )
}