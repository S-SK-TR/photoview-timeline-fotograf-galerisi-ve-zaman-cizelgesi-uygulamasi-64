import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/core/providers/store-provider';
import { cn } from '@/lib/utils';
import { Search, LayoutGrid, CalendarDays, Share2, Settings, Moon, Sun, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { ui, setUi } = useStore();
  const location = useLocation();

  const toggleTheme = () => {
    setUi(state => {
      state.ui.theme = state.ui.theme === 'dark' ? 'light' : 'dark';
    });
    // HTML elementine tema sınıfını ekle
    document.documentElement.classList.toggle('dark');
  };

  const toggleSidebar = () => {
    setUi(state => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen;
    });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card sticky top-0 z-40 flex items-center justify-between p-4",
        className
      )}
    >
      {/* Mobil Menü Butonu */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </motion.button>

      {/* Arama Çubuğu */}
      <div className="hidden lg:flex flex-1 max-w-md">
        <div className="glass-card rounded-2xl p-3 flex items-center gap-3 w-full">
          <Search className="h-5 w-5 text-white/50" />
          <input
            type="text"
            placeholder="Fotoğraf, etiket veya tarih ara..."
            className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Görünüm Seçenekleri */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setUi(state => {
            state.ui.filterPanelOpen = !state.ui.filterPanelOpen;
          })}
          className={cn(
            "p-2 rounded-full transition-colors",
            ui.filterPanelOpen ? "bg-brand-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
          )}
        >
          <Search className="h-5 w-5" />
        </motion.button>

        <Link to="/gallery">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "p-2 rounded-full transition-colors",
              location.pathname === '/gallery' ? "bg-brand-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <LayoutGrid className="h-5 w-5" />
          </motion.button>
        </Link>

        <Link to="/timeline">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "p-2 rounded-full transition-colors",
              location.pathname === '/timeline' ? "bg-brand-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <CalendarDays className="h-5 w-5" />
          </motion.button>
        </Link>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          {ui.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;