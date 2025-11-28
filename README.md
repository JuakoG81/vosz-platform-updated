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
- ✅ `useBadges.ts` - Sistema de badges/insignias
- ✅ `useClaims.ts` - Gestión de reclamos ciudadanos
- ✅ `useComments.ts` - Sistema de comentarios anidados
- ✅ `useLeaderboard.ts` - Rankings territoriales
- ✅ `useMissions.ts` - Sistema de misiones diarias/semanales
- ✅ `useNotifications.ts` - Notificaciones con polling automático
- ✅ `useProjects.ts` - Gestión de proyectos
- ✅ `useProposals.ts` - Gestión de propuestas ciudadanas
- ✅ `useReactions.ts` - Sistema de reacciones con emojis
- ✅ `useUserStats.ts` - Estadísticas completas del usuario
- ✅ `useValidation.ts` - Validación de propuestas (apoyo/rechazo)

## Funcionalidades Incluidas

### 🎮 Sistema de Gamificación
- **Badges/Insignias**: 5 categorías (participación, validación, proyectos, comunidad, especial)
- **Misiones**: Diarias, semanales y por logros con progreso en tiempo real
- **Leaderboard**: Rankings territoriales (global, ciudad, provincia, barrio)
- **Notificaciones**: Sistema en tiempo real con polling automático cada 30 segundos

### 💬 Sistema de Comentarios y Reacciones
- **Comentarios anidados** con respuestas de múltiples niveles
- **7 tipos de emojis**: ❤️ 😂 😮 😢 😡 👍 👎
- **Contadores en tiempo real** para cada tipo de reacción
- **Polling automático** cada 30 segundos para actualizaciones
- **Eliminación segura** con confirmación para comentarios con respuestas

### 🎨 Sistema de Temas
- **Modo claro y oscuro** con transiciones suaves
- **Detección automática** de preferencia del sistema
- **Persistencia** en localStorage
- **Tokens de diseño** personalizados para VOSZ (verde primario)

### 🔧 Servicios de Supabase
- **20+ edge functions** integradas
- **Gestión completa**: propuestas, reclamos, proyectos, comentarios
- **Sistema de validación** comunitaria
- **Estadísticas** detalladas de usuario y actividad
- **Gestión territorial** con datos geográficos
- **Sistema de reacciones** completamente funcional

### 📊 Gestión de Datos
- **UserStats**: Puntos, propuestas creadas, validaciones, historial de actividad
- **TerritorialStats**: Estadísticas por ubicación geográfica
- **ValidationSystem**: Apoyo/rechazo de propuestas con porcentajes
- **ProjectManagement**: Seguimiento de proyectos con progreso

## Características Técnicas

- **TypeScript**: Tipado estático completo con interfaces detalladas
- **React Hooks**: Gestión de estado con 12 hooks personalizados
- **Supabase**: Backend como servicio con edge functions serverless
- **Polling Automático**: Actualización de datos en tiempo real cada 30s
- **Responsive Design**: Compatible con móviles y desktop
- **Error Handling**: Manejo robusto de errores con recovery automático
- **Loading States**: Estados de carga para mejor UX

## Arquitectura del Sistema

```
src/
├── lib/
│   ├── supabase.ts      # Cliente y servicios principales
│   ├── theme.ts         # Tokens de diseño
│   └── utils.ts         # Utilidades generales
├── types/
│   └── reactions.ts     # Tipos de reacciones
├── contexts/
│   └── ThemeContext.tsx # Context de temas
└── hooks/
    ├── useAuth.ts       # Autenticación
    ├── useBadges.ts     # Sistema de badges
    ├── useClaims.ts     # Reclamos ciudadanos
    ├── useComments.ts   # Comentarios anidados
    ├── useLeaderboard.ts # Rankings territoriales
    ├── useMissions.ts   # Sistema de misiones
    ├── useNotifications.ts # Notificaciones
    ├── useProjects.ts   # Gestión de proyectos
    ├── useProposals.ts  # Propuestas ciudadanas
    ├── useReactions.ts  # Sistema de reacciones
    ├── useUserStats.ts  # Estadísticas de usuario
    └── useValidation.ts # Validación de propuestas
```

## Estado del Proyecto

✅ **Servicios principales completos**  
✅ **Sistema de gamificación completo**  
✅ **Comentarios y reacciones funcionales**  
✅ **Sistema de temas avanzado**  
✅ **Contextos y 12 hooks personalizados**  
✅ **20+ funciones de edge functions**  
✅ **Documentación completa**  

## Estadísticas del Repositorio

- **Total de archivos subidos**: 18 archivos
- **Líneas de código TypeScript**: ~2,500 líneas
- **Hooks personalizados**: 12
- **Edge functions integradas**: 20+
- **Tipos de interfaz**: 15+
- **Sistema de reacciones**: 7 emojis soportados
- **Categorías de badges**: 5 categorías
- **Tipos de misiones**: 3 tipos

---

**Repositorio activo y actualizado** con la última versión completa de los servicios del VOSZ Platform. Todos los sistemas core están implementados y funcionales.