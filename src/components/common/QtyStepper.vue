<script setup lang="ts">
defineProps<{ qty: number }>()
const emit = defineEmits<{ change: [delta: number] }>()
</script>

<template>
  <view class="stepper">
    <view class="stepper__btn hit" @click.stop="emit('change', -1)">−</view>
    <text class="stepper__n">{{ qty }}</text>
    <view class="stepper__btn hit" @click.stop="emit('change', 1)">+</view>
  </view>
</template>
