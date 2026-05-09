import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '../helpers/test-utils'
import GalleryView from '@/features/gallery/components/gallery-view'
import { store } from '@/core/providers/store-provider'

describe('GalleryView Integration', () => {
  it('should render demo photos and filter them', () => {
    render(<GalleryView />)
    
    // Initially should show demo photos (6 items)
    const photos = screen.getAllByRole('img')
    expect(photos.length).toBeGreaterThanOrEqual(6)
    
    // Filter for 'Dağ'
    const searchInput = screen.getByPlaceholderText('Galerinde ara...')
    fireEvent.change(searchInput, { target: { value: 'Dağ' } })
    
    // Should filter to matching photos
    expect(screen.getByText('Dağ Manzarası')).toBeInTheDocument()
    expect(screen.queryByText('Şehir Işıkları')).not.toBeInTheDocument()
  })

  it('should open lightbox on photo click', () => {
    render(<GalleryView />)
    const firstPhoto = screen.getByAltText('Dağ Manzarası')
    
    fireEvent.click(firstPhoto)
    
    // Check if lightbox is in store
    expect(store.getState().ui.lightboxPhoto).not.toBeNull()
    expect(store.getState().ui.lightboxPhoto?.title).toBe('Dağ Manzarası')
    
    // Check if lightbox title is in DOM
    // Need to wait for animation? Normally react-testing-library handles sync updates
    expect(screen.getAllByText('Dağ Manzarası').length).toBeGreaterThan(1) // One in grid, one in lightbox
  })

  it('should show empty state when no results', () => {
    render(<GalleryView />)
    const searchInput = screen.getByPlaceholderText('Galerinde ara...')
    fireEvent.change(searchInput, { target: { value: 'non-existent-photo' } })
    
    expect(screen.getByText('Fotoğraf bulunamadı')).toBeInTheDocument()
  })
})
