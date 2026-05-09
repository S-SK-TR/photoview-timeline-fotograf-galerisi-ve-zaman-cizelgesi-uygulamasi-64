import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '../helpers/test-utils'
import Header from '@/components/layout/header'
import { store } from '@/core/providers/store-provider'

describe('Header Integration', () => {
  it('should update search query in store', () => {
    render(<Header />)
    const searchInput = screen.getByPlaceholderText('Fotoğraf ara...')
    
    fireEvent.change(searchInput, { target: { value: 'tatil' } })
    
    expect(store.getState().gallery.searchQuery).toBe('tatil')
  })

  it('should open upload modal on button click', () => {
    render(<Header />)
    const uploadBtn = screen.getByLabelText('Fotoğraf yükle')
    
    fireEvent.click(uploadBtn)
    
    expect(store.getState().ui.uploadModalOpen).toBe(true)
  })

  it('should display correct title based on route', () => {
    // Note: customRender uses MemoryRouter which defaults to '/'
    render(<Header />)
    expect(screen.getByText('PhotoChronicle')).toBeInTheDocument()
  })
})
