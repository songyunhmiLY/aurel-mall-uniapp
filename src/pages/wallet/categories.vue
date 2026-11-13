<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { fetchWithdrawableCategories } from '@/api/wallet'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { yuanFen } from '@/demo/format'
import { openPage, routes, withQuery } from '@/navigation/routes'
import type { WithdrawalCategorySnapshot } from '@/types/wallet'

const snapshot = ref<WithdrawalCategorySnapshot | null>(null)
const loaded = ref(false)
const errorText = ref('')

onShow(() => {
  void load()
})

async function load() {
  errorText.value = ''
  try {
    snapshot.value = await fetchWithdrawableCategories()
  } catch (error) {
    snapshot.value = null
    errorText.value = sessionErrorMessage(error, '分类加载失败')
  } finally {
    loaded.value = true
  }
}

function openCategory(displayName: string) {
  openPage(withQuery(routes.ledger, { displayName }))
}
</script>

<template>
  <AppFrame title="可提现分类">
    <view v-if="errorText" class="pad">
      <view class="notice">{{ errorText }}</view>
    </view>
    <view v-else-if="snapshot" class="pad">
      <view class="card card-pad">
        <view class="kv">
          <text class="k">可用</text>
          <text class="v fw-6">{{ yuanFen(snapshot.availableFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">余额</text>
          <text class="v">{{ yuanFen(snapshot.balanceFen) }}</text>
        </view>
        <view class="kv">
          <text class="k">冻结</text>
          <text class="v">{{ yuanFen(snapshot.frozenFen) }}</text>
        </view>
      </view>
      <text class="hint mt-12"
        >分类名称以系统返回为准，相同名称会合成一项。点按查看该分类流水。</text
      >
      <view v-if="!snapshot.categories.length" class="empty">
        <view class="empty__title">暂无分类</view>
      </view>
      <view v-for="item in snapshot.categories" :key="item.displayName" class="list-group mt-12">
        <view class="list-cell hit" @click="openCategory(item.displayName)">
          <text class="cell-body fw-6">{{ item.displayName }}</text>
          <text class="fw-6">{{ yuanFen(item.totalFen) }}</text>
          <view class="chevron" />
        </view>
      </view>
    </view>
    <view v-else-if="loaded" class="empty">
      <view class="empty__title">暂无分类</view>
    </view>
  </AppFrame>
</template>
