<template>
  <header>
    <div class="logo">
      <a href="#">minimal<span>auction</span></a>
    </div>
    <div class="nav-links">
      <a href="#">Аукционы</a>
      <a href="#">Категории</a>
      <button class="theme-toggle" @click="toggleTheme" aria-label="Тема">
        <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
      <div class="user-profile">
        <i class="fas fa-user-astronaut"></i>
        <div class="user-info">
          <span class="user-name">Артём К.</span>
          <span class="user-balance"><span>12 430 ₽</span></span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>