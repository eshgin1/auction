<template>
  <div class="pagination">
    <span
      v-for="page in totalPages"
      :key="page"
      class="page-btn"
      :class="{ active: currentPage === page }"
      @click="goToPage(page)"
    >
      {{ page }}
    </span>
    <!-- <span v-if="hasNext" class="page-btn" @click="nextPage">→</span> -->
  </div>
</template>

<script setup lang="ts">
defineProps({
  totalPages: Number,
  currentPage: Number,
})

const emit = defineEmits(['update:currentPage'])

const goToPage = (page: number) => {
  emit('update:currentPage', page)
}
</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 40px 0 32px;
  flex-wrap: wrap;
}
.page-btn {
  background: white;
  border: 1px solid #dee7ed;
  border-radius: 40px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}
</style>
