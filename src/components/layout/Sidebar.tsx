import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/core/providers/store-provider';
import { cn } from '@/lib/utils';
import { LayoutGrid, CalendarDays, Tag, Share2, Settings, X, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { ui, setUi, tags } = useStore();
  const location = useLocation();

  const toggleTheme = () => {
    setUi(state => {
      state.ui.theme = state.ui.theme === 'dark' ? 'light' : 'dark';
    });
    // HTML elementine tema sınıfını ekle
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AnimatePresence>
      {ui.sidebarOpen && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 lg:relative lg:translate-x-0 glass-card flex flex-col",
            className
          )}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">PhotoView</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setUi(state => { state.ui.sidebarOpen = false })}                className="lg:hidden p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Ana Menü */}
          <nav className="flex-1 p-4 flex flex-col gap-2">
            <Link to="/gallery">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                  location.pathname === '/gallery'
                    ? "bg-brand-500/20 text-brand-500"
                    : "text-white hover:bg-white/10"
                )}
              >
                <LayoutGrid className="h-5 w-5" />
                <span className="text-sm font-medium">Galeri</span>
              </motion.button>
            </Link>

            <Link to="/timeline">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                  location.pathname === '/timeline'
                    ? "bg-brand-500/20 text-brand-500"
                    : "text-white hover:bg-white/10"
                )}
              >
                <CalendarDays className="h-5 w-5" />
                <span className="text-sm font-medium">Zaman Çizelgesi</span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUi(state => { state.ui.filterPanelOpen = !state.ui.filterPanelOpen })}              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                ui.filterPanelOpen ? "bg-brand-500/20 text-brand-500" : "text-white hover:bg-white/10"
              )}
            >
              <Tag className="h-5 w-5" />
              <span className="text-sm font-medium">Filtreler</span>
            </motion.button>
          </nav>

          {/* Etiketler */}
          <div className="p-4 border-t border-white/10">
            <h3 className="text-sm font-medium text-white/80 mb-3">Etiketler</h3>
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
                    "text-xs px-3 py-1 rounded-full border transition-colors",
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

          {/* Tema ve Ayarlar */}
          <div className="p-4 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              {ui.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="text-sm font-medium">Tema Değiştir</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;