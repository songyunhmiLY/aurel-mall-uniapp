import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthSession } from '@/api/auth'
import { getToken, setToken } from '@/auth/session'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const userId = ref('')
  const nickname = ref('')
  const phone = ref('')
  const inviteCode = ref<string | null>(null)
  const member = ref(false)
  const authError = ref('')
  const avatarText = computed(() => nickname.value.slice(0, 1) || '客')

  function applySession(session: AuthSession) {
    token.value = session.token
    setToken(session.token)
    userId.value = session.user.id
    nickname.value = session.user.nickname
    phone.value = session.user.phone
    inviteCode.value = session.user.inviteCode
    member.value = session.user.member
    authError.value = ''
  }

  function clearSession() {
    token.value = ''
    setToken('')
    userId.value = ''
    nickname.value = ''
    phone.value = ''
    inviteCode.value = null
    member.value = false
  }

  function setAuthError(message: string) {
    authError.value = message
  }

  return {
    token,
    userId,
    nickname,
    phone,
    inviteCode,
    member,
    avatarText,
    authError,
    applySession,
    clearSession,
    setAuthError,
  }
})
