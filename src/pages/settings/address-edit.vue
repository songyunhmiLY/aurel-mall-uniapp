<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import {
  createAddress,
  fetchAddress,
  fetchAddresses,
  updateAddress,
  type AddressInput,
} from '@/api/address'
import { isAccountBlockedError } from '@/api/http'
import { sessionErrorMessage } from '@/auth/account-session'
import AppFrame from '@/components/chrome/AppFrame.vue'

const editingId = ref('')
const contactName = ref('')
const phone = ref('')
const province = ref('')
const city = ref('')
const district = ref('')
const detail = ref('')
const isDefault = ref(false)
const pending = ref(false)
const errorText = ref('')

onLoad((query) => {
  const id = typeof query?.id === 'string' ? query.id : ''
  editingId.value = id
  if (!id) return
  void load(id)
})

async function load(id: string) {
  try {
    const item = await fetchAddress(id)
    if (item) {
      fill(item)
      return
    }
  } catch (error) {
    if (isAccountBlockedError(error)) {
      errorText.value = sessionErrorMessage(error, '地址加载失败')
      return
    }
  }
  try {
    const list = await fetchAddresses()
    const found = list.find((item) => item.id === id)
    if (!found) {
      errorText.value = '地址不存在'
      return
    }
    fill(found)
  } catch (error) {
    errorText.value = sessionErrorMessage(error, '地址加载失败')
  }
}

function fill(item: AddressInput & { id?: string }) {
  contactName.value = item.contactName
  phone.value = item.phone
  province.value = item.province
  city.value = item.city
  district.value = item.district
  detail.value = item.detail
  isDefault.value = item.isDefault
}

async function save() {
  if (pending.value) return
  const body: AddressInput = {
    contactName: contactName.value.trim(),
    phone: phone.value.trim(),
    province: province.value.trim(),
    city: city.value.trim(),
    district: district.value.trim(),
    detail: detail.value.trim(),
    isDefault: isDefault.value,
  }
  if (
    !body.contactName ||
    !body.phone ||
    !body.province ||
    !body.city ||
    !body.district ||
    !body.detail
  ) {
    uni.showToast({ title: '请填写完整地址', icon: 'none' })
    return
  }
  pending.value = true
  errorText.value = ''
  try {
    if (editingId.value) await updateAddress(editingId.value, body)
    else await createAddress(body)
    uni.showToast({ title: '已保存', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 400)
  } catch (error) {
    errorText.value = sessionErrorMessage(error, '地址未保存')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AppFrame :title="editingId ? '编辑地址' : '新增地址'">
    <view class="pad">
      <view v-if="errorText" class="notice mb-12">{{ errorText }}</view>
      <view class="field">
        <text class="field__label">收货人</text>
        <input v-model="contactName" class="field__input" maxlength="64" placeholder="姓名" />
      </view>
      <view class="field">
        <text class="field__label">手机号</text>
        <input v-model="phone" class="field__input" maxlength="32" placeholder="手机号" />
      </view>
      <view class="field">
        <text class="field__label">省</text>
        <input v-model="province" class="field__input" maxlength="32" placeholder="省" />
      </view>
      <view class="field">
        <text class="field__label">市</text>
        <input v-model="city" class="field__input" maxlength="32" placeholder="市" />
      </view>
      <view class="field">
        <text class="field__label">区</text>
        <input v-model="district" class="field__input" maxlength="32" placeholder="区" />
      </view>
      <view class="field">
        <text class="field__label">详细地址</text>
        <input v-model="detail" class="field__input" maxlength="255" placeholder="街道、门牌" />
      </view>
      <view class="row mb-12 hit" @click="isDefault = !isDefault">
        <view class="check" :class="{ 'is-on': isDefault }" />
        <text class="t-14" style="margin-left: 8px">设为默认地址</text>
      </view>
      <view class="btn btn-primary btn-block hit" @click="save">保存</view>
    </view>
  </AppFrame>
</template>
