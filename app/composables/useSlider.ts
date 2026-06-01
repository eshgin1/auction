export const useSlider = (totalSlides: number) => {
  const currentIndex = ref(0)
  const interval = 0

  const next = () => {
    currentIndex.value = (currentIndex.value + 1) % totalSlides
  }
  const prev = () => {
    currentIndex.value = (currentIndex.value - 1 + totalSlides) % totalSlides
  }
  const goTo = (index: number) => {
    currentIndex.value = index
  }

  const startAutoPlay = () => {
    setInterval(() => {
      next()
    }, 6000)
  }
  const stopAutoPlay = () => {
    if (interval) clearInterval(interval)
  }

  onMounted(() => {
    startAutoPlay()
  })
  onUnmounted(() => {
    stopAutoPlay()
  })

  return { currentIndex, next, prev, goTo }
}
