<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { deleteAddress, fetchAddresses, setDefaultAddress, type Address } from '@/api/address'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'
import { openPage, routes, withQuery } from '@/navigation/routes'

const items = ref<Address[]>([])
const loaded = ref(false)
const errorText = ref('')

onShow(() => {
  void load()
})

async function load() {
  errorText.value = ''
  try {
    items.value = await fetchAddresses()
  } catch (error) {
    items.value = []
    errorText.value = sessionErrorMessage(error, '地址加载失败')
  } finally {
    loaded.value = true
  }
}

function regionLine(item: Address): string {
  return [item.province, item.city, item.district, item.detail].filter(Boolean).join(' ')
}

function edit(id = '') {
  openPage(withQuery(routes.addressEdit, id ? { id } : {}))
}

async function makeDefault(item: Address) {
  if (item.isDefault) return
  try {
    await setDefaultAddress(item.id)
    await load()
  } catch (error) {
    uni.showToast({ title: sessionErrorMessage(error, '未能设为默认'), icon: 'none' })
  }
}

function remove(item: Address) {
  uni.showModal({
    title: '删除地址',
    content: '确定删除该收货地址？',
    success(result) {
      if (!result.confirm) return
      void deleteAddress(item.id)
        .then(() => load())
        .catch((error: unknown) => {
          uni.showToast({ title: sessionErrorMessage(error, '删除失败'), icon: 'none' })
        })
    },
  })
}
</script>

<template>
  <AppFrame title="收货地址">
    <view class="pad">
      <view v-if="errorText" class="notice mb-12">{{ errorText }}</view>
      <view v-if="loaded && !items.length && !errorText" class="empty">
        <view class="empty__title">还没有收货地址</view>
      </view>
      <view v-for="item in items" :key="item.id" class="card card-pad mb-12">
        <text class="fw-6"
          >{{ item.contactName }} <text class="muted t-13">{{ item.contactPhone }}</text></text
        >
        <text v-if="item.isDefault" class="tag tag-gold">默认</text>
        <text class="muted t-13 mt-8">{{ regionLine(item) }}</text>
        <view class="row mt-12">
          <text class="t-13 fw-6 hit" @click="edit(item.id)">编辑</text>
          <text
            v-if="!item.isDefault"
            class="t-13 fw-6 hit"
            style="margin-left: 16px"
            @click="makeDefault(item)"
          >
            设为默认
          </text>
          <text class="t-13 fw-6 hit" style="margin-left: 16px" @click="remove(item)">删除</text>
        </view>
      </view>
      <view class="btn btn-primary btn-block hit" @click="edit()">新增地址</view>
    </view>
  </AppFrame>
</template>
