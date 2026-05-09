import { createContext, useContext } from 'react'
import { createStore, useStore as useZustandStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StoreState {
  auth: {
    user: null | any
    isAuthenticated: boolean
  }
  gallery: {
    photos: any[]
    selectedPhotos: any[]
    loading: boolean
  }
  timeline: {
    events: any[]
    currentDate: Date
  }
  tags: {
    allTags: any[]
    selectedTags: any[]
  }
  ui: {
    theme: 'dark' | 'light'
    sidebarOpen: boolean
    modalOpen: boolean
  }
}

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
    currentDate: new Date()
  },
  tags: {
    allTags: [],
    selectedTags: []
  },
  ui: {
    theme: 'dark',
    sidebarOpen: true,
    modalOpen: false
  }
}

const store = createStore(immer(() => defaultState))

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const StoreContext = createContext(store)

export const useStore = () => useZustandStore(StoreContext)