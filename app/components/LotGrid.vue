<template>
  <div>
    <div class="section-title">
      <h2>Активные лоты</h2>
      <a href="#">Все →</a>
    </div>
    <div class="card-grid">
      <LotCard v-for="lot in lotsPreview" :key="lot.id" :item="lot" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LotCard from './LotCard.vue';
export interface IAuctionItem {
  id: string;     
  name: string;    
  description: string;  
  category: string;
  startingPrice: number;
  currentPrice: number;  
  bidCount: number;
  endTime: string;
  status: 'active' | 'closed' | 'cancelled';
  seller: string;
}
const props = defineProps<{ search: string, category: string }>()
const { data, pending, error } = useFetch<IAuctionItem[]>('https://api.example.com/catalog', {
  server: false,
});
const lots = computed(() => data.value ?? []);
const lotsPreview = computed(() => {
  const activeLots = lots.value.filter(lot => lot.status === 'active');
  if (activeLots.length <= 4) return activeLots;
  return activeLots.sort(() => Math.random() - 0.5).slice(0, 4);
});
</script>