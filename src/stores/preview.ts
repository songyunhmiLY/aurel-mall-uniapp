import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { guestProfile, memberProfile, nonMemberProfile, type PreviewProfile } from '@/demo/profile'
import {
  readConsumeOverride,
  readPayPassword,
  readRole,
  writeConsumeOverride,
  writePayPassword,
  writeRole,
  type PreviewRole,
} from '@/demo/preview-session'

export const usePreviewStore = defineStore('preview', () => {
  const role = ref<PreviewRole>(readRole())
  const nameOverride = ref('')
  const payPassword = ref(readPayPassword())
  const consumeOverride = ref<number | null>(readConsumeOverride())

  const loggedIn = computed(() => role.value !== 'guest')
  const isMember = computed(() => role.value === 'member')

  const profile = computed<PreviewProfile>(() => {
    if (role.value === 'guest') return guestProfile
    if (role.value === 'nonmember') return nonMemberProfile
    return {
      ...memberProfile,
      name: nameOverride.value || memberProfile.name,
      consume: consumeOverride.value == null ? memberProfile.consume : consumeOverride.value,
    }
  })

  const avatarText = computed(() => (profile.value.name || '客').slice(0, 1))

  function setRole(next: PreviewRole) {
    role.value = next
    writeRole(next)
    if (next !== 'member') {
      consumeOverride.value = null
      writeConsumeOverride(null)
    }
  }

  function applyNickname(value: string) {
    const next = value.trim()
    if (next) nameOverride.value = next
  }

  function setPayPassword(value: string) {
    payPassword.value = value
    writePayPassword(value)
  }

  function spendConsume(amount: number) {
    if (!isMember.value) return
    const next = Math.max(0, +(profile.value.consume - amount).toFixed(2))
    consumeOverride.value = next
    writeConsumeOverride(next)
  }

  return {
    role,
    loggedIn,
    isMember,
    profile,
    avatarText,
    payPassword,
    setRole,
    applyNickname,
    setPayPassword,
    spendConsume,
  }
})
