<template>
  <div class="lot-page-container">
    <!-- Хлебные крошки -->
    <div class="breadcrumb">
      <a href="#">Главная</a> /
      <a href="#" @click.prevent="goToCatalog">Каталог</a> /
      <span>{{ lotData?.name }}</span>
    </div>

    <!-- Основная сетка: галерея + информация о лоте -->
    <div class="lot-detail-grid">
      <!-- Галерея -->
      <div class="gallery">
        <div class="main-image"></div>
        <div class="thumbnails">
          <div
            v-for="thumb in thumbnails"
            :key="thumb.id"
            class="thumb"
            :class="{ active: activeThumbId === thumb.id }"
            @click="setActiveThumb(thumb.id, thumb.icon)"
          ></div>
        </div>
      </div>

      <!-- Информация и форма ставки -->
      <div class="lot-info">
        <div class="category-badge">
          <i class="fas fa-camera"></i> {{ lotData?.category }}
        </div>
        <h1 class="lot-title">{{ lotData?.name }}</h1>
        <div class="seller">
          <i class="fas fa-store"></i>
          <span
            >Продавец: <strong>{{ lotData?.seller }}</strong></span
          >
        </div>

        <div class="bid-card">
          <div class="current-price">
            <span class="price-label">Текущая ставка</span>
            <span class="price-value"
              >{{ lotData?.startingPrice.toLocaleString() }} ₽</span
            >
          </div>
          <div class="min-bid">
            Минимальная следующая ставка:
            <strong>{{ lotData?.bidCount.toLocaleString() }} ₽</strong>
          </div>
          <div class="bid-input-group">
            <input
              v-model.number="bidAmount"
              type="number"
              :placeholder="`от ${nextMinBid.toLocaleString()} ₽`"
              step="1000"
            />
            <button class="btn-place-bid" @click="placeBid">
              <i class="fas fa-gavel"></i> Сделать ставку
            </button>
          </div>
          <div class="timer-block">
            <span class="timer-icon"
              ><i class="far fa-clock"></i> До завершения:</span
            >
            <span class="timer-digits">{{ timerText }}</span>
          </div>
          <div class="guarantee-text">
            <i class="fas fa-shield-alt"></i> Победитель получает проверенный
            лот + экспертное заключение
          </div>
        </div>
      </div>
    </div>

    <!-- Описание лота -->
    <div class="description-section">
      <div class="section-header">
        <h3><i class="fas fa-clipboard-list"></i> Описание лота</h3>
      </div>
      <p>{{ lotData?.description }}</p>
      <ul>
        <li><strong>Состояние:</strong> 9/10, незначительная патина</li>
        <li>
          <strong>Комплект:</strong> оригинальный чехол, крышка байонета,
          батарейка для экспонометра
        </li>
        <li><strong>Пробег плёнки:</strong> менее 70 рулонов</li>
        <li>
          <strong>Доставка:</strong> застрахованная, личная встреча в Москве/СПБ
        </li>
      </ul>
    </div>

    <!-- История ставок -->
    <div class="history-section">
      <div class="section-header">
        <h3><i class="fas fa-chart-line"></i> История ставок</h3>
        <span class="counter">{{ bidHistory.length }} ставок</span>
      </div>
      <table class="history-table">
        <thead>
          <tr>
            <th>Участник</th>
            <th>Ставка</th>
            <th>Дата / время</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bid, idx) in sortedHistory" :key="idx">
            <td><i class="fas fa-user-circle"></i> {{ bid.user }}</td>
            <td>
              <strong>{{ bid.amount.toLocaleString() }} ₽</strong>
            </td>
            <td>{{ bid.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Похожие лоты -->
    <div class="similar-section">
      <div class="section-header">
        <h3><i class="fas fa-layer-group"></i> Похожие лоты</h3>
        <a
          href="#"
          style="color: #6c5ce7; font-size: 0.8rem; text-decoration: none"
          >Все →</a
        >
      </div>
      <div class="similar-grid">
        <div class="similar-card">
          <i class="fas fa-watch"></i>
          <h4>Omega Speedmaster</h4>
          <div class="similar-price">142 000 ₽</div>
          <small>1 день</small>
        </div>
        <div class="similar-card">
          <i class="fas fa-crown"></i>
          <h4>Статуэтка "Венера"</h4>
          <div class="similar-price">89 000 ₽</div>
          <small>5 часов</small>
        </div>
        <div class="similar-card">
          <i class="fas fa-guitar"></i>
          <h4>Gibson Les Paul</h4>
          <div class="similar-price">210 000 ₽</div>
          <small>2 дня</small>
        </div>
      </div>
    </div>

    <!-- Всплывающее сообщение -->
    <div
      v-if="toastVisible"
      class="message-toast"
      :class="{ 'toast-error': toastIsError }"
    >
      {{ toastText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { ILotItem } from '~/types/lots'

const slug = useRoute().params.slug
const lotData = ref<ILotItem | null>(null)

const fetchData = async () => {
  try {
    const res = await fetch(`https://api.example.com/items/${slug}`)
    const data = await res.json()
    lotData.value = data
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchData()
})

// --- Реактивные данные ---
const currentPrice = ref(178000) // текущая цена
const bidStep = ref(5000) // шаг, будет пересчитываться после ставок
const bidAmount = ref(null) // сумма в поле ввода

// История ставок
const bidHistory = ref([
  { user: 'Mihail_Foto', amount: 178000, date: 'сегодня, 14:22' },
  { user: 'Alex_L', amount: 175000, date: 'сегодня, 13:05' },
  { user: 'RetroCollect', amount: 172000, date: 'сегодня, 11:47' },
  { user: 'Артём К.', amount: 170000, date: 'вчера, 19:12' },
])

// Время окончания (2 дня + 3 часа от текущего момента)
const endTime = ref(new Date())
endTime.value.setDate(endTime.value.getDate() + 2)
endTime.value.setHours(endTime.value.getHours() + 3)

// Таймер
let timerInterval = null
const timerText = ref('')

// Сообщения
const toastVisible = ref(false)
const toastText = ref('')
const toastIsError = ref(false)
let toastTimeout = null

// Тёмная тема
const isDark = ref(false)

// Галерея
const thumbnails = ref([
  { id: 1, icon: '<i class="fas fa-camera-retro"></i>', label: 'camera' },
  { id: 2, icon: '<i class="fas fa-camera"></i>', label: 'lens' },
  { id: 3, icon: '<i class="fas fa-suitcase"></i>', label: 'case' },
])
const activeThumbId = ref(1)
const activeIcon = ref(thumbnails.value[0].icon)

// --- Вычисляемые свойства ---
// Минимальная следующая ставка (текущая цена + шаг)
const nextMinBid = computed(() => currentPrice.value + bidStep.value)

// История, отсортированная по убыванию суммы
const sortedHistory = computed(() => {
  return [...bidHistory.value].sort((a, b) => b.amount - a.amount)
})

// --- Методы ---
function showMessage(text, isError = false) {
  if (toastTimeout) clearTimeout(toastTimeout)
  toastText.value = text
  toastIsError.value = isError
  toastVisible.value = true
  toastTimeout = setTimeout(() => {
    toastVisible.value = false
  }, 2500)
}

// Пересчёт шага ставки на основе текущей цены (5%, но не менее 3000 и не более 15000)
function updateBidStep() {
  let newStep = Math.floor(currentPrice.value * 0.05)
  newStep = Math.min(15000, Math.max(3000, newStep))
  bidStep.value = newStep
}

// Размещение ставки
function placeBid() {
  if (!bidAmount.value || bidAmount.value <= 0) {
    showMessage('Введите корректную сумму ставки', true)
    return
  }
  const bid = bidAmount.value
  if (bid < nextMinBid.value) {
    showMessage(
      `Минимальная ставка ${nextMinBid.value.toLocaleString()} ₽`,
      true,
    )
    return
  }

  // Добавляем ставку в историю
  const now = new Date()
  const timeStr = `сегодня, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  bidHistory.value.push({
    user: 'Артём К.',
    amount: bid,
    date: timeStr,
  })
  // Обновляем текущую цену
  currentPrice.value = bid
  // Пересчитываем шаг ставки
  updateBidStep()
  // Очищаем поле
  bidAmount.value = null
  showMessage(`Ставка ${bid.toLocaleString()} ₽ принята!`)

  // Имитация обновления баланса (уменьшаем на заблокированную сумму, но для демо просто вычитаем)
  // В реальном аукционе баланс не списывается сразу, но для эффекта:
  // userBalance.value -= bid (не делаем, чтобы баланс не ушёл в минус)
}

// Обновление таймера
function updateTimer() {
  const now = new Date().getTime()
  const distance = endTime.value.getTime() - now
  if (distance < 0) {
    timerText.value = 'АУКЦИОН ЗАВЕРШЁН'
    if (timerInterval) clearInterval(timerInterval)
    return
  }
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % 86400000) / 3600000)
  const minutes = Math.floor((distance % 3600000) / 60000)
  const seconds = Math.floor((distance % 60000) / 1000)
  let text = ''
  if (days > 0) text += `${days}д `
  text += `${hours.toString().padStart(2, '0')}ч ${minutes.toString().padStart(2, '0')}м ${seconds.toString().padStart(2, '0')}с`
  timerText.value = text
}

// Галерея
function setActiveThumb(id, iconHtml) {
  activeThumbId.value = id
  activeIcon.value = iconHtml
}

// Переход на каталог (демо)
function goToCatalog() {
  alert('(Демо) Переход на страницу каталога. Здесь должна быть навигация.')
  // В реальном проекте: navigateTo('/catalog')
}

// Инициализация темы из localStorage
function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.body.classList.add('dark-theme')
  } else {
    isDark.value = false
    document.body.classList.remove('dark-theme')
  }
}

// Жизненный цикл
onMounted(() => {
  initTheme()
  updateTimer()
  timerInterval = setInterval(updateTimer, 1000)
  updateBidStep() // начальная корректировка шага
})

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (toastTimeout) clearTimeout(toastTimeout)
})
</script>

<style>
/* ---------- Базовые стили (глобальные для страницы) ---------- */

.lot-page-container {
  width: 100%;
  padding: 0 16px;
  margin: 0 auto;
}

/* Шапка */
header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  gap: 12px;
}

body.dark-theme header {
  border-bottom-color: #2d3e52;
}

.logo a {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  text-decoration: none;
  color: inherit;
}

.logo span {
  color: #6c5ce7;
  font-weight: 500;
  background: #edebff;
  padding: 4px 10px;
  border-radius: 40px;
  font-size: 0.75rem;
  margin-left: 6px;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: inherit;
  font-weight: 500;
  font-size: 0.9rem;
}

.theme-toggle {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: inherit;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  padding: 5px 12px 5px 8px;
  border-radius: 100px;
  border: 1px solid #eaeef2;
}

body.dark-theme .user-profile {
  background: #1e2a3a;
  border-color: #2d3e52;
}

.user-profile i {
  font-size: 1rem;
  color: #6c5ce7;
  background: #f0efff;
  padding: 6px;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-weight: 600;
  font-size: 0.8rem;
}

.user-balance {
  font-size: 0.65rem;
  color: #5b6f82;
}

.user-balance span {
  font-weight: 600;
  color: #1e2b3c;
}

body.dark-theme .user-balance span {
  color: #e0e6ed;
}

/* Хлебные крошки */
.breadcrumb {
  font-size: 0.8rem;
  margin-bottom: 24px;
  color: #5b6f82;
}

.breadcrumb a {
  color: #6c5ce7;
  text-decoration: none;
}

/* Основная сетка */
.lot-detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 48px;
}

@media (min-width: 768px) {
  .lot-detail-grid {
    grid-template-columns: 1fr 1fr;
  }
  .lot-page-container {
    padding: 0 24px;
  }
}

@media (min-width: 1200px) {
  .lot-page-container {
    padding: 0 40px;
  }
}

/* Галерея */
.gallery {
  background: #ffffff;
  border-radius: 28px;
  border: 1px solid #f0f3f7;
  overflow: hidden;
  padding: 20px;
}

body.dark-theme .gallery {
  background: #1e2a3a;
  border-color: #2d3e52;
}

.main-image {
  background: #f2f5f9;
  border-radius: 24px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  color: #aab8c5;
  margin-bottom: 16px;
}

.thumbnails {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.thumb {
  background: #f2f5f9;
  border-radius: 16px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #8a9fb0;
  cursor: pointer;
  border: 2px solid transparent;
  transition: 0.2s;
}

.thumb.active {
  border-color: #6c5ce7;
  background: #edebff;
  color: #6c5ce7;
}

body.dark-theme .thumb {
  background: #2d3e52;
}

/* Информация о лоте */
.lot-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-badge {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #6c5ce7;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.lot-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.seller {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 60px;
  border: 1px solid #eaeef2;
  width: fit-content;
}

body.dark-theme .seller {
  background: #1e2a3a;
  border-color: #2d3e52;
}

.bid-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 24px;
  border: 1px solid #f0f3f7;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02);
}

body.dark-theme .bid-card {
  background: #1e2a3a;
  border-color: #2d3e52;
}

.current-price {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.price-label {
  font-size: 0.85rem;
  color: #5b6f82;
}

.price-value {
  font-size: 2rem;
  font-weight: 700;
}

.min-bid {
  font-size: 0.8rem;
  color: #5b6f82;
  margin-bottom: 20px;
  border-bottom: 1px dashed #dee7ed;
  padding-bottom: 12px;
}

.bid-input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.bid-input-group input {
  flex: 2;
  padding: 14px 18px;
  border-radius: 60px;
  border: 1px solid #dee7ed;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  background: white;
  transition: 0.2s;
}

body.dark-theme .bid-input-group input {
  background: #0f1722;
  border-color: #2d3e52;
  color: #e9edf2;
}

.bid-input-group input:focus {
  outline: none;
  border-color: #6c5ce7;
}

.btn-place-bid {
  background: #6c5ce7;
  border: none;
  color: white;
  padding: 0 28px;
  border-radius: 60px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.2s;
}

.btn-place-bid:hover {
  background: #5649c0;
  transform: scale(0.97);
}

.timer-block {
  background: #f0f2f6;
  border-radius: 60px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

body.dark-theme .timer-block {
  background: #2d3e52;
}

.timer-digits {
  font-weight: 700;
  font-family: monospace;
  font-size: 1.2rem;
  letter-spacing: 1px;
}

.guarantee-text {
  font-size: 0.7rem;
  margin-top: 12px;
  color: #5b6f82;
}

/* Описание, история, похожие */
.description-section,
.history-section,
.similar-section {
  background: #ffffff;
  border-radius: 28px;
  padding: 28px;
  margin-bottom: 32px;
  border: 1px solid #f0f3f7;
}

body.dark-theme .description-section,
body.dark-theme .history-section,
body.dark-theme .similar-section {
  background: #1e2a3a;
  border-color: #2d3e52;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.section-header h3 {
  font-weight: 600;
  font-size: 1.3rem;
}

.description-section p {
  margin-bottom: 16px;
  line-height: 1.5;
}

.description-section ul {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  text-align: left;
  padding: 12px 6px;
  border-bottom: 1px solid #eef2f7;
  font-size: 0.85rem;
}

body.dark-theme .history-table td,
body.dark-theme .history-table th {
  border-bottom-color: #2d3e52;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 8px;
}

.similar-card {
  background: #f8fafd;
  border-radius: 20px;
  padding: 14px;
  border: 1px solid #eef2f7;
  transition: 0.2s;
}

body.dark-theme .similar-card {
  background: #0f1722;
  border-color: #2d3e52;
}

.similar-card i {
  font-size: 2rem;
  color: #8a9fb0;
  margin-bottom: 8px;
  display: block;
}

.similar-card h4 {
  font-weight: 600;
  font-size: 0.9rem;
}

.similar-price {
  font-weight: 600;
  color: #6c5ce7;
  font-size: 0.8rem;
  margin-top: 6px;
}

/* Футер */
footer {
  padding: 32px 0 40px;
  border-top: 1px solid #dfe7ef;
  font-size: 0.8rem;
  color: #6b7f94;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

footer > div:last-child {
  display: flex;
  gap: 24px;
}

footer a {
  color: inherit;
  text-decoration: none;
}

/* Всплывающее сообщение */
.message-toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #1e2b3c;
  color: white;
  padding: 12px 20px;
  border-radius: 60px;
  font-size: 0.85rem;
  z-index: 1000;
  transition: opacity 0.3s;
  opacity: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

body.dark-theme .message-toast {
  background: #6c5ce7;
}

.toast-error {
  background: #d14545;
}
</style>
