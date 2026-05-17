import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoEdit from './photo-edit';
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

describe('PhotoEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders photo edit form', () => {
    renderWithStore(<PhotoEdit photo={mockPhoto} />);
    expect(screen.getByDisplayValue('Test Photo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('updates photo title', () => {
    renderWithStore(<PhotoEdit photo={mockPhoto} />);
    const titleInput = screen.getByLabelText(/Fotoğraf Başlığı/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    expect(titleInput).toHaveValue('Updated Title');
  });

  it('updates photo tags', () => {
    renderWithStore(<PhotoEdit photo={mockPhoto} />);
    const tagsInput = screen.getByLabelText(/Etiketler/i);
    fireEvent.change(tagsInput, { target: { value: 'updated, tags' } });
    expect(tagsInput).toHaveValue('updated, tags');
  });

  it('submits updated photo', async () => {
    const mockUpdate = vi.fn();
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ...mockPhoto, title: 'Updated Title' })
    });

    renderWithStore(<PhotoEdit photo={mockPhoto} />);
    const titleInput = screen.getByLabelText(/Fotoğraf Başlığı/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    const submitButton = screen.getByText(/Kaydet/i);
    fireEvent.click(submitButton);

    expect(window.fetch).toHaveBeenCalled();
  });

  it('shows error when update fails', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    renderWithStore(<PhotoEdit photo={mockPhoto} />);
    const titleInput = screen.getByLabelText(/Fotoğraf Başlığı/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    const submitButton = screen.getByText(/Kaydet/i);
    fireEvent.click(submitButton);

    await screen.findByText(/Güncelleme başarısız/i);
  });

  it('displays performance metrics', () => {
    renderWithStore(<PhotoEdit photo={mockPhoto} />);
    expect(screen.getByText(/Kaydetme süresi/i)).toBeInTheDocument();
    expect(screen.getByText(/Değişiklik sayısı/i)).toBeInTheDocument();
  });
});