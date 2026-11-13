<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { PREVIEW_SUBJECT_MEMBER, PREVIEW_SUBJECT_NONMEMBER, type PreviewSubject } from '@/api/auth'
import { fetchKyc } from '@/api/kyc'
import { ApiError, apiErrorMessage, isAccountBlockedError } from '@/api/http'
import { clearAuthSession, sessionErrorMessage } from '@/auth/account-session'
import { readPreviewSubject, switchPreviewSubject } from '@/auth/preview-entry'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { openPage, resetTo, routes } from '@/navigation/routes'
import { isMpWeixin } from '@/platform/mp-weixin'
import { usePreviewStore } from '@/stores/preview'
import { useUserStore } from '@/stores/user'

const preview = usePreviewStore()
const user = useUserStore()
const kycLabel = ref('')
const passLab = computed(() => (preview.payPassword ? '已设置' : '未设置'))
const accountLabel = computed(() => user.nickname || preview.profile.name || '已登录')
const subjectLabel = ref(readPreviewSubject())
const previewError = ref('')
const memberLabel = computed(() => (preview.isMember ? '会员' : '非会员'))

onShow(() => {
  subjectLabel.value = readPreviewSubject()
  void loadKyc()
})

async function loadKyc() {
  try {
    const profile = await fetchKyc()
    kycLabel.value = profile.verified ? '已认证' : '未认证'
  } catch (error) {
    if (isAccountBlockedError(error)) {
      sessionErrorMessage(error, '账号已停用')
      kycLabel.value = ''
      return
    }
    kycLabel.value = error instanceof ApiError && error.statusCode === 404 ? '未认证' : ''
  }
}

function logout() {
  clearAuthSession()
  resetTo(routes.login)
}

async function useSubject(subject: PreviewSubject) {
  previewError.value = ''
  try {
    await switchPreviewSubject(subject)
    subjectLabel.value = readPreviewSubject()
    uni.showToast({ title: '已切换预览身份', icon: 'none' })
  } catch (error) {
    previewError.value = apiErrorMessage(error, '预览身份未切换')
  }
}
</script>

<template>
  <AppFrame title="设置">
    <view class="pad">
      <view class="list-group">
        <view class="list-cell">
          <text class="cell-body">当前账号</text>
          <text class="muted t-13">{{ accountLabel }}</text>
        </view>
        <view class="list-cell hit" @click="openPage(routes.realName)">
          <text class="cell-body">实名认证</text>
          <text v-if="kycLabel" class="muted t-13">{{ kycLabel }}</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.addresses)">
          <text class="cell-body">收货地址</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.paymentAccount)">
          <text class="cell-body">收款账户</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.payPassword)">
          <text class="cell-body">支付密码设置</text>
          <text class="muted t-13">{{ passLab }}</text>
          <view class="chevron" />
        </view>
      </view>
      <view class="list-group mt-16">
        <view class="list-cell hit" @click="openPage(routes.agreements)">
          <text class="cell-body">用户协议</text>
          <view class="chevron" />
        </view>
        <view class="list-cell hit" @click="openPage(routes.privacy)">
          <text class="cell-body">隐私政策</text>
          <view class="chevron" />
        </view>
      </view>
      <view v-if="!isMpWeixin" class="mt-16">
        <view class="list-group">
          <view class="list-cell">
            <text class="cell-body">预览标识</text>
            <text class="muted t-13">{{ subjectLabel }}</text>
          </view>
          <view class="list-cell">
            <text class="cell-body">会员标识</text>
            <text class="muted t-13">{{ memberLabel }}</text>
          </view>
        </view>
        <view class="btn btn-ghost btn-block mt-12 hit" @click="useSubject(PREVIEW_SUBJECT_MEMBER)"
          >切换到 preview-member</view
        >
        <view
          class="btn btn-ghost btn-block mt-12 hit"
          @click="useSubject(PREVIEW_SUBJECT_NONMEMBER)"
          >切换到 preview-nonmember</view
        >
        <text class="hint mt-12"
          >仅用于 H5 开发预览。会员标识以登录接口返回的 member
          为准。预览登录关闭时会提示已忽略。</text
        >
        <view v-if="previewError" class="notice mt-12">{{ previewError }}</view>
      </view>
      <view class="btn btn-ghost btn-block mt-20 hit" @click="logout">退出登录</view>
      <text class="hint center mt-16">奥瑞尔 AUREL · 预览版本</text>
    </view>
  </AppFrame>
</template>
