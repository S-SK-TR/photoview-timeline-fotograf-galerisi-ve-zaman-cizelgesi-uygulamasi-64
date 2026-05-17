import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoUpload from './photo-upload';
import { StoreProvider } from '@/core/providers/store-provider';

const renderWithStore = (ui: React.ReactElement) => {
  return render(
    <StoreProvider>
      {ui}
    </StoreProvider>
  );
};

describe('PhotoUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload interface', () => {
    renderWithStore(<PhotoUpload />);
    expect(screen.getByText(/Fotoğraf Yükle/i)).toBeInTheDocument();
    expect(screen.getByText(/Fotoğrafları buraya sürükleyin/i)).toBeInTheDocument();
  });

  it('handles file selection', () => {
    const mockUpload = vi.fn();
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ photos: [] })
    });

    renderWithStore(<PhotoUpload />);
    const fileInput = screen.getByLabelText(/Dosya Seç/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(window.fetch).toHaveBeenCalled();
  });

  it('shows loading state during upload', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(() => new Promise(() => {}));

    renderWithStore(<PhotoUpload />);
    const fileInput = screen.getByLabelText(/Dosya Seç/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText(/Fotoğraflar yükleniyor.../i)).toBeInTheDocument();
  });

  it('displays error when upload fails', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    renderWithStore(<PhotoUpload />);
    const fileInput = screen.getByLabelText(/Dosya Seç/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await screen.findByText(/Upload failed with status 500/i);
  });

  it('shows uploaded photos preview', async () => {
    const mockPhoto = {
      id: '1',
      url: 'https://example.com/test.jpg',
      title: 'Test Photo',
      date: '2023-01-01',
      tags: ['test']
    };

    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ photos: [mockPhoto] })
    });

    renderWithStore(<PhotoUpload />);
    const fileInput = screen.getByLabelText(/Dosya Seç/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await screen.findByText(/Yüklenen Fotoğraflar/i);
    expect(screen.getByAltText('Test Photo')).toBeInTheDocument();
  });

  it('displays performance metrics', () => {
    renderWithStore(<PhotoUpload />);
    expect(screen.getByText(/Yükleme süresi/i)).toBeInTheDocument();
    expect(screen.getByText(/Dosya boyutu/i)).toBeInTheDocument();
  });
});