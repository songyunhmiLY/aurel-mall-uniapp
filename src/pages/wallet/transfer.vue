<script setup lang="ts">
import { computed, ref } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'
import LockPanel from '@/components/common/LockPanel.vue'
import { money } from '@/demo/format'
import { transferPeer } from '@/demo/profile'
import { openPage, routes } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const memberId = ref('')
const amount = ref('')
const sheet = ref(false)
const password = ref('')
const payeeName = ref('')

const balance = computed(() => preview.profile.consume)

function openConfirm() {
  if (!preview.isMember) return
  const id = memberId.value.trim().toUpperCase()
  if (!id) {
    uni.showToast({ title: '请输入对方会员 ID', icon: 'none' })
    return
  }
  if (id === preview.profile.memberId) {
    uni.showToast({ title: '不能转给自己', icon: 'none' })
    return
  }
  if (id !== transferPeer.memberId) {
    uni.showToast({ title: '未找到该会员，或对方还不是会员，无法转入', icon: 'none' })
    return
  }
  const value = Number(amount.value)
  if (!amount.value || !Number.isFinite(value) || value <= 0) {
    uni.showToast({ title: '请输入正确的转出金额', icon: 'none' })
    return
  }
  if (value > balance.value + 1e-9) {
    uni.showToast({ title: '不能超过消费账户可用余额', icon: 'none' })
    return
  }
  if (!preview.payPassword) {
    uni.showToast({ title: '请先在设置中设置支付密码', icon: 'none' })
    return
  }
  payeeName.value = transferPeer.name
  password.value = ''
  sheet.value = true
}

function confirm() {
  if (!/^\d{6}$/.test(password.value)) {
    uni.showToast({ title: '请输入 6 位支付密码', icon: 'none' })
    return
  }
  if (password.value !== preview.payPassword) {
    uni.showToast({ title: '支付密码不正确，转账未完成', icon: 'none' })
    return
  }
  preview.spendConsume(Number(amount.value))
  sheet.value = false
  uni.showToast({ title: '已转出（演示）', icon: 'none' })
}
</script>

<template>
  <AppFrame title="消费转账">
    <LockPanel
      v-if="!preview.isMember"
      title="请先成为会员"
      text="消费账户转账仅限会员之间。请先在创业专区完成购买，成为会员后再发起。"
      action="前往创业专区"
      @action="openPage(routes.shop)"
    />
    <view v-else class="pad">
      <view class="list-group">
        <view class="list-cell">
          <text class="muted t-13">转出方式</text>
          <text class="cell-body">消费账户转账</text>
        </view>
        <view class="list-cell">
          <text class="muted t-13">接收用户</text>
          <input v-model="memberId" class="cell-body field__input" placeholder="请输入对方会员 ID" />
        </view>
      </view>
      <view class="card card-pad mt-16">
        <text class="muted t-13">转出金额</text>
        <input v-model="amount" class="field__input mt-8" type="digit" placeholder="请输入转出金额" />
        <text class="hint mt-8">消费账户可用余额 {{ money(balance) }}</text>
      </view>
      <text class="hint mt-16">
        仅将消费账户余额转入对方的消费账户。积分账户、提现账户不能转给他人。同一用户三个账户之间不可互转。
      </text>
      <view class="btn btn-primary btn-block mt-20 hit" @click="openConfirm">确认转账</view>
      <text class="hint mt-12">演示收款人可使用会员 ID {{ transferPeer.memberId }}。</text>
    </view>
    <template v-if="sheet" #overlay>
      <view class="sheet-mask" @click.self="sheet = false">
        <view class="sheet">
          <view class="sheet-handle" />
          <text class="fw-6 t-16">确认转入</text>
          <text class="hint mt-8">请核对收款人 {{ payeeName }}，再输入支付密码。</text>
          <input v-model="password" class="field__input mt-16" password maxlength="6" placeholder="请输入 6 位支付密码" />
          <view class="btn btn-primary btn-block mt-16 hit" @click="confirm">确认</view>
        </view>
      </view>
    </template>
  </AppFrame>
</template>
