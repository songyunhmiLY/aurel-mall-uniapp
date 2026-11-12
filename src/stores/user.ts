import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getToken, setToken } from '@/auth/session'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const nickname = ref('访客')
  const avatarText = computed(() => nickname.value.slice(0, 1) || '客')

  function applyNickname(value: string) {
    const next = value.trim()
    if (next) nickname.value = next
  }

  function updateToken(value: string) {
    token.value = value
    setToken(value)
  }

  return { token, nickname, avatarText, applyNickname, updateToken }
})
