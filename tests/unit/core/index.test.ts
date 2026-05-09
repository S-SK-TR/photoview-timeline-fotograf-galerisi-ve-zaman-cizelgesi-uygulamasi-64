import { describe, it, expect, vi } from 'vitest'
import { config, bootstrap } from '@/core/index'

describe('Core Index', () => {
  it('should have correct configuration', () => {
    expect(config.appName).toBe('PhotoChronicle')
    expect(config.version).toBe('0.1.0')
  })

  it('should log info on bootstrap', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    bootstrap()
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('PhotoChronicle v0.1.0 starting...'))
    consoleSpy.mockRestore()
  })
})
