<script setup lang="ts">
function save() {
  uni.showToast({ title: '支付密码规则尚未确定', icon: 'none' })
}
</script>

<template>
  <view class="page">
    <text class="h1">支付密码</text>
    <text class="muted">规则未定。此页不保存密码。</text>
    <button class="btn" @click="save">保存（占位）</button>
  </view>
</template>
