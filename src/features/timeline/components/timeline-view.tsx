import { motion } from 'framer-motion'
import { useStore } from '@/core/providers/store-provider'
import { Calendar, Tag, Image as ImageIcon, Clock } from 'lucide-react'

const demoEvents = [
  {
    id: '1',
    title: 'Kapadokya Turu',
    description: 'Sıcak hava balonları ve peri bacaları arasında unutulmaz bir macera.',
    date: '2024-06-15',
    tags: ['seyahat', 'kapadokya', 'doğa'],
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80', title: 'Balon' },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80', title: 'Vadiler' },
      { id: 'p3', url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80', title: 'Gün Batımı' },
    ]
  },
  {
    id: '2',
    title: 'Bodrum Tatili',
    description: 'Ege\'nin berrak sularında yüzme ve tarihi Bodrum Kalesi gezisi.',
    date: '2024-08-20',
    tags: ['tatil', 'bodrum', 'deniz'],
    photos: [
      { id: 'p4', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=80', title: 'Koy' },
      { id: 'p5', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80', title: 'Akşam' },
    ]
  },
  {
    id: '3',
    title: 'Aile Pikniği',
    description: 'Belgrad Ormanı\'nda aile ile geçirilen güzel bir öğlen.',
    date: '2024-05-05',
    tags: ['aile', 'piknik', 'doğa'],
    photos: [
      { id: 'p6', url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=300&q=80', title: 'Orman' },
    ]
  }
]

const TimelineView = () => {
  const { timeline } = useStore()
  const events = timeline.events.length > 0 ? timeline.events : demoEvents

  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold font-display">Zaman Çizelgesi</h2>
        <p className="text-sm text-white/40 mt-0.5">{events.length} anı kaydedildi</p>
      </div>

      <div className="relative space-y-6 pb-4">
        {/* Vertical line */}
        <div className="absolute left-[4.5rem] top-0 bottom-0 w-px bg-white/10" />

        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ x: 4 }}
            className="flex items-start gap-4"
          >
            {/* Date column */}
            <div className="flex-shrink-0 w-16 text-center relative z-10">
              <div className="text-xs text-white/40 uppercase tracking-wide">
                {new Date(event.date).toLocaleDateString('tr-TR', { month: 'short' })}
              </div>
              <div className="text-2xl font-bold leading-tight">
                {new Date(event.date).getDate()}
              </div>
              <div className="text-xs text-white/40">
                {new Date(event.date).getFullYear()}
              </div>
            </div>

            {/* Dot */}
            <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-300/50 mt-3 relative z-10 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />

            {/* Content */}
            <div className="flex-1 bg-white/[0.04] backdrop-blur-[10px] rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-semibold font-display">{event.title}</h3>
                <span className="text-xs text-white/30 flex items-center gap-1 flex-shrink-0">
                  <Clock size={11} />
                  {new Date(event.date).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <p className="text-sm text-white/60 mb-3 leading-relaxed">{event.description}</p>

              {/* Photos grid */}
              {event.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {event.photos.map((photo) => (
                    <div key={photo.id} className="relative aspect-video rounded-lg overflow-hidden group">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <ImageIcon size={12} />
                  {event.photos.length} fotoğraf
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={12} />
                  {event.tags.join(', ')}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {timeline.events.length === 0 && (
        <div className="text-center py-1">
          <p className="text-xs text-white/20 italic">Demo etkinlikler gösteriliyor</p>
        </div>
      )}
    </div>
  )
}

export default TimelineView