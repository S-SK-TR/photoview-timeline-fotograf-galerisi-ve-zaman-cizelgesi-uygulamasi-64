import { motion } from 'framer-motion'
import { useStore } from '@/core/providers/store-provider'
import { Image, Tag, Calendar } from 'lucide-react'

const GalleryView = () => {
  const { gallery } = useStore()

  return (
    <div className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4"
      >
        {gallery.photos.map((photo) => (
          <motion.div
            key={photo.id}
            whileHover={{ y: -4, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)' }}
            className="bg-surface/50 backdrop-blur-glass rounded-xl overflow-hidden border border-white/10"
          >
            <div className="relative aspect-square">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium">{photo.title}</h3>
                  <div className="flex items-center mt-2 space-x-2 text-sm text-white/80">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(photo.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag size={14} className="mr-1" />
                      <span>{photo.tags.length} tags</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default GalleryView