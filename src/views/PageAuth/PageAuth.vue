<script setup lang="ts">
import { usePageAuth } from '@/views/PageAuth/PageAuth.utils'

const {
  isLoading,
  router,
  subtitleText,
  linkAccountText,
  submitButtonText,
  ruleFormRef,
  formModel,
  rules,
  resetForm,
  onSubmit,
  toggleAuth,
} = usePageAuth()
</script>

<template>
  <el-card class="w-[50%] m-auto">
    <template #header>
      <div class="flex flex-col items-center justify-center">
        <h2 class="text-3xl font-medium mb-3">Приветствую!</h2>
        <div class="select-none">
          <span class="font-medium leading-3">{{ subtitleText }}</span>
          <a
            class="font-medium no-underline ml-2 text-green-500 cursor-pointer"
            @click="toggleAuth"
            >{{ linkAccountText }}</a
          >
        </div>
      </div>
    </template>
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      @keydown.enter="onSubmit(ruleFormRef, $event)"
      :label-position="'top'"
      :model="formModel as Record<string, any>"
      label-width="auto"
    >
      <el-form-item prop="email" label="E-mail:">
        <el-input placeholder="E-mail" v-model="formModel.email" />
      </el-form-item>

      <el-form-item prop="password" label="Пароль:">
        <el-input
          type="password"
          placeholder="Пароль"
          v-model="formModel.password"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :loading="isLoading"
          type="primary"
          @click.prevent="onSubmit(ruleFormRef, $event)"
          >{{ submitButtonText }}
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">Сброс</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
