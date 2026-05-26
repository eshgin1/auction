<template>
  <div class="lot-card">
    <div class="card-img"><i :class="item.icon"></i></div>
    <div class="card-category">{{ item.category }}</div>
    <h3>{{ item.title }}</h3>
    <div class="lot-desc">{{ item.desc }}</div>
    <div class="price-row">
      <span class="bid-value">{{ item.price }} <small>₽</small></span>
      <span class="time-left">{{ item.timeLeft }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ item: any }>()
</script>