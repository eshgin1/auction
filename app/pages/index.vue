<template>
  <div>
    <Slider />
    <SearchAndFilters v-model:activeCategory="activeCategory" @search="searchQuery = $event" @filter="activeCategory = $event" />
    <LotGrid  :category="activeCategory" :search="searchQuery"/>
    <InternalLinks />
    <CabinetPreview />
  </div>
</template>

<script setup lang="ts">
import LotGrid from '~/components/LotGrid.vue';

const searchQuery = ref('')
const activeCategory = ref('Горячее')
</script>