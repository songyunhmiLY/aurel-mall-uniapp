import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiErrorMessage } from '@/api/http'
import { fetchWallets } from '@/api/wallet'
import type { WalletBalances } from '@/types/wallet'

export const useWalletStore = defineStore('wallet', () => {
  const balances = ref<WalletBalances | null>(null)
  const errorText = ref('')
  const loading = ref(false)

  async function load() {
    loading.value = true
    errorText.value = ''
    try {
      balances.value = await fetchWallets()
    } catch (error) {
      balances.value = null
      errorText.value = apiErrorMessage(error, '钱包加载失败')
    } finally {
      loading.value = false
    }
  }

  return { balances, errorText, loading, load }
})
