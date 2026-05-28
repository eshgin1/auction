export default defineNuxtPlugin(async () => {
  // Запускаем worker только в режиме разработки
  if (import.meta.dev) {
    const { worker } = await import('~/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass', // не перехватывать запросы без моков
    })
    console.log('🧪 MSW worker запущен')
  }
})
