import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/core/providers/store-provider';
import { cn } from '@/lib/utils';
import PhotoCard from './PhotoCard';
import SearchFilterPanel from './SearchFilterPanel';

interface PhotoGalleryProps {
  className?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ className }) => {
  const { gallery, tags } = useStore();

  // Filtreleme ve sıralama işlemi
  const filteredAndSortedPhotos = gallery.photos
    .filter(photo => {
      // Etiket filtresi
      if (tags.selectedTags.length > 0 && !tags.selectedTags.some(tag => photo.tags.includes(tag))) {
        return false;
      }
      // Arama filtresi
      if (gallery.searchQuery) {
        const query = gallery.searchQuery.toLowerCase();
        return (
          photo.title.toLowerCase().includes(query) ||
          photo.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sıralama işlemi
      const sortOrder = gallery.sortOrder === 'asc' ? 1 : -1;
      switch (gallery.sortBy) {
        case 'date':
          return sortOrder * (new Date(a.date).getTime() - new Date(b.date).getTime());
        case 'title':
          return sortOrder * a.title.localeCompare(b.title);
        case 'relevance':
          // Basit ilgi derecesi hesaplama
          const aRelevance = a.tags.length + (a.title.includes(gallery.searchQuery) ? 10 : 0);
          const bRelevance = b.tags.length + (b.title.includes(gallery.searchQuery) ? 10 : 0);
          return sortOrder * (bRelevance - aRelevance);
        default:
          return 0;
      }
    });

  // Bento Grid düzeni için responsive sınıflar
  const gridClasses = {
    base: 'grid gap-4',
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <SearchFilterPanel />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(gridClasses.base, gridClasses.mobile, gridClasses.tablet, gridClasses.desktop)}
      >
        {filteredAndSortedPhotos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            id={photo.id}
            url={photo.url}
            title={photo.title}
            date={photo.date}
            tags={photo.tags}
            className="h-full"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default PhotoGallery;