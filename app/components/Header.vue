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
      <div v-if="isAuthenticated" class="user-profile">
        <i class="fas fa-user-astronaut"></i>
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-balance">{{ userBalance.toLocaleString() }} ₽</span>
        </div>
        <button class="logout-btn" title="Выйти" @click="logout">
          <i class="fas fa-sign-out-alt">Выход</i>
        </button>
      </div>
      <button v-else class="login-btn" @click="isAuthModalOpen = true">
        <i class="fas fa-key"></i> Вход / Регистрация
      </button>
    </div>
  </header>
  <AuthModal v-model:is-open="isAuthModalOpen" @login-success="onLoginSuccess" />
</template>

<script setup lang="ts">
const isAuthModalOpen = ref(false)

const isAuthenticated = ref(false)
const userName = ref('')
const userBalance = ref(0)
const userToken = ref<string | null>(null)

const { isDark, toggleTheme } = useTheme()

// Обработчик успешного входа
const onLoginSuccess = (token: string, user: {name: string, balance: number}) => {
  userToken.value = token
  userName.value = user.name || 'Пользователь'
  userBalance.value = user.balance || 0
  isAuthenticated.value = true
  isAuthModalOpen.value = false
}

// Выход из аккаунта
const logout = () => {
  isAuthenticated.value = false
  userName.value = ''
  userBalance.value = 0
  userToken.value = null
}
</script>

<style scoped>
.logout-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  border-radius: 20px;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
