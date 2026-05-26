export default defineNuxtPlugin(async () => {
  // Запускаем worker только в режиме разработки
  if (process.dev) {
    const { worker } = await import('~/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass', // не перехватывать запросы без моков
    })
    console.log('🧪 MSW worker запущен')
  }
})