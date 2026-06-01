<template>
  <div class="sort-bar">
    <select v-model="selected" class="sort-select" @change="handleSortChange">
      <option value="default">Сортировать: по умолчанию</option>
      <option value="price_asc">Сначала дешевле</option>
      <option value="price_desc">Сначала дороже</option>
      <option value="ending_soon">Завершаются первыми</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  handleSort: (value: string) => void
  sortBy: string
}>()

const selected = ref('default')

const handleSortChange = () => {
  console.log(selected.value)

  props.handleSort(selected.value)
}
</script>

<style>
.sort-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
.sort-select {
  background: white;
  border: 1px solid #dee7ed;
  border-radius: 40px;
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #2b3f55;
}
</style>
