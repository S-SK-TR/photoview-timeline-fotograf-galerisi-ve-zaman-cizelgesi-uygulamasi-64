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
    searchQuery: string
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
    uploadModalOpen: boolean
    lightboxPhoto: Photo | null
    modalOpen: boolean
    activeRoute: string
  }
}

interface StoreActions {
  setUi: (updater: (state: StoreState) => void) => void
  setGallery: (updater: (state: StoreState) => void) => void
  setAuth: (updater: (state: StoreState) => void) => void
  setTimeline: (updater: (state: StoreState) => void) => void
  addPhoto: (photo: Photo) => void
  removePhoto: (photoId: string) => void
  setSearchQuery: (query: string) => void
  togglePhotoSelection: (photoId: string) => void
  resetStore: () => void
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
    searchQuery: '',
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
    uploadModalOpen: false,
    lightboxPhoto: null,
    modalOpen: false,
    activeRoute: '/gallery'
  }
}

export const store = createStore(
  immer<Store>((set) => ({
    ...defaultState,
    setUi: (updater) => set((state) => { updater(state as StoreState) }),
    setGallery: (updater) => set((state) => { updater(state as StoreState) }),
    setAuth: (updater) => set((state) => { updater(state as StoreState) }),
    setTimeline: (updater) => set((state) => { updater(state as StoreState) }),
    addPhoto: (photo) => set((state) => {
      state.gallery.photos.unshift(photo)
    }),
    removePhoto: (photoId) => set((state) => {
      state.gallery.photos = state.gallery.photos.filter(p => p.id !== photoId)
    }),
    setSearchQuery: (query) => set((state) => {
      state.gallery.searchQuery = query
    }),
    togglePhotoSelection: (photoId) => set((state) => {
      const index = state.gallery.selectedPhotos.indexOf(photoId)
      if (index > -1) {
        state.gallery.selectedPhotos.splice(index, 1)
      } else {
        state.gallery.selectedPhotos.push(photoId)
      }
    }),
    resetStore: () => set(defaultState),
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