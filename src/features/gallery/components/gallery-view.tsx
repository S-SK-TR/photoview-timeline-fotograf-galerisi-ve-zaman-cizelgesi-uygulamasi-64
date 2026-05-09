import { motion } from 'framer-motion'
import { useStore } from '@/core/providers/store-provider'
import { Image, Tag, Calendar, Plus, Search } from 'lucide-react'

// Demo photos for empty state demonstration
const demoPhotos = [
  { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', title: 'Dağ Manzarası', date: '2024-06-15', tags: ['doğa', 'dağ'] },
  { id: '2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', title: 'Orman Yolu', date: '2024-05-22', tags: ['doğa', 'orman'] },
  { id: '3', url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80', title: 'Göl Yansıması', date: '2024-04-10', tags: ['göl', 'yansıma'] },
  { id: '4', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80', title: 'Çayır', date: '2024-03-30', tags: ['doğa', 'çayır'] },
  { id: '5', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80', title: 'Güneş Batımı', date: '2024-02-14', tags: ['gün batımı', 'gökyüzü'] },
  { id: '6', url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&q=80', title: 'Şelale', date: '2024-01-20', tags: ['su', 'şelale'] },
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
  const { gallery } = useStore()
  const photos = gallery.photos.length > 0 ? gallery.photos : demoPhotos

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold font-display">{photos.length} Fotoğraf</h2>
          <p className="text-sm text-white/40 mt-0.5">Tüm koleksiyonunuz</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              id="gallery-search"
              type="text"
              placeholder="Galerinde ara..."
              aria-label="Galeride ara"
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-44 placeholder:text-white/25"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
          </div>
          <button
            id="gallery-upload-btn"
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
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
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

      {gallery.photos.length === 0 && (
        <div className="text-center py-2">
          <p className="text-xs text-white/20 italic">Demo fotoğraflar gösteriliyor — gerçek fotoğraflarınızı ekleyin</p>
        </div>
      )}
    </div>
  )
}

export default GalleryView