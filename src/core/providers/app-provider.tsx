import { createContext, useContext, useEffect } from 'react'
import { useStore } from '@/core/providers/store-provider'
import { useTheme } from '@/core/providers/theme-provider'

interface AppContextType {
  isOnline: boolean
}

const AppContext = createContext<AppContextType>({ isOnline: true })

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const { setTheme } = useTheme()
  const { ui } = useStore()

  useEffect(() => {
    setTheme(ui.theme)
  }, [ui.theme, setTheme])

  useEffect(() => {
    const handleOnlineStatus = () => {
      // Handle online/offline status changes
    }

    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  return (
    <AppContext.Provider value={{ isOnline: navigator.onLine }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)