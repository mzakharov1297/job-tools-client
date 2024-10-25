import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userId = ref<string>('')

  const signOutMethod = () => {
    return (userId.value = '')
  }



  return {
    userId,
    signOutMethod,
  }
})
