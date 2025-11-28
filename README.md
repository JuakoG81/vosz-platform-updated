# VOSZ Platform - Servicios y Utilidades

Repositorio con servicios y utilidades del VOSZ Platform, incluyendo el sistema de gamificación, comentarios con reacciones, y gestión de temas.

## Archivos Subidos ✅

### Servicios Principales (`src/lib/`)
- ✅ `supabase.ts` - Configuración y servicios de Supabase con todas las funciones de edge functions
- ✅ `theme.ts` - Sistema de temas con tokens de diseño para modo claro y oscuro
- ✅ `utils.ts` - Utilidades generales para manejo de clases CSS

### Tipos de Datos (`src/types/`)
- ✅ `reactions.ts` - Tipos del sistema de reacciones con emojis

### Contextos (`src/contexts/`)
- ✅ `ThemeContext.tsx` - Context para manejo global del tema con persistencia

### Hooks Principales (`src/hooks/`)
- ✅ `useAuth.ts` - Hook de autenticación (modo desarrollo)
- ✅ `useProposals.ts` - Gestión de propuestas ciudadanas
- ✅ `useBadges.ts` - Sistema de badges/insignias
- ✅ `useLeaderboard.ts` - Rankings territoriales
- ✅ `useComments.ts` - Sistema de comentarios anidados
- ✅ `useReactions.ts` - Sistema de reacciones con emojis
- ✅ `useNotifications.ts` - Notificaciones con polling automático
- ✅ `useMissions.ts` - Sistema de misiones diarias/semanales
- ✅ `useClaims.ts` - Gestión de reclamos ciudadanos
- ✅ `useProjects.ts` - Gestión de proyectos

## Funcionalidades Incluidas

### 🎮 Sistema de Gamificación
- Badges/insignias por categorías (participación, validación, proyectos, comunidad, especial)
- Sistema de misiones (diarias, semanales, logros)
- Leaderboard territorial (global, ciudad, provincia, barrio)
- Notificaciones en tiempo real con polling automático

### 💬 Sistema de Comentarios y Reacciones
- Comentarios anidados con respuestas
- Sistema de reacciones con 7 tipos de emojis
- Contadores en tiempo real
- Polling automático cada 30 segundos

### 🎨 Sistema de Temas
- Tema claro y oscuro
- Detección automática de preferencia del sistema
- Persistencia en localStorage
- Tokens de diseño personalizados

### 🔧 Servicios de Supabase
- 20+ edge functions integradas
- Gestión completa de propuestas, reclamos, proyectos
- Sistema de validación comunitaria
- Estadísticas de usuario
- Gestión territorial

## Características Técnicas

- **TypeScript** - Tipado estático completo
- **React Hooks** - Gestión de estado con hooks personalizados
- **Supabase** - Backend como servicio con edge functions
- **Polling Automático** - Actualización de datos en tiempo real
- **Responsive Design** - Compatible con móviles y desktop

## Estado del Proyecto

✅ **Servicios principales subidos**  
✅ **Sistema de gamificación completo**  
✅ **Comentarios y reacciones**  
✅ **Sistema de temas**  
✅ **Contextos y hooks**  

Repositorio activo y actualizado con la última versión de los servicios del VOSZ Platform.