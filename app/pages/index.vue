<template>
  <div>
    <Slider :lots="items" />
    <SearchAndFilters
      v-model:active-category="activeCategory"
      @search="searchQuery = $event"
      @filter="activeCategory = $event"
    />
    <LotGrid :lots="items" :category="activeCategory" :search="searchQuery" />
  </div>
</template>

<script setup lang="ts">
import LotGrid from '~/components/LotGrid.vue'
const searchQuery = ref('')
const activeCategory = ref('Горячее')
const { items } = useLots(0, 4)
</script>
