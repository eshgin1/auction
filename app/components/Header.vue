<template>
  <header>
    <div class="logo">
      <NuxtLink to="/">minimal<span>auction</span></NuxtLink>
    </div>
    <div class="nav-links">
      <NuxtLink to="/auction">Аукционы</NuxtLink>
      <a href="#">Категории</a>
      <button class="theme-toggle" aria-label="Тема" @click="toggleTheme">
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
