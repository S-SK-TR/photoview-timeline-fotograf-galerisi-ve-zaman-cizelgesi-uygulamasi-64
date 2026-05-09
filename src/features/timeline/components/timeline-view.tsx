import { motion } from 'framer-motion'
import { useStore } from '@/core/providers/store-provider'
import { Calendar, Tag, Image } from 'lucide-react'

const TimelineView = () => {
  const { timeline } = useStore()

  return (
    <div className="h-full p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {timeline.events.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ scale: 1.01 }}
            className="flex items-start space-x-4"
          >
            <div className="flex-shrink-0 w-16 text-center">
              <div className="text-sm text-white/60">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-2xl font-bold">
                {new Date(event.date).getDate()}
              </div>
              <div className="text-sm text-white/60">
                {new Date(event.date).getFullYear()}
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-surface/50 backdrop-blur-glass rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-medium mb-2">{event.title}</h3>
                <p className="text-white/80 mb-4">{event.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {event.photos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center mt-4 space-x-4 text-sm text-white/60">
                  <div className="flex items-center">
                    <Image size={14} className="mr-1" />
                    <span>{event.photos.length} photos</span>
                  </div>
                  <div className="flex items-center">
                    <Tag size={14} className="mr-1" />
                    <span>{event.tags.length} tags</span>
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

export default TimelineView