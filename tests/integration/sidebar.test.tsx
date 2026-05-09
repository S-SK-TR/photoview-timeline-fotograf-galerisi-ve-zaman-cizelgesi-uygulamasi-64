import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '../helpers/test-utils'
import Sidebar from '@/components/layout/sidebar'

describe('Sidebar Integration', () => {
  it('should render correctly and toggle', () => {
    render(<Sidebar />)
    
    // Check brand name
    expect(screen.getByText('PhotoChronicle')).toBeInTheDocument()
    
    // Check nav items
    expect(screen.getByText('Galeri')).toBeInTheDocument()
    expect(screen.getByText('Zaman Çizelgesi')).toBeInTheDocument()
    
    // Toggle sidebar
    const toggleBtn = screen.getByLabelText('Toggle sidebar')
    fireEvent.click(toggleBtn)
    
    // Brand name should be hidden (check if removed from DOM or hidden by motion)
    // In our implementation, ui.sidebarOpen controls the conditional rendering of the text
    expect(screen.queryByText('PhotoChronicle')).not.toBeInTheDocument()
  })

  it('should have correct links', () => {
    render(<Sidebar />)
    
    const galleryLink = screen.getByText('Galeri').closest('a')
    expect(galleryLink).toHaveAttribute('href', '/gallery')
    
    const timelineLink = screen.getByText('Zaman Çizelgesi').closest('a')
    expect(timelineLink).toHaveAttribute('href', '/timeline')
  })
})
