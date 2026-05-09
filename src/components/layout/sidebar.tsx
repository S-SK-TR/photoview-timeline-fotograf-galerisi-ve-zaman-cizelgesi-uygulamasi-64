import { motion } from 'framer-motion'
import { Image, Calendar, Tag, Heart, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '@/core/providers/store-provider'

const Sidebar = () => {
  const { ui, setUi } = useStore()

  const toggleSidebar = () => {
    setUi(state => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen
    })
  }

  const navItems = [
    { name: 'Gallery', icon: Image, path: '/gallery' },
    { name: 'Timeline', icon: Calendar, path: '/timeline' },
    { name: 'Tags', icon: Tag, path: '/tags' },
    { name: 'Memories', icon: Heart, path: '/memories' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ]

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-surface/50 backdrop-blur-glass border-r border-white/10 h-full flex flex-col transition-all duration-300 ${ui.sidebarOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="p-4 flex justify-between items-center">
        {ui.sidebarOpen && (
          <h2 className="text-xl font-bold font-display">Menu</h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {ui.sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <motion.li
              key={item.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${ui.sidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <item.icon size={20} />
                {ui.sidebarOpen && (
                  <span className="ml-3">{item.name}</span>
                )}
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  )
}

export default Sidebar