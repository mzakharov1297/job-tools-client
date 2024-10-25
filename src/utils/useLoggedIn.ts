import { onBeforeMount, onMounted, onUpdated, type Ref, ref } from 'vue'
import { useUserStore } from '@/stores/user'

export const useLoggedIn = (): {
  isLoggedIn: Ref<boolean>
} => {
  const isLoggedIn = ref(false)
  const userStore = useUserStore()

  onBeforeMount(() => {
    isLoggedIn.value = !!userStore.userId;
  })

  onUpdated(() => {
    isLoggedIn.value = !!userStore.userId;
  })

  return {
    isLoggedIn,
  }
}
