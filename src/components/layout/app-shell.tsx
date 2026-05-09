import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Header from './header'
import Sidebar from './sidebar'
import GalleryView from '@/features/gallery/components/gallery-view'
import TimelineView from '@/features/timeline/components/timeline-view'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 }
}

const AppShell = () => {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full"
            >
              <Routes>
                <Route path="/" element={<Navigate to="/gallery" replace />} />
                <Route path="/gallery" element={<GalleryView />} />
                <Route path="/timeline" element={<TimelineView />} />
                <Route path="/tags" element={<PlaceholderPage title="Etiketler" />} />
                <Route path="/memories" element={<PlaceholderPage title="Anılar" />} />
                <Route path="/settings" element={<PlaceholderPage title="Ayarlar" />} />
                <Route path="*" element={<Navigate to="/gallery" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-60">
      <div className="text-6xl">🚧</div>
      <h2 className="text-2xl font-bold font-display">{title}</h2>
      <p className="text-white/50">Bu sayfa yakında eklenecek.</p>
    </div>
  )
}

export default AppShell