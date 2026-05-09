import { motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import { Image, Calendar, Tag, Heart, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '@/core/providers/store-provider'

const navItems = [
  { name: 'Galeri', icon: Image, path: '/gallery' },
  { name: 'Zaman Çizelgesi', icon: Calendar, path: '/timeline' },
  { name: 'Etiketler', icon: Tag, path: '/tags' },
  { name: 'Anılar', icon: Heart, path: '/memories' },
  { name: 'Ayarlar', icon: Settings, path: '/settings' }
]

const Sidebar = () => {
  const { ui, setUi } = useStore()

  const toggleSidebar = () => {
    setUi(state => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen
    })
  }

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-surface/50 backdrop-blur-[10px] border-r border-white/10 h-full flex flex-col transition-all duration-300 flex-shrink-0 ${ui.sidebarOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="p-4 flex justify-between items-center border-b border-white/5">
        {ui.sidebarOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold font-display bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            PhotoChronicle
          </motion.span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-auto"
          aria-label="Toggle sidebar"
        >
          {ui.sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <motion.li
              key={item.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    ui.sidebarOpen ? 'justify-start' : 'justify-center'
                  } ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  }`
                }
                title={!ui.sidebarOpen ? item.name : undefined}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {ui.sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>
      {ui.sidebarOpen && (
        <div className="p-4 border-t border-white/5">
          <p className="text-xs text-white/20 text-center">PhotoChronicle v0.1.0</p>
        </div>
      )}
    </motion.aside>
  )
}

export default Sidebar