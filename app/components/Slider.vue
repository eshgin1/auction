<template>
  <section class="slider-section">
    <div class="slider-container">
      <div class="slider-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(slide, idx) in slides" :key="idx" class="slider-card">
          <div class="slider-content">
            <div class="slider-label">{{ slide.label }}</div>
            <div class="slider-title">{{ slide.title }}</div>
            <div class="slider-desc">{{ slide.desc }}</div>
            <div class="slider-price">
              <span class="slider-current">{{ slide.price }} <small>₽</small></span>
              <span class="slider-time"><i class="far fa-clock"></i> {{ slide.time }}</span>
            </div>
          </div>
          <div class="slider-image">
            <i :class="slide.icon"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="slider-controls">
      <button class="slider-btn" @click="prev"><i class="fas fa-arrow-left"></i></button>
      <button class="slider-btn" @click="next"><i class="fas fa-arrow-right"></i></button>
    </div>
    <div class="slider-dots">
      <span v-for="n in total" :key="n" class="dot" :class="{ active: currentIndex === n-1 }" @click="goTo(n-1)"></span>
    </div>
  </section>
</template>

<script setup lang="ts">
const slides = [
  { label: 'Топ лот', title: 'Leica M6', desc: 'Черный хром, полностью механическая, 1995 год.', price: '278 000', time: '2ч 15м', icon: 'fas fa-camera-retro' },
  { label: 'Эксклюзив', title: 'Patek Philippe', desc: 'Винтаж, механизм в идеале, 1940-е.', price: '1 420 000', time: '5ч 40м', icon: 'fas fa-clock' },
  { label: 'Искусство', title: 'Уорхол', desc: 'Банки с супом, шелкография.', price: '980 000', time: '1д 6ч', icon: 'fas fa-paint-brush' }
]
const total = slides.length
const { currentIndex, next, prev, goTo } = useSlider(total)
</script>