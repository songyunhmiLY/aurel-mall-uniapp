<script setup lang="ts">
import { computed } from 'vue'
import EntryArt from '@/components/visual/EntryArt.vue'
import { openPage, routes } from '@/navigation/routes'
import type { CofounderEntry } from '@/types/cofounder'
import type { WelfareEntry } from '@/types/welfare'

const props = defineProps<{
  welfareEntry?: WelfareEntry | null
  cofounderEntry?: CofounderEntry | null
}>()

const entries = computed(() => [
  {
    key: 'welfare' as const,
    url: routes.welfare,
    kicker: '限时参与',
    title: '福利专场',
    desc: props.welfareEntry?.copy ?? '',
    imageUrl: props.welfareEntry?.imageUrl ?? null,
  },
  {
    key: 'cofounder' as const,
    url: routes.founder,
    kicker: '名额招募',
    title: '联合创始人',
    desc: props.cofounderEntry?.copy ?? '',
    imageUrl: props.cofounderEntry?.imageUrls[0] ?? null,
  },
  {
    key: 'startup' as const,
    url: routes.shop,
    kicker: '成为会员',
    title: '创业专区',
    desc: '高新科技研发的创新型药物，固定单价。付款成功后即可成为会员。',
    imageUrl: null,
  },
])
</script>

<template>
  <view class="entry-grid">
    <view
      v-for="item in entries"
      :key="item.key"
      class="entry-card hit"
      @click="openPage(item.url)"
    >
      <EntryArt :kind="item.key" :image-url="item.imageUrl" />
      <view class="ec-body">
        <text class="ec-kicker">{{ item.kicker }}</text>
        <text class="ec-title">{{ item.title }}</text>
        <text v-if="item.desc" class="ec-desc">{{ item.desc }}</text>
      </view>
    </view>
  </view>
</template>
