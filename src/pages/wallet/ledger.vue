<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchCategoryLedger, fetchWalletLedger } from '@/api/wallet'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { formatInstant, yuanFen } from '@/demo/format'
import {
  ledgerBizLabel,
  ledgerDirectionLabel,
  ledgerTitle,
  signedLedgerAmount,
} from '@/wallet/labels'
import { isWalletType, type WalletLedgerEntry, type WalletType } from '@/types/wallet'

const walletType = ref<WalletType | ''>('')
const displayName = ref('')
const items = ref<WalletLedgerEntry[]>([])
const total = ref(0)
const page = ref(1)
const loaded = ref(false)
const loading = ref(false)
const errorText = ref('')

const title = computed(() =>
  displayName.value ? displayName.value : walletType.value ? ledgerTitle(walletType.value) : '流水',
)
const hasMore = computed(() => items.value.length < total.value)

onLoad((query) => {
  const requestedType = readQuery(query?.walletType)
  const requestedName = readQuery(query?.displayName)
  displayName.value = requestedName
  walletType.value = isWalletType(requestedType) ? requestedType : ''
})

onShow(() => {
  void reload()
})

async function reload() {
  page.value = 1
  items.value = []
  total.value = 0
  await load(1, false)
}

async function load(nextPage: number, append: boolean) {
  if (loading.value) return
  if (!displayName.value && !walletType.value) {
    loaded.value = true
    errorText.value = '流水不存在'
    return
  }
  loading.value = true
  errorText.value = ''
  try {
    const result = displayName.value
      ? await fetchCategoryLedger(displayName.value, nextPage, 20)
      : await fetchWalletLedger(walletType.value as WalletType, nextPage, 20)
    items.value = append ? items.value.concat(result.items) : result.items
    total.value = result.total
    page.value = result.page
  } catch (error) {
    if (!append) items.value = []
    errorText.value = sessionErrorMessage(error, '流水加载失败')
  } finally {
    loading.value = false
    loaded.value = true
  }
}

function readQuery(value: unknown): string {
  if (typeof value !== 'string') return ''
  try {
    return decodeURIComponent(value).trim()
  } catch {
    return value.trim()
  }
}
</script>

<template>
  <AppFrame :title="title">
    <view v-if="errorText" class="pad">
      <view class="notice">{{ errorText }}</view>
    </view>
    <view v-if="loaded && !items.length && !errorText" class="empty">
      <view class="empty__title">暂无流水</view>
    </view>
    <view class="pad">
      <view v-for="item in items" :key="item.id" class="card card-pad mb-12">
        <view class="row-between">
          <text class="fw-6">{{ ledgerBizLabel(item.bizType) }}</text>
          <text class="fw-6">{{ signedLedgerAmount(item.direction, item.amountFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">方向</text>
          <text class="v">{{ ledgerDirectionLabel(item.direction) }}</text>
        </view>
        <view class="kv">
          <text class="k">余额</text>
          <text class="v">{{ yuanFen(item.balanceAfterFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">关联编号</text>
          <text class="v">{{ item.bizId }}</text>
        </view>
        <view class="kv">
          <text class="k">时间</text>
          <text class="v">{{ formatInstant(item.occurredAt) }}</text>
        </view>
      </view>
      <view v-if="hasMore" class="btn btn-ghost btn-block hit" @click="load(page + 1, true)">
        {{ loading ? '加载中' : '加载更多' }}
      </view>
    </view>
  </AppFrame>
</template>
