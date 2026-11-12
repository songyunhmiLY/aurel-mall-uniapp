<script setup lang="ts">
import { ref } from 'vue'
import AppFrame from '@/components/chrome/AppFrame.vue'

const name = ref('')
const phone = ref('')
const region = ref('')
const detail = ref('')

function save() {
  if (!name.value || !phone.value || !region.value || !detail.value) {
    uni.showToast({ title: '请填写完整地址', icon: 'none' })
    return
  }
  uni.showToast({ title: '已保存（演示）', icon: 'none' })
}
</script>

<template>
  <AppFrame title="收货地址">
    <view class="pad">
      <view class="field">
        <text class="field__label">收货人</text>
        <input v-model="name" class="field__input" placeholder="姓名" />
      </view>
      <view class="field">
        <text class="field__label">联系电话</text>
        <input v-model="phone" class="field__input" placeholder="电话" />
      </view>
      <view class="field">
        <text class="field__label">所在地区</text>
        <input v-model="region" class="field__input" placeholder="国家 / 省 / 城市" />
      </view>
      <view class="field">
        <text class="field__label">详细地址</text>
        <input v-model="detail" class="field__input" placeholder="街道、门牌" />
      </view>
      <view class="btn btn-primary btn-block hit" @click="save">保存</view>
    </view>
  </AppFrame>
</template>
