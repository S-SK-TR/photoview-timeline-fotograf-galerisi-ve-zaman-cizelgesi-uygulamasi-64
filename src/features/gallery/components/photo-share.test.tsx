import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoShare from './photo-share';
import { StoreProvider } from '@/core/providers/store-provider';

const mockPhoto = {
  id: '1',
  url: 'https://example.com/test.jpg',
  title: 'Test Photo',
  date: '2023-01-01',
  tags: ['test']
};

const renderWithStore = (ui: React.ReactElement) => {
  return render(
    <StoreProvider>
      {ui}
    </StoreProvider>
  );
};

describe('PhotoShare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders share options', () => {
    renderWithStore(<PhotoShare photo={mockPhoto} />);
    expect(screen.getByText(/Fotoğrafı Paylaş/i)).toBeInTheDocument();
    expect(screen.getByText(/Facebook/i)).toBeInTheDocument();
    expect(screen.getByText(/Twitter/i)).toBeInTheDocument();
  });

  it('shows share preview', () => {
    renderWithStore(<PhotoShare photo={mockPhoto} />);
    const facebookButton = screen.getByText(/Facebook/i);
    fireEvent.click(facebookButton);
    expect(screen.getByText(/Facebook önizlemesi/i)).toBeInTheDocument();
  });

  it('handles share action', () => {
    const mockOpen = vi.fn();
    window.open = mockOpen;

    renderWithStore(<PhotoShare photo={mockPhoto} />);
    const facebookButton = screen.getByText(/Facebook/i);
    fireEvent.click(facebookButton);

    const shareButton = screen.getByText(/Paylaş/i);
    fireEvent.click(shareButton);

    expect(mockOpen).toHaveBeenCalled();
  });

  it('shows success message after sharing', async () => {
    const mockOpen = vi.fn();
    window.open = mockOpen;

    renderWithStore(<PhotoShare photo={mockPhoto} />);
    const facebookButton = screen.getByText(/Facebook/i);
    fireEvent.click(facebookButton);

    const shareButton = screen.getByText(/Paylaş/i);
    fireEvent.click(shareButton);

    await screen.findByText(/Fotoğraf başarıyla paylaşıldı/i);
  });

  it('displays performance metrics', () => {
    renderWithStore(<PhotoShare photo={mockPhoto} />);
    expect(screen.getByText(/Paylaşım süresi/i)).toBeInTheDocument();
    expect(screen.getByText(/Paylaşım sayısı/i)).toBeInTheDocument();
  });
});