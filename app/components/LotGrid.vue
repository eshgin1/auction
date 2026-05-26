<template>
  <div>
    <div class="section-title">
      <h2>Завершаются сегодня</h2>
      <a href="#">Все →</a>
    </div>
    <div class="card-grid">
      <LotCard v-for="lot in filteredLots" :key="lot.id" :item="lot" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LotCard from './LotCard.vue';

const props = defineProps<{ search: string, category: string }>()

const lots = ref([
  { id: 1, category: 'Фото', title: 'Leica M6', desc: 'Классический дальномер, 1995', price: '178 000', timeLeft: '2ч 15м', icon: 'fas fa-camera-retro' },
  { id: 2, category: 'Часы', title: 'Omega Seamaster', desc: 'Автомат, отличное состояние', price: '94 000', timeLeft: '5ч 30м', icon: 'fas fa-watch' },
  { id: 3, category: 'Искусство', title: 'Без названия, 1962', desc: 'Холст, масло', price: '320 000', timeLeft: '1ч 10м', icon: 'fas fa-paint-brush' },
  { id: 4, category: 'Музыка', title: 'Fender Strat', desc: 'США, 2008, кейс', price: '67 000', timeLeft: '12ч 00м', icon: 'fas fa-guitar' }
])

const filteredLots = computed(() => {
  return lots.value.filter(lot => {
    const matchSearch = props.search === '' || lot.title.toLowerCase().includes(props.search.toLowerCase()) || lot.desc.toLowerCase().includes(props.search.toLowerCase())
    const matchCategory = props.category === 'Горячее' || props.category === '' || lot.category === props.category
    return matchSearch && matchCategory
  })
})
</script>