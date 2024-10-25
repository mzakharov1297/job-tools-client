<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import { type IInterview, ResultEnum, type UpdateDocModel } from '@/interfaces'
import type { FormInstance } from 'element-plus'



const db = getFirestore()
const router = useRoute()
const userStore = useUserStore()
const interview = reactive<IInterview | {}>({})
const editForm = ref<FormInstance>()
const isLoading = ref<boolean>(false)
const formModel = reactive<UpdateDocModel>({
  company: '',
  vacancyDescription: '',
  phone: '',
  waPhoneUsername: '',
  tgUsername: '',
  contactName: '',
  salaryFrom: null,
  salaryTo: null,
  stage: [],
  result: ResultEnum.Pending,
})

const docRef = doc(
  db,
  `users/${userStore.userId}/interviews`,
  String(router.params.id),
)

const getCurrentInterview = async (): Promise<UpdateDocModel> => {
  isLoading.value = true

  const currentDoc = await getDoc(docRef).finally(
    () => (isLoading.value = false),
  )
  const data = currentDoc.data()

  if (data?.stage) {
    data.stage = data.stage.map(item => ({
      ...item,
      stageDate: item.stageDate.toDate(),
    }))
  }

  Object.assign(interview, data as UpdateDocModel)
  Object.assign(formModel, data as UpdateDocModel)
  return data as UpdateDocModel
}

const filterStage = (id: string) => {
  formModel.stage = formModel.stage?.filter(item => item.key !== id)
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true
  await updateDoc(docRef, {
    ...(formModel as UpdateDocModel),
  })

  await getCurrentInterview().finally(() => (isLoading.value = false))
}

onMounted(async () => {
  await getCurrentInterview()
})
</script>
<template>
  <div class="h-full" v-loading="isLoading">
    <el-card v-if="!isLoading" class="w-[40%] m-auto">
      <template #header>
        <h2 class="text-3xl font-medium mb-3">
          Собеседование в компанию
          <span class="text-primary">
            {{ interview.company }}
          </span>
        </h2>
      </template>
      <el-form
        label-suffix=":"
        ref="editForm"
        :label-position="'top'"
        :model="formModel"
        label-width="auto"
      >
        <el-form-item prop="company" label="Компания">
          <el-input placeholder="Компания" v-model="formModel.company" />
        </el-form-item>
        <el-form-item prop="vacancyDescription" label="Ссылка на вакансию:">
          <el-input
            placeholder="Ссылка на вакансию"
            v-model="formModel.vacancyDescription"
          />
        </el-form-item>

        <el-form-item prop="contactName" label="Контакт">
          <el-input
            placeholder="Контакт (имя)"
            v-model="formModel.contactName"
          />
        </el-form-item>

        <el-form-item prop="tgUsername" label="Telegram">
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

        <el-form-item prop="phone" label="Телефон">
          <el-input placeholder="Телефон HR" v-model="formModel.phone" />
        </el-form-item>

        <el-form-item label="Зарплатная вилка">
          <el-col :span="11">
            <el-form-item label="От" prop="salaryFrom">
              <el-input
                type="number"
                placeholder="Зарплата от"
                v-model="formModel.salaryFrom"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="11">
            <el-form-item label="До" prop="salaryTo">
              <el-input
                type="text"
                placeholder="Зарплата до"
                v-model="formModel.salaryTo"
              />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-row class="w-full" justify="center">
            <el-button
              type="primary"
              @click="
                formModel.stage?.push({
                  key: uuidv4(),
                  stageName: '',
                  stageDate: new Date(),
                  stageComment: '',
                })
              "
            >
              <span class="pi pi-plus mr-2"></span>
              Добавить этап
            </el-button>
          </el-row>
        </el-form-item>

        <el-form-item v-for="item in formModel.stage" :key="item.key">
          <el-card class="w-full">
            <el-form-item label="Название этапа" :prop="item.stageName">
              <el-input placeholder="Название этапа" v-model="item.stageName" />
            </el-form-item>

            <el-form-item
              label="Дата прохождения этапа"
              prop="'formModel.stage['+ index + '].stageDate'"
            >
              <el-date-picker
                type="date"
                format="DD.MM.YYYY"
                placeholder="Дата прохождения этапа"
                v-model="item.stageDate"
              />
            </el-form-item>
            <el-form-item label="Комментарий" :prop="item.stageComment">
              <el-input
                type="textarea"
                resize="none"
                :autosize="{
                  minRows: 4,
                  maxRows: 6,
                }"
                placeholder="Название этапа"
                v-model="item.stageComment"
              />
            </el-form-item>

            <el-button
              class="mt-2"
              type="danger"
              @click="filterStage(item.key)"
            >
              Удалить этап
            </el-button>
          </el-card>
        </el-form-item>

        <el-form-item>
          <el-radio-group v-model="formModel.result">
            <el-radio :value="ResultEnum.Pending">В ожидании</el-radio>
            <el-radio :value="ResultEnum.Refusal">Отказ</el-radio>
            <el-radio :value="ResultEnum.Offer">Оффер</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button @click="saveInterview" type="primary">
            Сохранить
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
