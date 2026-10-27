'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

/**
 * Theme toggle using next-themes.
 *
 * next-themes injects an inline script into <head> that reads localStorage
 * and sets the `dark` class on <html> BEFORE React hydrates. Combined with
 * suppressHydrationWarning on <html>, this avoids hydration mismatches
 * for the theme class.
 *
 * We render a placeholder until mounted to avoid SSR/client mismatch on
 * which icon (Sun vs Moon) to show.
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = (mounted ? resolvedTheme : 'dark') === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {mounted ? (
        isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
}
