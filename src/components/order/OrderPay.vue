<script setup lang="ts">
import { ref, watch } from 'vue'
import { apiErrorMessage } from '@/api/http'
import { cancelOrder, fetchOrder, payOrder, timeoutOrder } from '@/api/order'
import { sandboxFail, sandboxSucceed } from '@/api/payment'
import { refreshSignedInUser } from '@/auth/preview-entry'
import { yuanFen } from '@/demo/format'
import { payRule } from '@/orders/labels'
import { isMpWeixin, requestWechatPayment } from '@/platform/mp-weixin'
import { useWalletStore } from '@/stores/wallet'
import type { OrderView, WechatPrepay } from '@/types/order'

const props = defineProps<{ order: OrderView }>()
const emit = defineEmits<{ changed: [order: OrderView] }>()

const wallets = useWalletStore()
const pending = ref(false)
const errorText = ref('')
const wechat = ref<WechatPrepay | null>(null)
const notice = ref('')

watch(
  () => props.order.status,
  (status) => {
    if (status !== 'pending_payment') {
      wechat.value = null
      notice.value = ''
    }
  },
)

async function publish(next: OrderView) {
  emit('changed', next)
  if (next.zone === 'startup' && next.status === 'paid') {
    await refreshSignedInUser({ quiet: true })
  }
  void wallets.load()
}

async function onPay() {
  if (pending.value || props.order.status !== 'pending_payment') return
  pending.value = true
  errorText.value = ''
  notice.value = ''
  try {
    const result = await payOrder(props.order.id)
    await publish(result.order)
    wechat.value = result.wechat
    if (!result.wechat && result.order.status === 'paid') {
      notice.value = '账户已覆盖应付，订单已支付。'
      return
    }
    if (result.wechat?.mode === 'live') {
      await payLive(result.wechat)
    }
  } catch (error) {
    errorText.value = apiErrorMessage(error, '支付未完成')
  } finally {
    pending.value = false
  }
}

async function payLive(payload: WechatPrepay) {
  if (!isMpWeixin) {
    notice.value = '当前预览不能使用微信网页授权。商户资料已配置时，请在微信小程序内完成支付。'
    return
  }
  if (
    !payload.timeStamp ||
    !payload.nonceStr ||
    !payload.package ||
    payload.signType !== 'RSA' ||
    !payload.paySign
  ) {
    errorText.value = '微信支付参数不完整'
    return
  }
  try {
    await requestWechatPayment({
      timeStamp: payload.timeStamp,
      nonceStr: payload.nonceStr,
      prepayPackage: payload.package,
      signType: payload.signType,
      paySign: payload.paySign,
    })
    notice.value = '已调起微信支付。到账前订单仍是待付款，可以稍后刷新。'
    await publish(await fetchOrder(props.order.id))
  } catch (error) {
    notice.value = apiErrorMessage(error, '微信支付未完成，订单仍待付款，可以再次支付。')
  }
}

async function onSandbox(kind: 'succeed' | 'fail') {
  const payNo = wechat.value?.payNo
  if (!payNo || pending.value) return
  pending.value = true
  errorText.value = ''
  try {
    const result = kind === 'succeed' ? await sandboxSucceed(payNo) : await sandboxFail(payNo)
    const next = await fetchOrder(result.orderId || props.order.id)
    wechat.value = null
    await publish(next)
    notice.value =
      next.status === 'paid'
        ? '模拟支付成功，订单已支付。'
        : '模拟支付未完成，订单仍待付款，可以再次支付。'
  } catch (error) {
    errorText.value = apiErrorMessage(error, '模拟支付未完成')
  } finally {
    pending.value = false
  }
}

function onCancel() {
  confirmClose('取消订单', '取消后订单关闭，已冻结的金额会释放。', () =>
    cancelOrder(props.order.id),
  )
}

function onTimeout() {
  confirmClose('超时关闭', '本阶段不会按时间自动关闭。确定现在关闭这笔待付款订单？', () =>
    timeoutOrder(props.order.id),
  )
}

function confirmClose(title: string, content: string, run: () => Promise<OrderView>) {
  if (pending.value || props.order.status !== 'pending_payment') return
  uni.showModal({
    title,
    content,
    success(result) {
      if (!result.confirm) return
      pending.value = true
      errorText.value = ''
      void run()
        .then(async (next) => {
          wechat.value = null
          notice.value = '订单已关闭。'
          await publish(next)
        })
        .catch((error: unknown) => {
          errorText.value = apiErrorMessage(error, '订单未关闭')
        })
        .finally(() => {
          pending.value = false
        })
    },
  })
}
</script>

<template>
  <view class="card card-pad mt-12">
    <text class="fw-6">支付</text>
    <text class="hint mt-8">{{ payRule(order.zone) }}</text>
    <view v-if="notice" class="notice mt-12">{{ notice }}</view>
    <view v-if="errorText" class="notice mt-12">{{ errorText }}</view>
    <view v-if="wechat" class="mt-12">
      <text class="t-14">微信应付 {{ yuanFen(wechat.amountFen) }}</text>
      <text class="hint mt-8">这是微信部分，不是整单应付。订单在微信完成前保持待付款。</text>
      <view v-if="wechat.mode === 'sandbox'" class="pay-actions mt-12">
        <view class="btn btn-primary btn-block hit" @click="onSandbox('succeed')"
          >模拟支付成功</view
        >
        <view class="btn btn-ghost btn-block hit" @click="onSandbox('fail')">模拟支付失败</view>
      </view>
    </view>
    <view v-if="order.status === 'pending_payment'" class="pay-actions mt-12">
      <view class="btn btn-primary btn-block hit" @click="onPay">{{
        pending ? '处理中' : '支付'
      }}</view>
      <view class="btn btn-ghost btn-block hit" @click="onCancel">取消订单</view>
      <view class="btn btn-ghost btn-block hit" @click="onTimeout">超时关闭</view>
    </view>
  </view>
</template>
