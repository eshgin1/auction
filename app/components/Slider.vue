<template>
  <section class="slider-section">
    <div class="slider-container">
      <div class="slider-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(slide, idx) in lotsForSlider" :key="slide.id" class="slider-card">
          <div class="slider-content">
            <div class="slider-label">{{ slide.category }}</div>
            <div class="slider-title">{{ slide.name }}</div>
            <div class="slider-desc">{{ slide.description }}</div>
            <div class="slider-price">
              <span class="slider-current">{{ slide.currentPrice }} <small>₽</small></span>
              <span class="slider-time"><i class="far fa-clock"></i> {{ slide.endTime }}</span>
            </div>
          </div>
          <div class="slider-image">
            <i :class="slide.id"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="slider-controls">
      <button class="slider-btn" @click="prev"><i class="fas fa-arrow-left"></i></button>
      <button class="slider-btn" @click="next"><i class="fas fa-arrow-right"></i></button>
    </div>
    <div class="slider-dots">
      <span v-for="n in lotsForSlider.length" :key="n" class="dot" :class="{ active: currentIndex === n-1 }" @click="goTo(n-1)"></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ILotItem } from '~/types/lots';
const props = defineProps<{lots: ILotItem[]}>()

const lotsForSlider = computed(() => {
  
  const activeLots = props.lots?.filter(lot => lot.status === 'active');
  if (activeLots.length <= 4) return activeLots;
  return activeLots.toSorted(() => Math.random() - 0.5).slice(0, 3);
});
const { currentIndex, next, prev, goTo } = useSlider(lotsForSlider.value.length)
</script>