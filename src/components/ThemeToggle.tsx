// src/components/ThemeToggle.tsx
import { useEffect, useState } from 'react'
import Moon from '../icons/Moon.astro'
import Sun from '../icons/Sun.astro'

export default function ThemeToggle () {
  const [theme, setTheme] = useState<string | null>(null)

  useEffect(() => {
    setTheme(() => {
      if (localStorage.getItem('theme')) {
        return localStorage.getItem('theme')
      } else {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
    })
  }, [])

  const handleToggleTheme = () => {
    console.log('click')
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.className = newTheme
  }

  return (
    <button
      className='opacity-80 hover:scale-110 hover:opacity-80 transition-all text-sm lg:text-base cursor-pointer'
      aria-label='Cambiar tema oscuro/claro'
      onClick={handleToggleTheme}
    >
      <Sun className='hidden dark:block' />
      <Moon className='block dark:hidden' />
    </button>
  )
}
