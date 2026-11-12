<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ tone?: string; size?: 'tile' | 'md' | 'sm' | 'hero' }>(), {
  tone: 'slate',
  size: 'tile',
})

const palettes: Record<string, { a: string; b: string; c: string; d: string }> = {
  olive: { a: '#1C3332', b: '#5E8F8A', c: '#C5D9D6', d: '#F2F6F6' },
  slate: { a: '#2A3A48', b: '#6A8A96', c: '#D0DCE3', d: '#F3F6F8' },
  linen: { a: '#2C3A34', b: '#6A8B7A', c: '#C9D6CE', d: '#F1F5F3' },
  sand: { a: '#2A3A40', b: '#7A9AA0', c: '#D2DEE0', d: '#F3F6F7' },
  forest: { a: '#1E322E', b: '#4E7A72', c: '#C5D6D2', d: '#F0F5F4' },
  terracotta: { a: '#2A3438', b: '#6E8B90', c: '#D0DCDE', d: '#F2F5F6' },
  navy: { a: '#1E2428', b: '#5A656C', c: '#C8CED2', d: '#F0F2F3' },
  stone: { a: '#3A4046', b: '#8A939A', c: '#D5DADE', d: '#F4F6F7' },
}

const pal = computed(() => palettes[props.tone] || palettes.slate)
const cls = computed(() => (props.size === 'tile' || props.size === 'hero' ? 'art' : `art art-${props.size}`))
</script>

<template>
  <view :class="cls">
    <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="300" :fill="pal.d" />
      <circle cx="236" cy="48" r="86" :fill="pal.c" opacity="0.7" />
      <circle cx="40" cy="250" r="76" :fill="pal.a" opacity="0.1" />
      <circle cx="72" cy="72" r="26" fill="none" :stroke="pal.a" stroke-width="1.2" opacity="0.28" />
      <circle cx="72" cy="72" r="10" :fill="pal.b" opacity="0.35" />
      <rect x="128" y="62" width="44" height="18" rx="3" :fill="pal.a" opacity="0.55" />
      <path d="M136 80h28v12l7 9v92c0 11-9 20-21 20s-21-9-21-20V101l7-9V80z" :fill="pal.b" opacity="0.88" />
      <path d="M144 128h36v28H144z" :fill="pal.c" opacity="0.85" />
      <line x1="24" y1="200" x2="88" y2="200" :stroke="pal.a" stroke-width="1" opacity="0.25" />
    </svg>
  </view>
</template>
