export const useTheme = () => {
  const isDark = useState<boolean>('theme-dark', () => false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.body.classList.add('dark-theme')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-theme')
      localStorage.setItem('theme', 'light')
    }
  }

  //   // Инициализация при первом использовании (на клиенте)
  //   if (process.client) {
  //     const saved = localStorage.getItem('theme')
  //     if (saved === 'dark') {
  //       isDark.value = true
  //       document.body.classList.add('dark-theme')
  //     }
  //   }

  return { isDark, toggleTheme }
}
