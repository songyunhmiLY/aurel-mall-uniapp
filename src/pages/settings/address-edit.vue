<script setup lang="ts">
function save() {
  uni.showToast({ title: '地址保存规则尚未确定', icon: 'none' })
}
</script>

<template>
  <view class="page">
    <text class="h1">编辑地址</text>
    <text class="muted">字段先占位，不会写入服务器。</text>
    <view class="card">
      <input class="field" placeholder="收货人" />
      <input class="field" placeholder="手机号" />
      <input class="field" placeholder="详细地址" />
    </view>
    <button class="btn" @click="save">保存（占位）</button>
  </view>
</template>

<style scoped>
.field {
  margin-top: 16rpx;
  padding: 16rpx 0;
  border-bottom: 1px solid #e6f0ee;
}
</style>
