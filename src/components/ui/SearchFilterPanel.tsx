import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/core/providers/store-provider';
import { cn } from '@/lib/utils';
import { Search, Calendar, Tag, X, ChevronDown, ChevronUp, Clock, ArrowUp, ArrowDown, History, Lightbulb } from 'lucide-react';

interface SearchFilterPanelProps {
  className?: string;
}

const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({ className }) => {
  const {
    gallery,
    tags,
    ui,
    setUi,
    setGallery,
    setSearchQuery,
    addToSearchHistory,
    updateSearchSuggestions,
    setSortBy,
    setSortOrder,
    clearSearchHistory
  } = useStore();

  const [localQuery, setLocalQuery] = useState(gallery.searchQuery);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  useEffect(() => {
    setLocalQuery(gallery.searchQuery);
  }, [gallery.searchQuery]);

  const handleSearch = () => {
    setSearchQuery(localQuery);
    if (localQuery.trim()) {
      addToSearchHistory(localQuery);
    }
    setUi(state => {
      state.ui.filterPanelOpen = false;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    setSearchQuery(suggestion);
    if (suggestion.trim()) {
      addToSearchHistory(suggestion);
    }
    setUi(state => {
      state.ui.filterPanelOpen = false;
    });
  };

  const handleHistoryClick = (query: string) => {
    setLocalQuery(query);
    setSearchQuery(query);
    setUi(state => {
      state.ui.filterPanelOpen = false;
    });
  };

  const toggleFilterPanel = () => {
    setUi(state => {
      state.ui.filterPanelOpen = !state.ui.filterPanelOpen;
    });
  };

  return (
    <div className={cn("relative", className)}>
      {/* Arama Çubuğu */}
      <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
        <Search className="h-5 w-5 text-white/50" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            updateSearchSuggestions(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Fotoğraf, etiket veya tarih ara..."
          className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFilterPanel}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          {ui.filterPanelOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </motion.button>
      </div>

      {/* Filtre Panel */}
      <AnimatePresence>
        {ui.filterPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full glass-card rounded-2xl p-6 shadow-xl"
          >
            <div className="flex flex-col gap-6">
              {/* Tarih Filtresi */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-brand-500" />
                  <h3 className="text-lg font-medium text-white">Tarih Aralığı</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-white/80">Başlangıç</label>
                    <input
                      type="date"
                      value={selectedDateRange.start}
                      onChange={(e) => setSelectedDateRange({ ...selectedDateRange, start: e.target.value })}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-white/80">Bitiş</label>
                    <input
                      type="date"
                      value={selectedDateRange.end}
                      onChange={(e) => setSelectedDateRange({ ...selectedDateRange, end: e.target.value })}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Etiket Filtresi */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-brand-500" />
                  <h3 className="text-lg font-medium text-white">Etiketler</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.allTags.map(tag => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setUi(state => {
                          const index = state.tags.selectedTags.indexOf(tag);
                          if (index > -1) {
                            state.tags.selectedTags.splice(index, 1);
                          } else {
                            state.tags.selectedTags.push(tag);
                          }
                        });
                      }}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full border transition-colors",
                        tags.selectedTags.includes(tag)
                          ? "bg-brand-500/20 text-brand-500 border-brand-500/50"
                          : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                      )}
                      style={{ borderColor: tags.tagColors[tag] || '#3b82f6' }}
                    >
                      #{tag}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sıralama Seçenekleri */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-brand-500" />
                  <h3 className="text-lg font-medium text-white">Sıralama</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortBy('date')}
                    className={cn(
                      "p-3 rounded-xl flex items-center justify-center gap-2 transition-colors",
                      gallery.sortBy === 'date'
                        ? "bg-brand-500/20 text-brand-500 border border-brand-500/50"
                        : "bg-white/5 text-white border border-white/20 hover:bg-white/10"
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Tarih</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortBy('title')}
                    className={cn(
                      "p-3 rounded-xl flex items-center justify-center gap-2 transition-colors",
                      gallery.sortBy === 'title'
                        ? "bg-brand-500/20 text-brand-500 border border-brand-500/50"
                        : "bg-white/5 text-white border border-white/20 hover:bg-white/10"
                    )}
                  >
                    <span className="text-sm font-medium">Başlık</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortBy('relevance')}
                    className={cn(
                      "p-3 rounded-xl flex items-center justify-center gap-2 transition-colors",
                      gallery.sortBy === 'relevance'
                        ? "bg-brand-500/20 text-brand-500 border border-brand-500/50"
                        : "bg-white/5 text-white border border-white/20 hover:bg-white/10"
                    )}
                  >
                    <span className="text-sm font-medium">İlgi</span>
                  </motion.button>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortOrder('asc')}
                    className={cn(
                      "flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors",
                      gallery.sortOrder === 'asc'
                        ? "bg-brand-500/20 text-brand-500 border border-brand-500/50"
                        : "bg-white/5 text-white border border-white/20 hover:bg-white/10"
                    )}
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Artan</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortOrder('desc')}
                    className={cn(
                      "flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors",
                      gallery.sortOrder === 'desc'
                        ? "bg-brand-500/20 text-brand-500 border border-brand-500/50"
                        : "bg-white/5 text-white border border-white/20 hover:bg-white/10"
                    )}
                  >
                    <ArrowDown className="h-4 w-4" />
                    <span className="text-sm font-medium">Azalan</span>
                  </motion.button>
                </div>
              </div>

              {/* Arama Geçmişi */}
              {gallery.searchHistory.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-brand-500" />
                    <h3 className="text-lg font-medium text-white">Arama Geçmişi</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gallery.searchHistory.map((query, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleHistoryClick(query)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        {query}
                      </motion.button>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearSearchHistory}
                    className="text-xs text-white/50 hover:text-white transition-colors self-end"
                  >
                    Geçmişi Temizle
                  </motion.button>
                </div>
              )}

              {/* Arama Önerileri */}
              {gallery.searchSuggestions.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-brand-500" />
                    <h3 className="text-lg font-medium text-white">Öneriler</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gallery.searchSuggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        #{suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Eylem Butonları */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="flex-1 p-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors"
                >
                  Ara
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setLocalQuery('');
                    setSearchQuery('');
                    setSelectedDateRange({ start: '', end: '' });
                    setUi(state => {
                      state.tags.selectedTags = [];
                      state.ui.filterPanelOpen = false;
                    });
                  }}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                >
                  Sıfırla
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilterPanel;