import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './core/providers/app-provider'
import { ThemeProvider } from './core/providers/theme-provider'
import { StoreProvider } from './core/providers/store-provider'
import AppShell from './components/layout/app-shell'

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ThemeProvider defaultTheme="dark">
          <AppProvider>
            <AppShell />
          </AppProvider>
        </ThemeProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}

export default App