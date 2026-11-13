<script setup lang="ts">
import { computed } from 'vue'
import LockPanel from '@/components/common/LockPanel.vue'
import { openPage, routes, type TabKey } from '@/navigation/routes'
import { usePreviewStore } from '@/stores/preview'
import NavBar from './NavBar.vue'
import StatusBar from './StatusBar.vue'
import TabBar from './TabBar.vue'

const props = withDefaults(
  defineProps<{
    title: string
    tab?: TabKey | ''
    back?: boolean
    ink?: boolean
    showCart?: boolean
    guestOk?: boolean
  }>(),
  {
    tab: '',
    back: undefined,
    ink: false,
    showCart: false,
    guestOk: false,
  },
)

const preview = usePreviewStore()
const showBack = computed(() => (props.back == null ? !props.tab : props.back))
const locked = computed(() => !props.guestOk && !preview.loggedIn)

function goLogin() {
  openPage(routes.login)
}
</script>

<template>
  <view class="frame" :class="{ 'frame--ink': ink }">
    <!-- #ifdef H5 -->
    <StatusBar />
    <!-- #endif -->
    <NavBar :title="title" :back="showBack" :show-cart="showCart" />
    <view class="frame__body">
      <view v-if="locked && preview.entering" class="empty">
        <view class="empty__title">正在进入预览</view>
      </view>
      <LockPanel
        v-else-if="locked"
        title="请先登录"
        text="登录后即可查看首页、商城、钱包与个人中心。"
        action="去登录"
        @action="goLogin"
      />
      <slot v-else />
    </view>
    <slot v-if="!locked" name="footer" />
    <TabBar v-if="tab" :current="tab" />
    <view v-if="!locked" class="frame__overlay">
      <slot name="overlay" />
    </view>
  </view>
</template>
