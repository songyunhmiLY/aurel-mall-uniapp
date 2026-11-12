<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ tone?: string }>(), { tone: 'slate' })

const palettes: Record<string, { a: string; b: string; c: string; d: string }> = {
  olive: { a: '#1C3332', b: '#5E8F8A', c: '#C5D9D6', d: '#0E1A19' },
  slate: { a: '#1E252C', b: '#6A8A96', c: '#D0DCE3', d: '#12181E' },
  navy: { a: '#161A1F', b: '#5A656C', c: '#C8CED2', d: '#0E1216' },
  linen: { a: '#1E2A26', b: '#6A8B7A', c: '#C9D6CE', d: '#121A18' },
}

const pal = computed(() => palettes[props.tone] || palettes.slate)
const gradId = computed(() => `bn-${props.tone || 'slate'}`)
</script>

<template>
  <view class="hc-art">
    <svg viewBox="0 0 390 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient :id="gradId" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" :stop-color="pal.a" />
          <stop offset="55%" :stop-color="pal.d" />
          <stop offset="100%" :stop-color="pal.a" />
        </linearGradient>
      </defs>
      <rect width="390" height="180" :fill="`url(#${gradId})`" />
      <circle cx="328" cy="18" r="108" fill="none" :stroke="pal.b" stroke-width="1" opacity="0.45" />
      <circle cx="328" cy="18" r="70" fill="none" :stroke="pal.c" stroke-width="1" opacity="0.28" />
      <circle cx="48" cy="158" r="64" :fill="pal.b" opacity="0.2" />
    </svg>
  </view>
</template>
