<script setup lang="ts">
import { ref } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'

const text = ref('')

function submit() {
  if (!text.value.trim()) {
    uni.showToast({ title: '请填写反馈内容', icon: 'none' })
    return
  }
  text.value = ''
  uni.showToast({ title: '已提交（演示）', icon: 'none' })
}
</script>

<template>
  <AppFrame title="我要反馈">
    <view class="pad">
      <view class="field">
        <text class="field__label">反馈内容</text>
        <textarea v-model="text" class="field__input" style="height: 120px; padding-top: 12px" placeholder="请描述你的问题或建议" />
      </view>
      <text class="hint">提交后由工作人员查看。本页仅作演示，不会同步到真实后台。</text>
      <view class="btn btn-primary btn-block mt-16 hit" @click="submit">提交</view>
    </view>
  </AppFrame>
</template>
