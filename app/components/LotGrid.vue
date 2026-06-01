<template>
  <div>
    <div class="section-title">
      <h2>Активные лоты</h2>
      <NuxtLink to="/auction">Все →</NuxtLink>
    </div>
    <div class="card-grid">
      <LotCard v-for="lot in props.lots" :key="lot.id" :item="lot" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ILotItem } from '~/types/lots'
import LotCard from './LotCard.vue'
const props = defineProps<{
  searchQuery: string
  category: string
  lots: ILotItem[]
}>()
</script>
