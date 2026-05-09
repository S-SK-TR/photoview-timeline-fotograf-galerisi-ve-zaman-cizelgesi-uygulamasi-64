import { describe, it, expect, beforeEach } from 'vitest'
import { store } from '@/core/providers/store-provider'
import { mockPhoto } from '../../fixtures/photo.fixtures'

describe('Store Provider', () => {
  beforeEach(() => {
    // Reset store state if needed or handle it per test
  })

  it('should have initial state', () => {
    const state = store.getState()
    expect(state.ui.sidebarOpen).toBe(true)
    expect(state.gallery.photos).toEqual([])
    expect(state.gallery.searchQuery).toBe('')
  })

  it('should update sidebar state via setUi', () => {
    store.getState().setUi((state) => {
      state.ui.sidebarOpen = false
    })
    expect(store.getState().ui.sidebarOpen).toBe(false)
  })

  it('should update search query via setSearchQuery', () => {
    store.getState().setSearchQuery('doğa')
    expect(store.getState().gallery.searchQuery).toBe('doğa')
  })

  it('should add photo via addPhoto', () => {
    store.getState().addPhoto(mockPhoto)
    expect(store.getState().gallery.photos).toHaveLength(1)
    expect(store.getState().gallery.photos[0].id).toBe(mockPhoto.id)
  })

  it('should toggle photo selection', () => {
    const photoId = 'test-id'
    store.getState().togglePhotoSelection(photoId)
    expect(store.getState().gallery.selectedPhotos).toContain(photoId)
    
    store.getState().togglePhotoSelection(photoId)
    expect(store.getState().gallery.selectedPhotos).not.toContain(photoId)
  })
})
