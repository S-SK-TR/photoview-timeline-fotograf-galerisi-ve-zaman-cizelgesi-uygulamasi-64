import { createContext, useContext } from 'react'
import { createStore, useStore as useZustandStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface Photo {
  id: string
  url: string
  title: string
  date: string
  tags: string[]
}

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  photos: Photo[]
  tags: string[]
}

interface StoreState {
  auth: {
    user: null | { name: string; email: string; avatar?: string }
    isAuthenticated: boolean
  }
  gallery: {
    photos: Photo[]
    selectedPhotos: string[]
    loading: boolean
  }
  timeline: {
    events: TimelineEvent[]
    currentDate: string
  }
  tags: {
    allTags: string[]
    selectedTags: string[]
  }
  ui: {
    theme: 'dark' | 'light'
    sidebarOpen: boolean
    modalOpen: boolean
    activeRoute: string
  }
}

interface StoreActions {
  setUi: (updater: (state: StoreState) => void) => void
  setGallery: (updater: (state: StoreState) => void) => void
  setAuth: (updater: (state: StoreState) => void) => void
  setTimeline: (updater: (state: StoreState) => void) => void
}

type Store = StoreState & StoreActions

const defaultState: StoreState = {
  auth: {
    user: null,
    isAuthenticated: false
  },
  gallery: {
    photos: [],
    selectedPhotos: [],
    loading: false
  },
  timeline: {
    events: [],
    currentDate: new Date().toISOString()
  },
  tags: {
    allTags: [],
    selectedTags: []
  },
  ui: {
    theme: 'dark',
    sidebarOpen: true,
    modalOpen: false,
    activeRoute: '/gallery'
  }
}

const store = createStore(
  immer<Store>((set) => ({
    ...defaultState,
    setUi: (updater) => set(updater),
    setGallery: (updater) => set(updater),
    setAuth: (updater) => set(updater),
    setTimeline: (updater) => set(updater),
  }))
)

interface StoreProviderProps {
  children: React.ReactNode
}

export const StoreContext = createContext(store)

export function StoreProvider({ children }: StoreProviderProps) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const api = useContext(StoreContext)
  return useZustandStore(api)
}