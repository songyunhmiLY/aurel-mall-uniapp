<script setup lang="ts">
import { computed } from 'vue'
import { isInviteCode } from '@/invite/code'
import { inviteQrText } from '@/invite/entry'
import { qrMatrix } from '@/invite/qr-matrix'

const props = defineProps<{ code: string }>()

const payload = computed(() => (isInviteCode(props.code) ? inviteQrText(props.code) : ''))
const matrix = computed(() => qrMatrix(payload.value))
const cells = computed(() => {
  const current = matrix.value
  if (!current) return []
  const points: { x: number; y: number }[] = []
  for (let y = 0; y < current.size; y += 1) {
    for (let x = 0; x < current.size; x += 1) {
      if (current.dark(x, y)) points.push({ x, y })
    }
  }
  return points
})
</script>

<template>
  <svg
    v-if="matrix"
    :viewBox="`0 0 ${matrix.size} ${matrix.size}`"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>邀请注册</title>
    <rect width="100%" height="100%" fill="#ffffff" />
    <rect
      v-for="(cell, index) in cells"
      :key="index"
      :x="cell.x"
      :y="cell.y"
      width="1"
      height="1"
      fill="#161A1F"
    />
  </svg>
</template>
