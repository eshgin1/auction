<template>
  <div class="search-section">
    <div class="search-bar">
      <i class="fas fa-search"></i>
      <input type="text" placeholder="Поиск..." v-model="searchQuery">
      <button @click="$emit('search', searchQuery)">Найти</button>
    </div>
    <div class="categories-mini">
      <span v-for="cat in categories" :key="cat.name" class="category-chip" :class="{ active: activeCategory === cat.name }" @click="$emit('filter', cat.name)">
        {{ cat.emoji }} {{ cat.name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const categories = [
  { name: 'Горячее', emoji: '🔥' },
  { name: 'Искусство', emoji: '🎨' },
  { name: 'Часы', emoji: '⌚' },
  { name: 'Фото', emoji: '📷' }
]
defineProps<{ activeCategory: string }>()
defineEmits<{ (e: 'search', q: string): void, (e: 'filter', cat: string): void }>()
</script>