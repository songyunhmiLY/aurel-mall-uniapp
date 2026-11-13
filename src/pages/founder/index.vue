<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { fetchCofounderPage, startCofounderActivation } from '@/api/cofounder'
import { sessionErrorMessage } from '@/auth/account-session'
import { sandboxFail, sandboxSucceed } from '@/api/payment'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { cofounderUnavailableHint } from '@/cofounder/labels'
import { yuanFen } from '@/demo/format'
import { isMpWeixin, requestWechatPayment } from '@/platform/mp-weixin'
import { useUserStore } from '@/stores/user'
import type { CofounderActivation, CofounderPage } from '@/types/cofounder'

const user = useUserStore()
const page = ref<CofounderPage | null>(null)
const prepay = ref<CofounderActivation | null>(null)
const loaded = ref(false)
const pending = ref(false)
const errorText = ref('')
const notice = ref('')
let loadGeneration = 0
let payGeneration = 0

const canPay = computed(() => {
  const current = page.value
  return Boolean(current && !current.enrolled && current.button.available)
})

const buttonHint = computed(() => {
  const current = page.value
  if (!current || current.enrolled || current.button.available) return ''
  return cofounderUnavailableHint(current.button.reason)
})

const heading = computed(() => page.value?.intro.title || '联合创始人')
const sandboxPrepay = computed(() => (prepay.value?.mode === 'sandbox' ? prepay.value : null))

onShow(() => {
  if (!user.token) return
  void load()
})

async function load() {
  const id = ++loadGeneration
  errorText.value = ''
  try {
    const next = await fetchCofounderPage()
    if (id !== loadGeneration) return
    page.value = next
    if (next.enrolled) prepay.value = null
  } catch (error) {
    if (id !== loadGeneration) return
    errorText.value = sessionErrorMessage(error, '联合创始人加载失败')
  } finally {
    if (id === loadGeneration) loaded.value = true
  }
}

async function activate() {
  if (pending.value || !canPay.value) return
  pending.value = true
  errorText.value = ''
  notice.value = ''
  const id = ++payGeneration
  try {
    const started = await startCofounderActivation()
    if (id !== payGeneration) return
    prepay.value = started
    if (started.mode === 'live') await payLive(started)
  } catch (error) {
    if (id !== payGeneration) return
    const message = sessionErrorMessage(error, '开通未完成')
    errorText.value = message
    uni.showToast({ title: message, icon: 'none' })
    void load()
  } finally {
    if (id === payGeneration) pending.value = false
  }
}

async function payLive(payload: CofounderActivation) {
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
    notice.value = '已调起微信支付。开通在支付成功后立即生效，可以稍后刷新。'
    await load()
    if (page.value?.enrolled) notice.value = ''
  } catch (error) {
    notice.value = sessionErrorMessage(error, '微信支付未完成，可以再次支付。')
  }
}

async function onSandbox(kind: 'succeed' | 'fail') {
  const current = prepay.value
  if (!current || current.mode !== 'sandbox' || pending.value || !canPay.value) return
  pending.value = true
  errorText.value = ''
  const id = ++payGeneration
  try {
    const result =
      kind === 'succeed' ? await sandboxSucceed(current.payNo) : await sandboxFail(current.payNo)
    if (id !== payGeneration) return
    if (result.payNo !== current.payNo) {
      errorText.value = '支付响应无效'
      return
    }
    prepay.value = null
    await load()
    if (id !== payGeneration) return
    if (page.value?.enrolled) {
      notice.value = ''
      uni.showToast({ title: '你已是联合创始人', icon: 'none' })
      return
    }
    notice.value =
      result.status === 'success'
        ? '支付已提交，开通状态以页面为准。'
        : '模拟支付未完成，可以再次支付。'
  } catch (error) {
    if (id !== payGeneration) return
    errorText.value = sessionErrorMessage(error, '模拟支付未完成')
  } finally {
    if (id === payGeneration) pending.value = false
  }
}
</script>

<template>
  <AppFrame title="联合创始人">
    <view v-if="errorText" class="pad">
      <view class="notice">{{ errorText }}</view>
    </view>
    <view v-if="!loaded" class="empty">
      <view class="empty__title">正在读取</view>
    </view>
    <template v-else-if="page">
      <image
        v-for="(url, index) in page.intro.imageUrls"
        :key="`${url}-${index}`"
        class="cf-photo"
        :src="url"
        mode="widthFix"
      />
      <view class="cf-body">
        <text class="cf-title">{{ heading }}</text>
        <view v-if="page.enrolled" class="notice notice-ok mt-12">你已是联合创始人</view>
        <text v-if="page.intro.body" class="cf-lead">{{ page.intro.body }}</text>
      </view>
      <view v-if="canPay" class="pad">
        <view class="card card-pad">
          <view class="kv">
            <text class="k">开通费用</text>
            <text class="v fw-6">{{ yuanFen(page.activationAmountFen) }}</text>
          </view>
          <view class="kv">
            <text class="k">支付方式</text>
            <text class="v">仅微信支付</text>
          </view>
        </view>
        <view v-if="notice" class="notice mt-12">{{ notice }}</view>
        <view v-if="sandboxPrepay" class="mt-12">
          <text class="t-14">微信应付 {{ yuanFen(sandboxPrepay.amountFen) }}</text>
          <view class="pay-actions mt-12">
            <view
              class="btn btn-primary btn-block"
              :class="pending ? 'is-disabled' : 'hit'"
              @click="onSandbox('succeed')"
              >模拟支付成功</view
            >
            <view
              class="btn btn-ghost btn-block"
              :class="pending ? 'is-disabled' : 'hit'"
              @click="onSandbox('fail')"
              >模拟支付失败</view
            >
          </view>
        </view>
        <view
          class="btn btn-gold btn-block mt-12"
          :class="pending ? 'is-disabled' : 'hit'"
          @click="activate"
          >{{ pending ? '处理中' : '成为联合创始人' }}</view
        >
      </view>
      <view v-else-if="!page.enrolled" class="pad">
        <view class="btn btn-gold btn-block is-disabled">成为联合创始人</view>
        <text v-if="buttonHint" class="hint center mt-12">{{ buttonHint }}</text>
      </view>
    </template>
  </AppFrame>
</template>
