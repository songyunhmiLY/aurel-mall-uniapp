import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartLine } from '@/types/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartLine[]>([])
  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  function replace(next: CartLine[]) {
    items.value = next
  }

  return { items, count, replace }
})
