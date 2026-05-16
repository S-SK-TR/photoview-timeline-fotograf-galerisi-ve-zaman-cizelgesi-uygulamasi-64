import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/core/providers/store-provider';
import { cn } from '@/lib/utils';
import { Calendar, ChevronRight } from 'lucide-react';
import PhotoCard from './PhotoCard';
import SearchFilterPanel from './SearchFilterPanel';

interface TimelineViewProps {
  className?: string;
}

const TimelineView: React.FC<TimelineViewProps> = ({ className }) => {
  const { timeline, gallery, tags } = useStore();

  // Fotoğrafları tarihlerine göre grupla ve filtrele
  const groupedPhotos = gallery.photos.reduce((acc, photo) => {
    // Etiket filtresi uygula
    if (tags.selectedTags.length > 0 && !tags.selectedTags.some(tag => photo.tags.includes(tag))) {
      return acc;
    }

    // Arama filtresi uygula
    if (gallery.searchQuery) {
      const query = gallery.searchQuery.toLowerCase();
      if (!photo.title.toLowerCase().includes(query) &&
          !photo.tags.some(tag => tag.toLowerCase().includes(query))) {
        return acc;
      }
    }

    const date = new Date(photo.date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(photo);
    return acc;
  }, {} as Record<string, typeof gallery.photos>);

  // Tarihleri sırala (en yeni önce)
  const sortedDates = Object.keys(groupedPhotos).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <SearchFilterPanel />
      <div className="flex flex-col gap-8">
        {sortedDates.map((date, dateIndex) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dateIndex * 0.1, duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Tarih Başlığı */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-brand-500/10 text-brand-500">
                <Calendar className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                {date}
              </h2>
            </div>

            {/* Fotoğraf Grid'i */}
            <div className="overflow-x-auto pb-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex gap-4 min-w-max"
              >
                {groupedPhotos[date].map((photo, photoIndex) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: photoIndex * 0.05, duration: 0.3 }}
                    className="w-64 flex-shrink-0"
                  >
                    <PhotoCard
                      id={photo.id}
                      url={photo.url}
                      title={photo.title}
                      date={photo.date}
                      tags={photo.tags}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;