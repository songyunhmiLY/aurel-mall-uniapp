<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg v-if="name === 'gear'" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6" />
    <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
  </svg>
  <svg v-else-if="name === 'pay'" class="os-ico" width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="6" width="16" height="13" rx="2" stroke="currentColor" stroke-width="1.6" />
    <path d="M8 10h8" stroke="currentColor" stroke-width="1.6" />
  </svg>
  <svg v-else-if="name === 'ship'" width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16v11H4z" stroke="currentColor" stroke-width="1.6" />
    <path d="M8 7V5h8v2" stroke="currentColor" stroke-width="1.6" />
  </svg>
  <svg v-else-if="name === 'recv'" width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M3 7h13v10H3z" stroke="currentColor" stroke-width="1.6" />
    <path d="M16 10h5l2 3v4h-7" stroke="currentColor" stroke-width="1.6" />
    <circle cx="7" cy="19" r="1.4" stroke="currentColor" stroke-width="1.4" />
    <circle cx="18" cy="19" r="1.4" stroke="currentColor" stroke-width="1.4" />
  </svg>
  <svg v-else-if="name === 'refund'" width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.6" />
    <path d="M12 8v5l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
  </svg>
  <svg v-else-if="name === 'invite'" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.6" />
    <path d="M4 19c.8-3 2.8-4.5 5-4.5s4.2 1.5 5 4.5" stroke="currentColor" stroke-width="1.6" />
    <path d="M17 8h4M19 6v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
  </svg>
  <svg v-else-if="name === 'team'" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="8" r="2.4" stroke="currentColor" stroke-width="1.6" />
    <circle cx="16" cy="8" r="2.4" stroke="currentColor" stroke-width="1.6" />
    <circle cx="12" cy="14.5" r="2.4" stroke="currentColor" stroke-width="1.6" />
    <path d="M4.5 19c.6-2.2 2-3.3 3.5-3.3M19.5 19c-.6-2.2-2-3.3-3.5-3.3M9 19c.6-2 1.8-3 3-3s2.4 1 3 3" stroke="currentColor" stroke-width="1.6" />
  </svg>
  <svg v-else-if="name === 'service'" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M5 11a7 7 0 0 1 14 0v6a2 2 0 0 1-2 2h-3v-5h5" stroke="currentColor" stroke-width="1.6" />
    <path d="M5 17h5v5H7a2 2 0 0 1-2-2v-3z" stroke="currentColor" stroke-width="1.6" />
  </svg>
  <svg v-else-if="name === 'pin'" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 21s7-6.2 7-11.2A7 7 0 1 0 5 9.8C5 14.8 12 21 12 21z" stroke="currentColor" stroke-width="1.6" />
    <circle cx="12" cy="9.8" r="2.2" stroke="currentColor" stroke-width="1.6" />
  </svg>
  <svg v-else-if="name === 'bank'" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 10h16v8H4z" stroke="currentColor" stroke-width="1.6" />
    <path d="M3 10l9-6 9 6" stroke="currentColor" stroke-width="1.6" />
    <path d="M8 18v-5M12 18v-5M16 18v-5" stroke="currentColor" stroke-width="1.6" />
  </svg>
  <svg v-else-if="name === 'bell'" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" stroke="currentColor" stroke-width="1.6" />
    <path d="M10 20a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="1.6" />
  </svg>
  <svg v-else-if="name === 'edit'" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 20h4l11-11-4-4L4 16v4z" stroke="currentColor" stroke-width="1.6" />
    <path d="M13 7l4 4" stroke="currentColor" stroke-width="1.6" />
  </svg>
  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M7 8h10" stroke="currentColor" stroke-width="1.6" />
    <path d="M13 5l4 3-4 3" stroke="currentColor" stroke-width="1.6" />
    <path d="M17 16H7" stroke="currentColor" stroke-width="1.6" />
    <path d="M11 13l-4 3 4 3" stroke="currentColor" stroke-width="1.6" />
  </svg>
</template>
