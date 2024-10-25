<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavMenu } from '@/components/types'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getAuth, signOut } from 'firebase/auth'

const userStore = useUserStore()
const router = useRouter()

const isUserIdExist = computed(() => !!userStore.userId)

const navItems = ref<NavMenu[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed(() => !userStore.userId),
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show: computed(() => !!userStore.userId),
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
    show: computed(() => !!userStore.userId),
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistic',
    show: computed(() => !!userStore.userId),
  },
])

const filteredNavItems = computed(() => {
  return navItems.value.filter(el => el.show)
})

const currentPath = useRoute()

const handleSelect = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}

const signOutMethod = async (): Promise<void> => {
  await signOut(getAuth())
  await router.push('/auth')
}
</script>

<template>
  <div class="mb-10">
    <el-menu
      router
      :default-active="currentPath.path"
      @select="handleSelect"
      class="flex justify-between"
      mode="horizontal"
    >
      <div class="flex">
        <el-menu-item
          v-for="item in filteredNavItems"
          :key="item.label"
          :index="item.path"
        >
          <div
            @click="item.action"
            class="flex justify-center items-center gap-4"
          >
            <span :class="item.icon" style="font-size: 1.3rem"></span>
            {{ item.label }}
          </div>
        </el-menu-item>
      </div>

      <el-menu-item
        @click="signOutMethod"
        v-if="isUserIdExist"
        class="flex gap-4"
      >
        <span style="font-size: 1.3rem" class="pi pi-sign-out"></span>
        Выход
      </el-menu-item>
    </el-menu>
  </div>

</template>

<style scoped>
.el-menu-item {
  font-size: 16px;
}
</style>
