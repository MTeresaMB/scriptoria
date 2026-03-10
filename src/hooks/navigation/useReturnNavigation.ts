import { useSearchParams } from 'react-router-dom'

export const useReturnNavigation = (defaultReturn: string = '/') => {
  const [searchParams] = useSearchParams()

  const routeMap: Record<string, string> = {
    'dashboard': '/',
    'manuscripts': '/manuscripts',
    'characters': '/characters',
    'notes': '/notes',
  }

  const from = searchParams.get('from')
  const returnTo = from && routeMap[from] ? routeMap[from] : defaultReturn

  return returnTo
}

