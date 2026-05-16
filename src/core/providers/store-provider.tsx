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

interface ShareOptions {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'email'
  url: string
  text: string
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
    sortBy: 'date' | 'title' | 'relevance'
    sortOrder: 'asc' | 'desc'
    searchHistory: string[]
    searchSuggestions: string[]
  }
  timeline: {
    events: TimelineEvent[]
    currentDate: string
  }
  tags: {
    allTags: string[]
    selectedTags: string[]
    tagColors: Record<string, string>
  }
  ui: {
    theme: 'dark' | 'light'
    sidebarOpen: boolean
    uploadModalOpen: boolean
    lightboxPhoto: Photo | null
    modalOpen: boolean
    activeRoute: string
    shareModalOpen: boolean
    sharePreview: {
      photo: Photo | null
      platform: ShareOptions['platform'] | null
      shareUrl: string
    }
    filterPanelOpen: boolean
  }
  sharing: {
    platforms: ShareOptions[]
    isSharing: boolean
    shareSuccess: boolean
  }
}

interface StoreActions {
  setUi: (updater: (state: StoreState) => void) => void
  setGallery: (updater: (state: StoreState) => void) => void
  setAuth: (updater: (state: StoreState) => void) => void
  setTimeline: (updater: (state: StoreState) => void) => void
  addPhoto: (photo: Photo) => void
  updatePhoto: (photo: Photo) => void
  deletePhoto: (photoId: string) => void
  addTag: (tag: string, color?: string) => void
  removeTag: (tag: string) => void
  setSearchQuery: (query: string) => void
  togglePhotoSelection: (photoId: string) => void
  resetStore: () => void
  toggleTagSelection: (tag: string) => void
  clearSelectedTags: () => void
  setSharePreview: (photo: Photo, platform: ShareOptions['platform']) => void
  clearSharePreview: () => void
  sharePhoto: (platform: ShareOptions['platform'], photo: Photo) => void
  setSortBy: (sortBy: StoreState['gallery']['sortBy']) => void
  setSortOrder: (sortOrder: StoreState['gallery']['sortOrder']) => void
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
  updateSearchSuggestions: (query: string) => void
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
    loading: false,
    sortBy: 'date',
    sortOrder: 'desc',
    searchHistory: [],
    searchSuggestions: []
  },
  timeline: {
    events: [],
    currentDate: new Date().toISOString()
  },
  tags: {
    allTags: [],
    selectedTags: [],
    tagColors: {}
  },
  ui: {
    theme: 'dark',
    sidebarOpen: true,
    uploadModalOpen: false,
    lightboxPhoto: null,
    modalOpen: false,
    activeRoute: '/gallery',
    shareModalOpen: false,
    sharePreview: {
      photo: null,
      platform: null,
      shareUrl: ''
    },
    filterPanelOpen: false
  },
  sharing: {
    platforms: [
      { platform: 'facebook', url: 'https://facebook.com/sharer.php?u={url}&quote={text}', text: '' },
      { platform: 'twitter', url: 'https://twitter.com/intent/tweet?url={url}&text={text}', text: '' },
      { platform: 'instagram', url: 'https://www.instagram.com/?url={url}', text: '' },
      { platform: 'linkedin', url: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={text}', text: '' },
      { platform: 'email', url: 'mailto:?subject={text}&body={url}', text: '' }
    ],
    isSharing: false,
    shareSuccess: false
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
    updatePhoto: (updatedPhoto) => set((state) => {
      const index = state.gallery.photos.findIndex(p => p.id === updatedPhoto.id)
      if (index !== -1) {
        state.gallery.photos[index] = updatedPhoto
      }
    }),
    deletePhoto: (photoId) => set((state) => {
      state.gallery.photos = state.gallery.photos.filter(p => p.id !== photoId)
    }),
    addTag: (tag, color) => set((state) => {
      if (!state.tags.allTags.includes(tag)) {
        state.tags.allTags.push(tag)
        if (color) {
          state.tags.tagColors[tag] = color
        } else {
          // Rastgele renk oluştur
          const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
          state.tags.tagColors[tag] = randomColor
        }
      }
    }),
    removeTag: (tag) => set((state) => {
      state.tags.allTags = state.tags.allTags.filter(t => t !== tag)
      delete state.tags.tagColors[tag]
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
    toggleTagSelection: (tag) => set((state) => {
      const index = state.tags.selectedTags.indexOf(tag)
      if (index > -1) {
        state.tags.selectedTags.splice(index, 1)
      } else {
        state.tags.selectedTags.push(tag)
      }
    }),
    clearSelectedTags: () => set((state) => {
      state.tags.selectedTags = []
    }),
    resetStore: () => set(defaultState),
    setSharePreview: (photo, platform) => set((state) => {
      const platformConfig = state.sharing.platforms.find(p => p.platform === platform)
      if (platformConfig) {
        const shareUrl = platformConfig.url
          .replace('{url}', encodeURIComponent(window.location.origin + '/share/' + photo.id))
          .replace('{text}', encodeURIComponent(photo.title))
        state.ui.sharePreview = {
          photo,
          platform,
          shareUrl
        }
        state.ui.shareModalOpen = true
      }
    }),
    clearSharePreview: () => set((state) => {
      state.ui.sharePreview = {
        photo: null,
        platform: null,
        shareUrl: ''
      }
      state.ui.shareModalOpen = false
    }),
    sharePhoto: (platform, photo) => set((state) => {
      state.sharing.isSharing = true
      const platformConfig = state.sharing.platforms.find(p => p.platform === platform)
      if (platformConfig) {
        const shareUrl = platformConfig.url
          .replace('{url}', encodeURIComponent(window.location.origin + '/share/' + photo.id))
          .replace('{text}', encodeURIComponent(photo.title))
        window.open(shareUrl, '_blank')
        state.sharing.shareSuccess = true
      }
      state.sharing.isSharing = false
    }),
    setSortBy: (sortBy) => set((state) => {
      state.gallery.sortBy = sortBy
    }),
    setSortOrder: (sortOrder) => set((state) => {
      state.gallery.sortOrder = sortOrder
    }),
    addToSearchHistory: (query) => set((state) => {
      if (!state.gallery.searchHistory.includes(query)) {
        state.gallery.searchHistory.unshift(query)
        if (state.gallery.searchHistory.length > 10) {
          state.gallery.searchHistory.pop()
        }
      }
    }),
    clearSearchHistory: () => set((state) => {
      state.gallery.searchHistory = []
    }),
    updateSearchSuggestions: (query) => set((state) => {
      if (query.length > 2) {
        // Basit öneri algoritması
        const suggestions = state.gallery.photos
          .flatMap(photo => photo.tags)
          .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
        state.gallery.searchSuggestions = [...new Set(suggestions)]
      } else {
        state.gallery.searchSuggestions = []
      }
    })
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