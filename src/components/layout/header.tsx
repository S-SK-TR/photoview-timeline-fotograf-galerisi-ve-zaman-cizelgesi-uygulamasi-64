import { motion } from 'framer-motion'
import { Search, Bell, Upload, Moon, Sun } from 'lucide-react'
import { useStore } from '@/core/providers/store-provider'
import { useTheme } from '@/core/providers/theme-provider'
import { useLocation } from 'react-router-dom'

const routeTitles: Record<string, string> = {
  '/gallery': 'Fotoğraf Galerisi',
  '/timeline': 'Zaman Çizelgesi',
  '/tags': 'Etiketler',
  '/memories': 'Anılar',
  '/settings': 'Ayarlar'
}

const Header = () => {
  const { ui } = useStore()
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const pageTitle = routeTitles[location.pathname] ?? 'PhotoChronicle'

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-surface/40 backdrop-blur-[10px] border-b border-white/10 px-4 md:px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0"
    >
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-lg font-bold font-display truncate text-white/90">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            id="header-search"
            type="text"
            placeholder="Fotoğraf ara..."
            aria-label="Fotoğraf ara"
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 pl-9 w-52 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all placeholder:text-white/30"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
        </div>

        {/* Upload */}
        <button
          id="header-upload-btn"
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
          aria-label="Fotoğraf yükle"
        >
          <Upload size={15} />
          <span className="hidden lg:inline">Yükle</span>
        </button>

        {/* Theme toggle */}
        <button
          id="header-theme-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl hover:bg-white/10 transition-all"
          aria-label="Tema değiştir"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          id="header-notification-btn"
          className="p-2 rounded-xl hover:bg-white/10 transition-all relative"
          aria-label="Bildirimler"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full" />
        </button>

        {/* Avatar */}
        <button
          id="header-avatar-btn"
          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold hover:scale-105 transition-transform"
          aria-label="Profil"
        >
          P
        </button>
      </div>
    </motion.header>
  )
}

export default Header