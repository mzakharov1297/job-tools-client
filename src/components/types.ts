import type { ComputedRef } from 'vue'

export interface NavMenu {
  label: string
  icon: string
  path: string
  show?: ComputedRef<boolean>
  action?: () => void
}
