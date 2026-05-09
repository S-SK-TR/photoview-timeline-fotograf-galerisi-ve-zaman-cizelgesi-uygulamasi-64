import { motion } from 'framer-motion'
import { Search, Bell, User } from 'lucide-react'
import { useStore } from '@/core/providers/store-provider'

const Header = () => {
  const { auth } = useStore()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-surface/50 backdrop-blur-glass border-b border-white/10 p-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold font-display">PhotoChronicle</h1>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search photos..."
            className="bg-surface/50 backdrop-blur-glass border border-white/10 rounded-lg px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
        </div>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <User size={20} />
        </button>
      </div>
    </motion.header>
  )
}

export default Header