<script setup lang="ts">
import MenuRow from '@/components/common/MenuRow.vue'
import { openPage, routes } from '@/navigation/routes'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

function openSettings() {
  openPage(routes.settings)
}
</script>

<template>
  <view class="page">
    <view class="profile">
      <view class="avatar">{{ user.avatarText }}</view>
      <view class="profile__text">
        <text class="name">{{ user.nickname }}</text>
      </view>
      <view class="gear" @click="openSettings">⚙</view>
    </view>
    <MenuRow title="创业团队" :url="routes.team" />
    <MenuRow title="邀请好友" :url="routes.invite" note="海报稍后提供" />
    <MenuRow title="我的订单" :url="routes.orderList" />
    <MenuRow title="登录" :url="routes.login" />
  </view>
</template>

<style scoped>
.profile {
  display: flex;
  align-items: center;
  padding: 28rpx;
  background: #fff;
  border-radius: 24rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #d8f3ef;
  color: #0e7c74;
  font-size: 36rpx;
  font-weight: 600;
}

.profile__text {
  flex: 1;
  margin-left: 20rpx;
}

.name {
  font-size: 34rpx;
  font-weight: 600;
}

.gear {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #f2f7f6;
  color: #0e7c74;
  font-size: 36rpx;
  line-height: 72rpx;
  text-align: center;
}
</style>
