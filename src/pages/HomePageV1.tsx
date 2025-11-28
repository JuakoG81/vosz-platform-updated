// Home Page V1 - VOSZ Platform UI V1 - RESTRUCTURADO + FASE 3.2
import { MainLayoutV1 } from '../components/v1/MainLayoutV1'
import { HeroSection } from '../components/v1/HeroSection'
import { CommunityHeader } from '../components/community/CommunityHeader'
import { MetricsCards } from '../components/v1/MetricsCards'
import { MissionProgress } from '../components/v1/MissionProgress'
import { CommunitySelector } from '../components/v1/CommunitySelector'
import { FeaturedSection } from '../components/v1/FeaturedSection'
import { AnteproyectosSection } from '../components/v1/AnteproyectosSection'
import { ProyectosSection } from '../components/v1/ProyectosSection'
import { useTranslation } from '../i18n'

export function HomePageV1() {
  const { t } = useTranslation()
  
  return (
    <MainLayoutV1>
      {/* Hero Section - Nueva estructura */}
      <HeroSection />

      {/* CommunityHeader - Datos contextuales dinámicos por nivel */}
      <CommunityHeader />

      {/* Gamificación Cards - Nueva estructura */}
      <MetricsCards />

      {/* Progreso de Misiones y Logros Recientes */}
      <MissionProgress />

      {/* Selector de Comunidades + Métricas */}
      <CommunitySelector />

      {/* Sección "1. Destacados" */}
      <FeaturedSection />

      {/* Sección "2. Anteproyectos" */}
      <AnteproyectosSection />

      {/* Nueva Sección "3. Proyectos - Desarrollo y Cierre" */}
      <ProyectosSection />
    </MainLayoutV1>
  )
}