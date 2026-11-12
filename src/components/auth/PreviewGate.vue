<script setup lang="ts">
import { ref } from 'vue'
import { tryUnlockPreview } from '@/auth/preview-gate'

const props = defineProps<{ onPassed: () => void }>()

const username = ref('')
const password = ref('')
const error = ref('')
const pending = ref(false)

async function submit() {
  if (pending.value) return
  error.value = ''
  pending.value = true
  try {
    const ok = await tryUnlockPreview(username.value, password.value)
    if (!ok) {
      error.value = '账号或密码不正确'
      return
    }
    props.onPassed()
  } catch {
    error.value = '当前环境无法校验口令'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="gate" @keydown.enter="submit">
    <form class="gate__card" @submit.prevent="submit">
      <div class="gate__brand">AUREL</div>
      <div class="gate__title">预览登录</div>
      <p class="gate__sub">进入奥瑞尔 H5 预览。用户名为 root。</p>
      <label class="gate__field">
        <span class="gate__label">用户名</span>
        <input v-model="username" class="gate__input" autocomplete="username" placeholder="root" />
      </label>
      <label class="gate__field">
        <span class="gate__label">密码</span>
        <input
          v-model="password"
          class="gate__input"
          type="password"
          autocomplete="current-password"
          placeholder="请输入密码"
        />
      </label>
      <p v-if="error" class="gate__error">{{ error }}</p>
      <button class="gate__btn" type="submit">{{ pending ? '校验中' : '进入' }}</button>
    </form>
  </div>
</template>

<style scoped>
.gate {
  position: fixed;
  inset: 0;
  z-index: 4000;
  background: #0b0e13;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.gate__card {
  width: min(380px, 100%);
  margin: 0;
  background: #161a1f;
  border: 1px solid #2c3644;
  border-radius: 16px;
  padding: 28px 24px 24px;
  color: #f3f6f7;
}

.gate__brand {
  font-size: 11px;
  letter-spacing: 0.28em;
  color: #5e8f8a;
}

.gate__title {
  margin-top: 12px;
  font-size: 24px;
  font-weight: 600;
}

.gate__sub {
  margin: 8px 0 0;
  color: #8a9197;
  font-size: 13px;
  line-height: 1.6;
}

.gate__field {
  display: block;
  margin-top: 16px;
}

.gate__label {
  display: block;
  margin-bottom: 6px;
  color: #8a9197;
  font-size: 13px;
}

.gate__input {
  box-sizing: border-box;
  width: 100%;
  height: 46px;
  border-radius: 10px;
  border: 1px solid #2c3644;
  background: #1b2430;
  color: #f3f6f7;
  padding: 0 14px;
  font-size: 15px;
}

.gate__error {
  margin: 12px 0 0;
  color: #e7b2a8;
  font-size: 13px;
}

.gate__btn {
  width: 100%;
  margin-top: 20px;
  height: 46px;
  border: 0;
  border-radius: 8px;
  background: #5e8f8a;
  color: #0e131a;
  font-weight: 600;
  letter-spacing: 0.12em;
  cursor: pointer;
}
</style>
