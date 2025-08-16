import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme, isLight } = useTheme()

  return (
    <button 
      className="pf-theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      title={`Switch to ${isLight ? 'dark' : 'light'} theme`}
    >
      <i className={`fas ${isLight ? 'fa-moon' : 'fa-sun'}`}></i>
    </button>
  )
}

export default ThemeToggle