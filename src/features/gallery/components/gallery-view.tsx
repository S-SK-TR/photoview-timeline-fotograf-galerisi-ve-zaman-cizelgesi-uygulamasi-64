import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/core/providers/store-provider'
import { Image as ImageIcon, Tag, Calendar, Plus, Search, X } from 'lucide-react'

// Demo photos for empty state demonstration
const demoPhotos = [
  { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', title: 'Dağ Manzarası', date: '2024-06-15', tags: ['doğa', 'dağ'] },
  { id: '2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', title: 'Orman Yolu', date: '2024-05-22', tags: ['doğa', 'orman'] },
  { id: '3', url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80', title: 'Göl Yansıması', date: '2024-04-10', tags: ['göl', 'yansıma'] },
  { id: '4', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', title: 'Çayır', date: '2024-03-30', tags: ['doğa', 'çayır'] },
  { id: '5', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80', title: 'Güneş Batımı', date: '2024-02-14', tags: ['gün batımı', 'gökyüzü'] },
  { id: '6', url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80', title: 'Şelale', date: '2024-01-20', tags: ['su', 'şelale'] },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 }
}

const GalleryView = () => {
  const { gallery, ui, setSearchQuery, setUi } = useStore()
  
  const allPhotos = gallery.photos.length > 0 ? gallery.photos : demoPhotos
  
  const filteredPhotos = useMemo(() => {
    if (!gallery.searchQuery) return allPhotos
    const query = gallery.searchQuery.toLowerCase()
    return allPhotos.filter(photo => 
      photo.title.toLowerCase().includes(query) || 
      photo.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }, [allPhotos, gallery.searchQuery])

  const openLightbox = (photo: any) => {
    setUi(state => { state.ui.lightboxPhoto = photo })
  }

  const closeLightbox = () => {
    setUi(state => { state.ui.lightboxPhoto = null })
  }

  const openUploadModal = () => {
    setUi(state => { state.ui.uploadModalOpen = true })
  }

  return (
    <div className="h-full flex flex-col gap-4 relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold font-display">{filteredPhotos.length} Fotoğraf</h2>
          <p className="text-sm text-white/40 mt-0.5">
            {gallery.searchQuery ? `'${gallery.searchQuery}' için sonuçlar` : 'Tüm koleksiyonunuz'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              id="gallery-search"
              type="text"
              value={gallery.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Galerinde ara..."
              aria-label="Galeride ara"
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-44 placeholder:text-white/25"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
          </div>
          <button
            id="gallery-upload-btn"
            onClick={openUploadModal}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Ekle</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pb-4"
      >
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => openLightbox(photo)}
            className="bg-surface/50 backdrop-blur-[10px] rounded-xl overflow-hidden border border-white/10 cursor-pointer group"
          >
            <div className="relative aspect-square">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white text-xs font-semibold truncate">{photo.title}</h3>
                  <div className="flex items-center mt-1 gap-2 text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(photo.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={10} />
                      {photo.tags.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredPhotos.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
          <ImageIcon size={48} className="text-white/10 mb-4" />
          <h3 className="text-lg font-medium text-white/60">Fotoğraf bulunamadı</h3>
          <p className="text-sm text-white/30 max-w-xs mx-auto">
            Arama kriterlerinize uygun fotoğraf bulunmuyor veya galeriniz henüz boş.
          </p>
        </div>
      )}

      {gallery.photos.length === 0 && filteredPhotos.length > 0 && (
        <div className="text-center py-2">
          <p className="text-xs text-white/20 italic">Demo fotoğraflar gösteriliyor — gerçek fotoğraflarınızı ekleyin</p>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {ui.lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
                onClick={closeLightbox}
              >
                <X size={24} />
              </button>
              <div className="bg-surface/20 rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={ui.lightboxPhoto.url} 
                  alt={ui.lightboxPhoto.title} 
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="p-4 bg-surface/80 border-t border-white/10">
                  <h2 className="text-xl font-bold font-display">{ui.lightboxPhoto.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(ui.lightboxPhoto.date).toLocaleDateString('tr-TR')}</span>
                    <span className="flex items-center gap-1.5"><Tag size={14} /> {ui.lightboxPhoto.tags.join(', ')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal (Placeholder UI) */}
      <AnimatePresence>
        {ui.uploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setUi(state => { state.ui.uploadModalOpen = false })}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-surface border border-white/10 p-6 rounded-2xl max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-display">Fotoğraf Yükle</h3>
                <button onClick={() => setUi(state => { state.ui.uploadModalOpen = false })}><X size={20} className="text-white/40 hover:text-white" /></button>
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Plus className="text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Fotoğrafları buraya sürükleyin</p>
                  <p className="text-xs text-white/30 mt-1">Veya tıklayarak dosya seçin</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors" onClick={() => setUi(state => { state.ui.uploadModalOpen = false })}>Vazgeç</button>
                <button className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 transition-colors">Devam Et</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GalleryView