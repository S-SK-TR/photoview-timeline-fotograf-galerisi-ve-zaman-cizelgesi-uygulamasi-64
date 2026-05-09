export const mockPhoto = {
  id: '1',
  url: 'https://test.com/photo1.jpg',
  title: 'Test Fotoğrafı 1',
  date: '2024-01-01',
  tags: ['doğa', 'test']
}

export const mockPhotos = [
  mockPhoto,
  {
    id: '2',
    url: 'https://test.com/photo2.jpg',
    title: 'Dağ Manzarası',
    date: '2024-02-15',
    tags: ['dağ', 'manzara']
  },
  {
    id: '3',
    url: 'https://test.com/photo3.jpg',
    title: 'Şehir Işıkları',
    date: '2024-03-20',
    tags: ['şehir', 'gece']
  }
]

export const mockEvent = {
  id: 'e1',
  title: 'Test Etkinliği',
  description: 'Açıklama metni',
  date: '2024-06-15',
  photos: [mockPhoto],
  tags: ['seyahat']
}

export const mockEvents = [mockEvent]
