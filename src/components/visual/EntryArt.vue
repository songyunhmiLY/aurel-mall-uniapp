<script setup lang="ts">
defineProps<{ kind: 'welfare' | 'cofounder' | 'startup'; imageUrl?: string | null }>()
</script>

<template>
  <view class="ec-art">
    <image v-if="imageUrl" class="ec-photo" :src="imageUrl" mode="aspectFill" />
    <svg v-else-if="kind === 'welfare'" viewBox="0 0 216 216" xmlns="http://www.w3.org/2000/svg">
      <rect width="216" height="216" fill="#1E252C" />
      <circle cx="108" cy="104" r="52" fill="none" stroke="#5E8F8A" stroke-width="1.4" />
      <circle cx="108" cy="104" r="22" fill="#5E8F8A" opacity="0.9" />
      <circle cx="108" cy="104" r="8" fill="#C5D9D6" />
    </svg>
    <svg v-else-if="kind === 'cofounder'" viewBox="0 0 216 216" xmlns="http://www.w3.org/2000/svg">
      <rect width="216" height="216" fill="#161A1F" />
      <polygon
        points="108,46 150,72 150,124 108,150 66,124 66,72"
        fill="none"
        stroke="#C5D9D6"
        stroke-width="1.3"
      />
      <circle cx="108" cy="98" r="16" fill="#5E8F8A" opacity="0.9" />
      <circle cx="84" cy="114" r="8" fill="#C5D9D6" opacity="0.8" />
      <circle cx="132" cy="114" r="8" fill="#C5D9D6" opacity="0.8" />
      <line x1="96" y1="106" x2="84" y2="114" stroke="#C5D9D6" stroke-width="1.2" />
      <line x1="120" y1="106" x2="132" y2="114" stroke="#C5D9D6" stroke-width="1.2" />
    </svg>
    <svg v-else viewBox="0 0 216 216" xmlns="http://www.w3.org/2000/svg">
      <rect width="216" height="216" fill="#1C3332" />
      <rect x="86" y="48" width="44" height="16" rx="3" fill="#C5D9D6" opacity="0.8" />
      <path d="M94 64h28v10l8 8v78c0 12-8 20-22 20s-22-8-22-20V82l8-8V64z" fill="#5E8F8A" />
      <path d="M102 110h28v24H102z" fill="#C5D9D6" opacity="0.7" />
    </svg>
  </view>
</template>
