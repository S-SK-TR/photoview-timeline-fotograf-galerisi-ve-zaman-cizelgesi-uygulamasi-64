import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GalleryView from '@/features/gallery/components/gallery-view';
import { StoreProvider } from '@/core/providers/store-provider';
import { mockPhotos } from '@/tests/fixtures/photo.fixtures';

const renderWithStore = (ui: React.ReactElement) => {
  return render(
    <StoreProvider>
      {ui}
    </StoreProvider>
  );
};

describe('Gallery Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock API calls
    vi.spyOn(window, 'fetch').mockImplementation((url) => {
      if (url === '/api/upload') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ photos: mockPhotos })
        });
      }
      return Promise.reject(new Error('Not mocked'));
    });
  });

  it('completes the upload, edit, and share flow', async () => {
    // 1. Render gallery view
    renderWithStore(<GalleryView />);

    // 2. Open upload modal
    const uploadButton = screen.getByText(/Ekle/i);
    fireEvent.click(uploadButton);

    // 3. Upload photos
    const fileInput = screen.getByLabelText(/Dosya Seç/i);
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // 4. Verify upload success
    await screen.findByText(/Yüklenen Fotoğraflar/i);
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument();

    // 5. Open lightbox for a photo
    const firstPhoto = screen.getAllByRole('img')[0];
    fireEvent.click(firstPhoto);

    // 6. Open edit modal
    const editButton = screen.getByText(/Düzenle/i);
    fireEvent.click(editButton);

    // 7. Update photo title
    const titleInput = screen.getByLabelText(/Fotoğraf Başlığı/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    // 8. Save changes
    const saveButton = screen.getByText(/Kaydet/i);
    fireEvent.click(saveButton);

    // 9. Verify update
    await screen.findByText(/Fotoğraf başarıyla güncellendi/i);

    // 10. Open share modal
    const shareButton = screen.getByText(/Paylaş/i);
    fireEvent.click(shareButton);

    // 11. Select platform and share
    const facebookButton = screen.getByText(/Facebook/i);
    fireEvent.click(facebookButton);
    const shareActionButton = screen.getByText(/Paylaş/i);
    fireEvent.click(shareActionButton);

    // 12. Verify share success
    await screen.findByText(/Fotoğraf başarıyla paylaşıldı/i);
  });

  it('displays performance metrics during flow', async () => {
    renderWithStore(<GalleryView />);
    expect(screen.getByText(/Toplam süre/i)).toBeInTheDocument();
    expect(screen.getByText(/İşlem sayısı/i)).toBeInTheDocument();
  });
});