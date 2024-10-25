<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import AppHeader from '@/components/AppHeader.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoading = ref(false)

onMounted(() => {
isLoading.value = true
  onAuthStateChanged(getAuth(), user => {
    if (user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ''
    }
    isLoading.value = false

  })
})
</script>

<template>
  <div v-loading="isLoading" class="max-w-[1280px] m-auto p-5">
    <div v-if="!isLoading">
      <AppHeader/>
      <RouterView />
    </div>

  </div>
</template>
