<script setup lang="ts">
import { ref } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { usePreviewStore } from '@/stores/preview'

const preview = usePreviewStore()
const oldPass = ref('')
const nextPass = ref('')
const confirm = ref('')

function save() {
  if (!/^\d{6}$/.test(nextPass.value) || nextPass.value !== confirm.value) {
    uni.showToast({ title: '请设置一致的 6 位数字', icon: 'none' })
    return
  }
  if (preview.payPassword && oldPass.value !== preview.payPassword) {
    uni.showToast({ title: '原支付密码不正确', icon: 'none' })
    return
  }
  preview.setPayPassword(nextPass.value)
  uni.showToast({ title: '已保存（演示）', icon: 'none' })
  setTimeout(() => uni.navigateBack(), 400)
}
</script>

<template>
  <AppFrame title="支付密码设置">
    <view class="pad">
      <text class="hint mb-12">请设置 6 位数字支付密码，用于确认敏感操作。以下为演示，不会连接真实支付。</text>
      <view v-if="preview.payPassword" class="field">
        <text class="field__label">原支付密码</text>
        <input v-model="oldPass" class="field__input" password maxlength="6" placeholder="请输入原密码" />
      </view>
      <view class="field">
        <text class="field__label">{{ preview.payPassword ? '新支付密码' : '支付密码' }}</text>
        <input v-model="nextPass" class="field__input" password maxlength="6" placeholder="请输入 6 位数字" />
      </view>
      <view class="field">
        <text class="field__label">确认密码</text>
        <input v-model="confirm" class="field__input" password maxlength="6" placeholder="请再次输入" />
      </view>
      <view class="btn btn-primary btn-block hit" @click="save">{{ preview.payPassword ? '确认修改' : '完成设置' }}</view>
    </view>
  </AppFrame>
</template>
