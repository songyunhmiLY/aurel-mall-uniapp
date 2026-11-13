import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthSession } from '@/api/auth'
import { getToken, setToken } from '@/auth/session'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const userId = ref('')
  const nickname = ref('')
  const authError = ref('')
  const avatarText = computed(() => nickname.value.slice(0, 1) || '客')

  function applySession(session: AuthSession) {
    token.value = session.token
    setToken(session.token)
    userId.value = session.user.id
    if (session.user.nickname) nickname.value = session.user.nickname
    authError.value = ''
  }

  function clearSession() {
    token.value = ''
    setToken('')
    userId.value = ''
    nickname.value = ''
  }

  function setAuthError(message: string) {
    authError.value = message
  }

  return {
    token,
    userId,
    nickname,
    avatarText,
    authError,
    applySession,
    clearSession,
    setAuthError,
  }
})
