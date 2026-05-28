<template>
    <div>
        <SearchAndFilters />
        <CatalogSort/>
        <LotGrid :lots="items"/>
        <Pagination 
            :totalPages="totalPages" 
            :currentPage="currentPage"
            @update:currentPage="goToPage"
        />
    </div>
</template>

<script setup lang="ts">
const itemsPerPage = 8

const currentPage = ref(1)

const offset = computed(() => (currentPage.value - 1) * itemsPerPage)

const { items, total } = useLots(offset, itemsPerPage)

// Общее количество страниц
const totalPages = computed(() => Math.ceil(total.value / itemsPerPage))

// Переход на страницу
const goToPage = (page: number) => {
  currentPage.value = page
}
</script>