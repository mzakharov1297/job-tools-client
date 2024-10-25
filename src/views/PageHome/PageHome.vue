<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { IInterview } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid'
import { getAuth } from 'firebase/auth'
import { setDoc, getFirestore, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

type HrForm = Omit<IInterview, 'id' | 'createdAt'>


const router = useRouter()
const isLoading = ref<boolean>(false)
const hrForm = ref<FormInstance>()
const formModel = reactive<HrForm>({
  company: '',
  vacancyDescription: '',
  contactName: '',
  tgUsername: '',
  phone: '',
  waPhoneUsername: '',
})

const rules = reactive<FormRules<HrForm>>({
  company: [
    {
      required: true,
      message: 'Поле Компания обязательно',
    },
  ],
  vacancyDescription: [
    {
      required: true,
      message: 'Поле Описание вакансии обязательно',
    },
  ],
  contactName: [
    {
      required: true,
      message: 'Поле Контакт обязательно',
    },
  ],
})

const addBtnDisable = computed(() => {
  return !(
    formModel.company &&
    formModel.vacancyDescription &&
    formModel.contactName
  )
})

const addNewInterview = async (): Promise<void> => {
  isLoading.value = true
  const payload: IInterview = {
    id: uuidv4(),
    company: formModel.company,
    vacancyDescription: formModel.vacancyDescription,
    contactName: formModel.contactName,
    tgUsername: formModel.tgUsername,
    waPhoneUsername: formModel.waPhoneUsername,
    phone: formModel.phone,
    createdAt: new Date(),
  }
  const userId = await getAuth().currentUser?.uid
  if (userId) {
    try {
      await setDoc(
        doc(getFirestore(), `users/${userId}/interviews`, payload.id),
        payload,
      )
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
      await router.push('/list')
    }
  }
}
</script>

<template>
  <el-card class="w-[50%] m-auto">
    <template #header>
      <h2 class="text-3xl font-medium mb-3">Новое собеседование</h2>
    </template>

    <el-form
      label-width="auto"
      :label-position="'top'"
      :rules="rules"
      :model="formModel"
      ref="hrForm"
    >
      <el-form-item prop="company" label="Компания:">
        <el-input placeholder="Компания" v-model="formModel.company" />
      </el-form-item>

      <el-form-item prop="vacancyDescription" label="Ссылка на вакансию:">
        <el-input
          placeholder="Ссылка на вакансию"
          v-model="formModel.vacancyDescription"
        />
      </el-form-item>

      <el-form-item prop="contactName" label="Контакт:">
        <el-input placeholder="Контакт (имя)" v-model="formModel.contactName" />
      </el-form-item>

      <el-form-item prop="tgUsername" label="Telegram:">
        <el-input
          placeholder="Telegram username HR"
          v-model="formModel.tgUsername"
        />
      </el-form-item>

      <el-form-item prop="waPhoneUsername" label="WhatsApp:">
        <el-input
          placeholder="WhatsApp HR"
          v-model="formModel.waPhoneUsername"
        />
      </el-form-item>

      <el-form-item prop="phone" label="Телефон:">
        <el-input placeholder="Телефон HR" v-model="formModel.phone" />
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="addBtnDisable"
          @click="addNewInterview"
          :loading="isLoading"
          type="primary"
          >Создать собеседование
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
