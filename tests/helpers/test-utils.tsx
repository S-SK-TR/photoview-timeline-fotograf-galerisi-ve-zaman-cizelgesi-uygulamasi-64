import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { StoreProvider } from '@/core/providers/store-provider'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@/core/providers/theme-provider'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <StoreProvider>
        <ThemeProvider defaultTheme="dark">
          {children}
        </ThemeProvider>
      </StoreProvider>
    </MemoryRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
