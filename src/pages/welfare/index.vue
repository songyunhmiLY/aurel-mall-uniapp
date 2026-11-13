<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchWelfareEntry, fetchWelfareStatus, signupWelfare } from '@/api/welfare'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { useUserStore } from '@/stores/user'
import type { WelfareEntry, WelfareStatus } from '@/types/welfare'

const user = useUserStore()
const entry = ref<WelfareEntry | null>(null)
const status = ref<WelfareStatus | null>(null)
const loaded = ref(false)
const pending = ref(false)
const errorText = ref('')
let requestId = 0

const hint = computed(() => {
  const current = status.value
  if (!current || errorText.value) return ''
  if (current.signedUpToday) return '今日已报名。'
  if (current.eligible) return '点击即报名。'
  return ''
})

onShow(() => {
  if (!user.token) return
  void load()
})

async function load() {
  const id = ++requestId
  errorText.value = ''
  try {
    const [nextStatus, nextEntry] = await Promise.all([
      fetchWelfareStatus(),
      fetchWelfareEntry().catch(() => null),
    ])
    if (id !== requestId) return
    status.value = nextStatus
    if (nextEntry) entry.value = nextEntry
  } catch (error) {
    if (id !== requestId) return
    status.value = null
    errorText.value = sessionErrorMessage(error, '福利专场加载失败')
  } finally {
    if (id === requestId) loaded.value = true
  }
}

async function sign() {
  const current = status.value
  if (pending.value || !current?.eligible || current.signedUpToday) return
  pending.value = true
  const id = ++requestId
  errorText.value = ''
  try {
    const next = await signupWelfare()
    if (id !== requestId) return
    status.value = next
    if (next.signedUpToday) uni.showToast({ title: '今日已报名', icon: 'none' })
  } catch (error) {
    if (id !== requestId) return
    const message = sessionErrorMessage(error, '报名未完成')
    if (message.includes('不具备资格')) {
      status.value = { eligible: false, signedUpToday: current.signedUpToday }
    }
    errorText.value = message
    uni.showToast({ title: message, icon: 'none' })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AppFrame title="福利专场">
    <image v-if="entry?.imageUrl" class="welfare-cover" :src="entry.imageUrl" mode="aspectFill" />
    <view class="welfare-hero">
      <text class="home-kicker">WELFARE</text>
      <text class="hero-title">福利专场</text>
      <text v-if="entry?.copy" class="welfare-copy">{{ entry.copy }}</text>
    </view>
    <view v-if="errorText" class="pad">
      <view class="notice">{{ errorText }}</view>
    </view>
    <view v-if="!loaded" class="empty">
      <view class="empty__title">正在读取</view>
    </view>
    <template v-else-if="status">
      <view class="welfare-status">
        <view class="ws-row">
          <text>
            <text class="dot-mark" :class="status.eligible ? 'dot-ok' : 'dot-off'" />参与资格
          </text>
          <text class="fw-6">{{ status.eligible ? '已具备' : '不具备资格' }}</text>
        </view>
        <view class="ws-row">
          <text>
            <text class="dot-mark" :class="status.signedUpToday ? 'dot-gold' : 'dot-off'" />当天报名
          </text>
          <text class="fw-6">{{ status.signedUpToday ? '已报名' : '未报名' }}</text>
        </view>
      </view>
      <view class="pad">
        <view v-if="status.signedUpToday" class="btn btn-ghost btn-block">已报名</view>
        <view v-else-if="!status.eligible" class="btn btn-gold btn-block is-disabled">抢红包</view>
        <view
          v-else
          class="btn btn-gold btn-block"
          :class="pending ? 'is-disabled' : 'hit'"
          @click="sign"
          >抢红包</view
        >
        <text v-if="hint" class="hint center mt-12">{{ hint }}</text>
      </view>
    </template>
  </AppFrame>
</template>
