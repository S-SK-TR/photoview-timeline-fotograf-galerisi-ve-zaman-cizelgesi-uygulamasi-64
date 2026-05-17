import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GalleryView from './gallery-view';
import { StoreProvider } from '@/core/providers/store-provider';
import { mockPhoto } from '@/tests/fixtures/photo.fixtures';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    img: ({ children, ...props }) => <img {...props}>{children}</img>
  },
  AnimatePresence: ({ children }) => <>{children}</>
}));

const renderWithStore = (ui: React.ReactElement) => {
  return render(
    <StoreProvider>
      {ui}
    </StoreProvider>
  );
};

describe('GalleryView', () => {
  beforeEach(() => {
    // Reset store state if needed
  });

  it('renders empty state when no photos', () => {
    renderWithStore(<GalleryView />);
    expect(screen.getByText(/Fotoğraf bulunamadı/i)).toBeInTheDocument();
  });

  it('displays demo photos when gallery is empty', () => {
    renderWithStore(<GalleryView />);
    expect(screen.getByText(/Demo fotoğraflar gösteriliyor/i)).toBeInTheDocument();
  });

  it('opens lightbox when photo is clicked', () => {
    renderWithStore(<GalleryView />);
    const firstPhoto = screen.getAllByRole('img')[0];
    fireEvent.click(firstPhoto);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens upload modal when upload button is clicked', () => {
    renderWithStore(<GalleryView />);
    const uploadButton = screen.getByText(/Ekle/i);
    fireEvent.click(uploadButton);
    expect(screen.getByText(/Fotoğraf Yükle/i)).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    const mockUpload = vi.fn();
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ photos: [mockPhoto] })
    });

    renderWithStore(<GalleryView />);
    const uploadButton = screen.getByText(/Ekle/i);
    fireEvent.click(uploadButton);

    const fileInput = screen.getByLabelText(/Dosya Seç/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(window.fetch).toHaveBeenCalled();
  });

  it('displays error when upload fails', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    renderWithStore(<GalleryView />);
    const uploadButton = screen.getByText(/Ekle/i);
    fireEvent.click(uploadButton);

    const fileInput = screen.getByLabelText(/Dosya Seç/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await screen.findByText(/Upload failed with status 500/i);
  });

  it('displays performance metrics', () => {
    renderWithStore(<GalleryView />);
    expect(screen.getByText(/Yükleme süresi/i)).toBeInTheDocument();
    expect(screen.getByText(/Fotoğraf sayısı/i)).toBeInTheDocument();
  });
});