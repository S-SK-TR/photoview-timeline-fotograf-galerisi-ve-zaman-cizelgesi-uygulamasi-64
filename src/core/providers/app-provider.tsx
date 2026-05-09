import { createContext, useContext, useEffect, useState } from 'react'
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
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    setTheme(ui.theme)
  }, [ui.theme, setTheme])

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [])

  return (
    <AppContext.Provider value={{ isOnline }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)