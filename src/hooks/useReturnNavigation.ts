import { useSearchParams } from 'react-router-dom'

/**
 * Hook para manejar la navegación de retorno basada en query params
 * 
 * @param defaultReturn - Ruta por defecto si no hay query param (default: '/')
 * @returns Función para navegar de vuelta
 * 
 * @example
 * // Desde Dashboard: ?from=dashboard → vuelve a '/'
 * // Desde Manuscripts: ?from=manuscripts → vuelve a '/manuscripts'
 * const navigateBack = useReturnNavigation('/manuscripts')
 * navigateBack() // Navega a la ruta correcta
 */
export const useReturnNavigation = (defaultReturn: string = '/') => {
  const [searchParams] = useSearchParams()

  // Mapeo de valores del query param 'from' a sus rutas correspondientes
  const routeMap: Record<string, string> = {
    'dashboard': '/',
    'manuscripts': '/manuscripts',
    'characters': '/characters',
    'notes': '/notes',
  }

  // Leemos el parámetro 'from' de la URL
  const from = searchParams.get('from')

  // Si hay un valor válido en el mapa, lo usamos; si no, usamos el default
  const returnTo = from && routeMap[from] ? routeMap[from] : defaultReturn

  return returnTo
}

