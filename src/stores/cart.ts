import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartLine } from '@/types/cart'

function seed(): CartLine[] {
  return []
}

function linePrice(item: CartLine): number {
  if (typeof item.price === 'number') return item.price
  const parsed = Number(String(item.priceText).replace(/[^\d.]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartLine[]>(seed())

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const selected = computed(() => items.value.filter((item) => item.checked !== false))
  const selectedAmount = computed(() =>
    selected.value.reduce((sum, item) => sum + linePrice(item) * item.quantity, 0),
  )
  const selectedPv = computed(() =>
    selected.value.reduce((sum, item) => sum + (item.pv || 0) * item.quantity, 0),
  )

  function replace(next: CartLine[]) {
    items.value = next.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      checked: item.checked !== false,
    }))
  }

  function add(
    product: { id: string; name: string; price: number; pv?: number; tone?: string },
    qty = 1,
  ) {
    const found = items.value.find((item) => item.id === product.id)
    if (found) {
      found.quantity += qty
      found.checked = true
      return
    }
    items.value.push({
      id: product.id,
      name: product.name,
      quantity: qty,
      price: product.price,
      pv: product.pv || 0,
      tone: product.tone,
      priceText: product.price.toFixed(2),
      checked: true,
    })
  }

  function changeQty(id: string, delta: number) {
    const found = items.value.find((item) => item.id === id)
    if (!found) return
    found.quantity = Math.max(1, found.quantity + delta)
  }

  function toggle(id: string) {
    const found = items.value.find((item) => item.id === id)
    if (!found) return
    found.checked = found.checked === false
  }

  function remove(id: string) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  return {
    items,
    count,
    selected,
    selectedAmount,
    selectedPv,
    replace,
    add,
    changeQty,
    toggle,
    remove,
  }
})
