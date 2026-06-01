<template>
  <div>
    <Slider :lots="items" />
    <SearchAndFilters :category="category" />
    <LotGrid :lots="items" :category="category" :search-query="searchText" />
  </div>
</template>

<script setup lang="ts">
import LotGrid from '~/components/LotGrid.vue'
const searchText = ref('')
const category = ref('Горячее')

const itemsPerPage = 4

const currentPage = ref(1)
const offset = computed(() => (currentPage.value - 1) * itemsPerPage)

const { items } = useLots(offset, itemsPerPage)
</script>
