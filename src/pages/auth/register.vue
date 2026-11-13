<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import {
  postMiniLogin,
  PREVIEW_SUBJECT_MEMBER,
  PREVIEW_SUBJECT_NONMEMBER,
  type PreviewSubject,
} from '@/api/auth'
import { apiErrorMessage } from '@/api/http'
import { acceptSession, noteAuthFailure } from '@/auth/account-session'
import { switchPreviewSubject } from '@/auth/preview-entry'
import AppFrame from '@/components/chrome/AppFrame.vue'
import {
  captureInviteCode,
  captureLaunchInviteCode,
  hasInviterBound,
  isInviteCode,
  readPendingInviteCode,
} from '@/invite/code'
import { submitInviteRegistration } from '@/invite/registration'
import { resetTo, routes } from '@/navigation/routes'
import { isMpWeixin, requestWechatLoginCode } from '@/platform/mp-weixin'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const inviteCode = ref('')
const attachedOnOpen = ref(false)
const pending = ref(false)
const attempted = ref('')
const errorText = ref('')
const loginError = ref('')

onLoad((query) => {
  const attached = captureInviteCode(query) || captureLaunchInviteCode()
  if (attached) {
    inviteCode.value = attached
    attachedOnOpen.value = true
    return
  }
  inviteCode.value = readPendingInviteCode()
})

onShow(() => {
  void afterSession()
})

watch(
  () => user.userId,
  (userId) => {
    if (userId) void afterSession()
  },
)

async function afterSession() {
  if (!user.token || !user.userId || pending.value) return
  if (user.member || hasInviterBound(user.userId)) {
    resetTo(routes.home)
    return
  }
  const code = inviteCode.value.trim()
  if (!attachedOnOpen.value || !isInviteCode(code) || attempted.value === code) return
  attempted.value = code
  await submit()
}

async function onWechatLogin() {
  if (pending.value) return
  pending.value = true
  loginError.value = ''
  try {
    const code = await requestWechatLoginCode()
    acceptSession(await postMiniLogin({ code }))
    pending.value = false
    await afterSession()
  } catch (error) {
    loginError.value = noteAuthFailure(error, '微信登录未完成')
    pending.value = false
  }
}

async function enterPreview(subject: PreviewSubject) {
  if (pending.value) return
  pending.value = true
  loginError.value = ''
  try {
    await switchPreviewSubject(subject)
    pending.value = false
    await afterSession()
  } catch (error) {
    loginError.value = apiErrorMessage(error, '预览会话未建立')
    pending.value = false
  }
}

async function submit() {
  if (pending.value) return
  errorText.value = ''
  if (!user.token) {
    errorText.value = '请先登录。登录不会提交邀请码。'
    return
  }
  pending.value = true
  const outcome = await submitInviteRegistration(inviteCode.value)
  pending.value = false
  if (outcome.ok) {
    uni.showToast({ title: '邀请码已提交', icon: 'none' })
    resetTo(routes.home)
    return
  }
  errorText.value = outcome.message
  if (outcome.alreadyBound) {
    uni.showToast({ title: outcome.message, icon: 'none' })
    resetTo(routes.home)
  }
}
</script>

<template>
  <AppFrame title="注册" ink guest-ok>
    <view class="auth-page">
      <text class="auth-brand">AUREL</text>
      <text class="auth-title">注册</text>
      <text class="auth-sub">
        先登录，再提交邀请码。登录接口不接收邀请码，也不会自动绑定根账户。邀请码来自扫码，也可以自己填写。未成功绑定前，注册不算完成。
      </text>
      <view v-if="loginError" class="notice">{{ loginError }}</view>
      <view v-if="errorText" class="notice">{{ errorText }}</view>
      <template v-if="!user.token">
        <template v-if="isMpWeixin">
          <button class="btn btn-gold btn-block" :disabled="pending" @click="onWechatLogin">
            微信登录
          </button>
        </template>
        <template v-else>
          <view class="btn btn-gold btn-block hit" @click="enterPreview(PREVIEW_SUBJECT_MEMBER)">
            preview-member
          </view>
          <view
            class="btn btn-ghost btn-block mt-12 hit"
            @click="enterPreview(PREVIEW_SUBJECT_NONMEMBER)"
          >
            preview-nonmember
          </view>
        </template>
      </template>
      <view class="field">
        <text class="field__label">邀请码</text>
        <input
          v-model="inviteCode"
          class="auth-input"
          maxlength="6"
          type="text"
          placeholder="6 位数字"
        />
      </view>
      <text class="hint"
        >扫码打开时会带上对方的邀请码。没有扫码就留空并提交，会提示邀请码不正确。</text
      >
      <view class="btn btn-gold btn-block hit" @click="submit">{{
        pending ? '提交中' : '完成注册'
      }}</view>
    </view>
  </AppFrame>
</template>
