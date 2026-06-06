<template>
  <div>
    <SearchAndFilters :category="category" />
    <CatalogSort :sort-by="sortBy" :handle-sort="handleSort" />
    <LotGrid :search-query="searchText" :lots="items" :category="category" />
    <Pagination
      :total-pages="totalPages"
      :current-page="currentPage"
      @update:current-page="goToPage"
    />
  </div>
</template>

<script setup lang="ts">
// для поиска
const searchText = ref('')
const category = ref('Горячее')

const itemsPerPage = 8

const currentPage = ref(1)
const sortBy = ref('default')
const offset = computed(() => (currentPage.value - 1) * itemsPerPage)

const { items, total } = useLots(offset, itemsPerPage, sortBy)

// Общее количество страниц
const totalPages = computed(() => Math.ceil(total.value / itemsPerPage))

// Переход на страницу
const goToPage = (page: number) => {
  currentPage.value = page
}
const handleSort = (value: string) => {
  sortBy.value = value
  currentPage.value = 1
}
</script>
