<script setup lang="ts">
import EntryArt from '@/components/visual/EntryArt.vue'
import { openPage, routes } from '@/navigation/routes'

const entries = [
  {
    key: 'welfare' as const,
    url: routes.welfare,
    kicker: '限时参与',
    title: '福利专场',
    desc: '具备资格的会员可报名参加当日红包。',
  },
  {
    key: 'cofounder' as const,
    url: routes.founder,
    kicker: '名额招募',
    title: '联合创始人',
    desc: '了解权益并在开放期间申请开通。',
  },
  {
    key: 'startup' as const,
    url: routes.shop,
    kicker: '成为会员',
    title: '创业专区',
    desc: '高新科技研发的创新型药物，固定单价。付款成功后即可成为会员。',
  },
]
</script>

<template>
  <view class="entry-grid">
    <view v-for="item in entries" :key="item.key" class="entry-card hit" @click="openPage(item.url)">
      <EntryArt :kind="item.key" />
      <view class="ec-body">
        <text class="ec-kicker">{{ item.kicker }}</text>
        <text class="ec-title">{{ item.title }}</text>
        <text class="ec-desc">{{ item.desc }}</text>
      </view>
    </view>
  </view>
</template>
