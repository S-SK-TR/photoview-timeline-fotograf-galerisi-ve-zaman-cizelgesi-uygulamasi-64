import { describe, it, expect } from 'vitest'
import { render, renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/core/providers/theme-provider'
import React from 'react'

describe('Theme Provider', () => {
  it('should set initial theme and update document class', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <div>Content</div>
      </ThemeProvider>
    )
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should change theme via useTheme hook', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
    )
    
    const { result } = renderHook(() => useTheme(), { wrapper })

    act(() => {
      result.current.setTheme('light')
    })

    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
