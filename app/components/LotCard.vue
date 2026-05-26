<template>
  <div class="lot-card">
    <div class="card-img"><i :class="item.id"></i></div>
    <div class="card-category">{{ item.category }}</div>
    <h3>{{ item.name }}</h3>
    <div class="lot-desc">{{ item.description }}</div>
    <div class="price-row">
      <span class="bid-value">{{ item.currentPrice }} <small>₽</small></span>
      <!-- <span class="time-left">{{ item.timeLeft }}</span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAuctionItem } from './LotGrid.vue';
defineProps<{ item: IAuctionItem }>()
</script>