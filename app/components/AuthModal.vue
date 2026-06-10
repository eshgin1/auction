<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal-overlay"
      @click.self="closeModal"
      @keydown.esc="closeModal"
    >
      <div class="auth-modal">
        <div v-if="step === 1">
          <h3>Вход по номеру телефона</h3>
          <div class="step-desc">Введите номер, мы пришлём SMS-код</div>
          <div class="auth-input-group">
            <input
              v-model="phone"
              type="tel"
              placeholder="+7 900 123-45-67"
              :disabled="isLoading"
              @keyup.enter="sendCode"
            />
          </div>
          <button class="auth-btn" :disabled="isLoading" @click="sendCode">
            {{ isLoading ? 'Отправка...' : 'Отправить код' }}
          </button>
          <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>
        </div>
        <div v-else-if="step === 2">
          <h3>Подтверждение</h3>
          <div class="step-desc">
            Код из SMS отправлен на <strong>{{ formattedPhone }}</strong>
          </div>
          <div class="auth-input-group">
            <input
              v-model="pin"
              type="text"
              placeholder="Введите 4-значный код"
              maxlength="4"
              :disabled="isLoading"
              @keyup.enter="sendPin"
            />
          </div>
          <button class="auth-btn" :disabled="isLoading" @click="sendPin">
            {{ isLoading ? 'Проверка...' : 'Подтвердить' }}
          </button>
          <button
            class="back-step"
            :disabled="isLoading"
            @click="goBackToPhone"
          >
            ← изменить номер
          </button>
          <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>
        </div>
        <div v-else-if="step === 3">
          <h3>✅ Успешный вход</h3>
          <div class="step-desc">
            Добро пожаловать, {{ user?.name || 'пользователь' }}!
          </div>
          <button class="auth-btn" @click="closeModal">Закрыть</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type {
  CreateCodeResponse,
  GetUserResponse,
  ValidCodeResponse,
} from '~/types/auth'

// Пропсы и эмиты
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'loginSuccess', token: string, user: {name: string}): void
}>()

// Реактивные данные
const step = ref<1 | 2 | 3>(1)
const phone = ref('+79001234567')
const pin = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const token = ref<string | null>(null)
const user = ref<{name: string} | null>(null)

const formattedPhone = computed(() => phone.value)

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      resetState()
    }
  },
)

const resetState = () => {
  step.value = 1
  phone.value = '+79001234567'
  pin.value = '1111'
  isLoading.value = false
  errorMessage.value = ''
  token.value = null
  user.value = null
}

// Закрытие модалки
const closeModal = () => {
  emit('update:isOpen', false)
  resetState()
}

// Переход назад к номеру
const goBackToPhone = () => {
  step.value = 1
  errorMessage.value = ''
}

// Отправка кода
const sendCode = async () => {
  errorMessage.value = ''
  const cleanedPhone = phone.value.replace(/\D/g, '')
  if (!cleanedPhone.startsWith('7') || cleanedPhone.length !== 11) {
    errorMessage.value = 'Введите номер в формате +7XXXXXXXXXX'
    return
  }

  isLoading.value = true
  try {
    const res = await $fetch<CreateCodeResponse>(
      'https://api.example.com/createcode',
      {
        method: 'POST',
        body: { phone: cleanedPhone },
      },
    )

    if (res.status) {
      if (res.newClient) {
        console.log('Новый клиент, можно запросить доп. данные')
      }
      // Переход на шаг ввода кода
      step.value = 2
    } else {
      errorMessage.value = res.message || 'Ошибка отправки кода'
    }
  } catch (err: unknown) {
    console.error(err)
    errorMessage.value = 'Серверная ошибка, попробуйте позже'
  } finally {
    isLoading.value = false
  }
}

const sendPin = async () => {
  errorMessage.value = ''
  isLoading.value = true
  try {
    const res = await $fetch<ValidCodeResponse>(
      'https://api.example.com/validcode',
      {
        method: 'POST',
        body: {
          phone: phone.value.replace(/\D/g, ''),
          pin: Number(pin.value),
        },
      },
    )

    if (res.status) {
      token.value = res.token
      await getUserInfo(res.token)
    } else {
      errorMessage.value = res.message || 'Неверный код'
    }
  } catch (err: unknown) {
    console.error(err)
    errorMessage.value = 'Ошибка проверки кода'
  } finally {
    isLoading.value = false
  }
}

// Получение данных пользователя
const getUserInfo = async (authToken: string) => {
  try {
    const res = await $fetch<GetUserResponse>(
      'https://api.example.com/getuser',
      {
        method: 'POST',
        body: { token: authToken },
      },
    )

    if (res.status && res.user) {
      user.value = res.user
      step.value = 3

      emit('loginSuccess', authToken, res.user)
    } else {
      errorMessage.value = res.message || 'Ошибка получения данных пользователя'
      step.value = 1
    }
  } catch (err: unknown) {
    console.error(err)
    errorMessage.value = 'Ошибка загрузки профиля'
    step.value = 1
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  transition: 0.2s;
}
.modal-overlay.active {
  visibility: visible;
  opacity: 1;
}
.auth-modal {
  background: #ffffff;
  border-radius: 32px;
  max-width: 420px;
  width: 90%;
  padding: 28px 24px;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.2s;
}
body.dark-theme .auth-modal {
  background: #1e2a3a;
  border-color: #2d3e52;
}
.auth-modal h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
}
.auth-modal .step-desc {
  font-size: 0.8rem;
  color: #5b6f82;
  margin-bottom: 24px;
}
.auth-input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
.auth-input-group input {
  padding: 14px 18px;
  border-radius: 60px;
  border: 1px solid #dee7ed;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  background: white;
}
body.dark-theme .auth-input-group input {
  background: #0f1722;
  border-color: #2d3e52;
  color: #e9edf2;
}
.auth-btn {
  background: #6c5ce7;
  border: none;
  color: white;
  padding: 12px 0;
  border-radius: 60px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.2s;
}
.auth-btn:hover {
  background: #5649c0;
}
.back-step {
  background: none;
  border: none;
  color: #6c5ce7;
  margin-top: 12px;
  cursor: pointer;
  font-size: 0.8rem;
}
.error-msg {
  color: #e25c5c;
  font-size: 0.75rem;
  margin-top: 8px;
}
</style>
