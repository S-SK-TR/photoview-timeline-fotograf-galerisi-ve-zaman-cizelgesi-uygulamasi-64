import { motion } from 'framer-motion'
import Header from './header'
import Sidebar from './sidebar'
import { useStore } from '@/core/providers/store-provider'

const AppShell = () => {
  const { ui } = useStore()

  return (
    <div className="flex h-screen bg-background text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            {/* Main content will be rendered here */}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default AppShell