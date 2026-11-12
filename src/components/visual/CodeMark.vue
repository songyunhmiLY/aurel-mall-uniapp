<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ value: string; mode?: 'qr' | 'barcode' }>(), {
  mode: 'qr',
})

function hash(seed: string, index: number): number {
  let value = 2166136261
  const text = seed || 'AUREL'
  for (let step = 0; step <= index; step += 1) {
    value ^= text.charCodeAt(step % text.length)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

const qrCells = computed(() => {
  const size = 21
  const cells: { x: number; y: number }[] = []
  const finder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4
        if (edge || core) cells.push({ x: ox + x, y: oy + y })
      }
    }
  }
  finder(0, 0)
  finder(size - 7, 0)
  finder(0, size - 7)
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const inFinder = (x < 8 && y < 8) || (x > size - 9 && y < 8) || (x < 8 && y > size - 9)
      if (inFinder) continue
      if (hash(props.value, x + y * size) % 3 !== 0) cells.push({ x, y })
    }
  }
  return cells
})

const bars = computed(() => {
  const widths: number[] = []
  const seed = props.value || 'AUREL'
  for (let index = 0; index < 48; index += 1) {
    widths.push((hash(seed, index) % 3) + 1)
  }
  return widths
})
</script>

<template>
  <svg v-if="mode === 'barcode'" viewBox="0 0 240 64" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="64" fill="#fff" />
    <rect
      v-for="(width, index) in bars"
      :key="index"
      :x="8 + bars.slice(0, index).reduce((sum, item) => sum + item + 1, 0)"
      y="4"
      :width="width"
      height="56"
      fill="#161A1F"
    />
  </svg>
  <svg v-else viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <rect width="21" height="21" fill="#fff" />
    <rect v-for="(cell, index) in qrCells" :key="index" :x="cell.x" :y="cell.y" width="1" height="1" fill="#161A1F" />
  </svg>
</template>
