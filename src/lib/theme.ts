/**
 * Design Tokens para el Sistema de Theming
 * Define las variables CSS que controlan colores, espaciado, tipografía, etc.
 */

export const themeTokens = {
  light: {
    // Backgrounds
    '--background': '0 0% 100%',
    '--foreground': '222.2 84% 4.9%',
    '--card': '0 0% 100%',
    '--card-foreground': '222.2 84% 4.9%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '222.2 84% 4.9%',
    
    // Primary (Verde VOSZ)
    '--primary': '142 60% 25%',
    '--primary-foreground': '0 0% 98%',
    
    // Secondary (Azul)
    '--secondary': '210 82% 59%',
    '--secondary-foreground': '0 0% 9%',
    
    // Accent (Amarillo/Naranja)
    '--accent': '38 92% 50%',
    '--accent-foreground': '222.2 84% 4.9%',
    
    // Muted
    '--muted': '210 40% 96%',
    '--muted-foreground': '215.4 16.3% 46.9%',
    
    // Borders y Inputs
    '--border': '214.3 31.8% 91.4%',
    '--input': '214.3 31.8% 91.4%',
    '--ring': '142 60% 25%',
    
    // Estados
    '--destructive': '0 84.2% 60.2%',
    '--destructive-foreground': '210 40% 98%',
    
    // Radius
    '--radius': '0.75rem',
    
    // Layout específico
    '--sidebar-background': '0 0% 98%',
    '--sidebar-foreground': '222.2 84% 4.9%',
    '--sidebar-primary': '142 60% 25%',
    '--sidebar-primary-foreground': '0 0% 98%',
    '--sidebar-border': '214.3 31.8% 91.4%',
    
    // Navegación
    '--navbar-background': '0 0% 100%',
    '--navbar-foreground': '222.2 84% 4.9%',
    
    // Cards específicas
    '--card-hover': '210 40% 98%',
    
    // Community Selector
    '--selector-background': '0 0% 100%',
    '--selector-foreground': '222.2 84% 4.9%',
    '--selector-border': '214.3 31.8% 91.4%',
    '--selector-hover': '210 40% 96%',
  },
  dark: {
    // Backgrounds (Slate en lugar de negro puro)
    '--background': '222.2 84% 4.9%',
    '--foreground': '210 40% 98%',
    '--card': '222.2 84% 6.9%',
    '--card-foreground': '210 40% 98%',
    '--popover': '222.2 84% 4.9%',
    '--popover-foreground': '210 40% 98%',
    
    // Primary (Mantener verde VOSZ pero más brillante)
    '--primary': '142 65% 35%',
    '--primary-foreground': '222.2 84% 4.9%',
    
    // Secondary (Azul más brillante)
    '--secondary': '210 82% 65%',
    '--secondary-foreground': '222.2 84% 4.9%',
    
    // Accent (Amarillo/Naranja más vibrante)
    '--accent': '38 92% 55%',
    '--accent-foreground': '222.2 84% 4.9%',
    
    // Muted (Slate)
    '--muted': '217.2 32.6% 17.5%',
    '--muted-foreground': '215 20.2% 65.1%',
    
    // Borders y Inputs (Slate)
    '--border': '217.2 32.6% 17.5%',
    '--input': '217.2 32.6% 17.5%',
    '--ring': '142 65% 35%',
    
    // Estados
    '--destructive': '0 62.8% 30.6%',
    '--destructive-foreground': '210 40% 98%',
    
    // Radius
    '--radius': '0.75rem',
    
    // Layout específico
    '--sidebar-background': '222.2 84% 4.9%',
    '--sidebar-foreground': '210 40% 98%',
    '--sidebar-primary': '142 65% 35%',
    '--sidebar-primary-foreground': '222.2 84% 4.9%',
    '--sidebar-border': '217.2 32.6% 17.5%',
    
    // Navegación
    '--navbar-background': '222.2 84% 4.9%',
    '--navbar-foreground': '210 40% 98%',
    
    // Cards específicas
    '--card-hover': '217.2 32.6% 17.5%',
    
    // Community Selector
    '--selector-background': '222.2 84% 6.9%',
    '--selector-foreground': '210 40% 98%',
    '--selector-border': '217.2 32.6% 17.5%',
    '--selector-hover': '217.2 32.6% 17.5%',
  },
} as const;

export type Theme = keyof typeof themeTokens;