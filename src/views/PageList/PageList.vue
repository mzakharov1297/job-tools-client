<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  where,
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import {
  type IInterview,
  ResultEnum,
  type UpdatedInterviews,
} from '@/interfaces'

const db = getFirestore()
const userStore = useUserStore()

const interviews = ref<UpdatedInterviews[]>([])
const isLoading = ref<boolean>(true)
const selectedFilterResult = ref<string>(ResultEnum.Pending)

const getAllInterviews = async <T extends IInterview>(
  isFilter?: boolean,
): Promise<T[]> => {
  isLoading.value = true
  let getData

  if (isFilter) {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilterResult.value),
    )
  } else {
    getData = query(
      collection(db, `users/${userStore.userId}/interviews`),
      orderBy('createdAt', 'desc'),
    )
  }

  const listDocs = await getDocs(getData).finally(
    () => (isLoading.value = false),
  )
  return listDocs.docs.map(doc => {
    const data = doc.data()
    if (data?.stage) {
      data.stage = data.stage.map(item => ({
        ...item,
        stageDate: item.stageDate.toDate(),
      }))
    }
    return data as T
  })
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
  try {
    isLoading.value = true
    await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
    const listInterviews: Array<UpdatedInterviews> = await getAllInterviews()
    interviews.value = [...listInterviews]
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}

const tagSelector = (value: ResultEnum) => {
  switch (value) {
    case ResultEnum.Refusal:
      return 'danger'
    case ResultEnum.Offer:
      return 'success'
    case ResultEnum.Pending:
      return 'warning'
    default:
      return 'warning'
  }
}


const tagNameMap: Record<ResultEnum, string> = {
  [ResultEnum.Refusal]: 'Отказ',
  [ResultEnum.Offer]: 'Оффер',
  [ResultEnum.Pending]: 'В процессе',
}

const submitFilter = async (isFilter: boolean): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<UpdatedInterviews> = await getAllInterviews(isFilter)
  interviews.value = [...listInterviews]
}

onMounted(async () => {
  const listInterviews: Array<UpdatedInterviews> = await getAllInterviews()
  interviews.value = [...listInterviews]
  isLoading.value = false
})
</script>

<template>
  <el-card class="m-auto">
    <template #header>
      <h1>Список собеседовний</h1>
      <div class="flex items-center mb-5 gap-2">
        <div class="flex items-center">
          <el-radio-group v-model="selectedFilterResult">
            <el-radio :value="ResultEnum.Pending"> В процессе</el-radio>
            <el-radio :value="ResultEnum.Refusal"> Отказ</el-radio>
            <el-radio :value="ResultEnum.Offer"> Оффер</el-radio>
          </el-radio-group>
        </div>

        <el-button :disabled="!selectedFilterResult" @click="submitFilter(true)" type="primary">Применить</el-button>
        <el-button @click='submitFilter(false)' type="danger">Сбросить</el-button>
      </div>
    </template>
    <el-table
      :fit="false"
      style="width: 100%; overflow-x: auto"
      empty-text="Нет добавленных собеседований"
      v-loading="isLoading"
      :data="interviews"
    >
      <!--      Компания-->
      <el-table-column min-width="150" prop="company" label="Компания" />

      <!--      Ссылка на вакансию-->
      <el-table-column
        min-width="150"
        prop="vacancyDescription"
        label="Ссылка на вакансию"
      >
        <template #default="scope">
          <a
            class="text-blue-400 underline"
            :href="scope.row.vacancyDescription"
            target="_blank"
            >Ссылка на вакансию</a
          >
        </template>
      </el-table-column>

      <!--      Имя HR-->
      <el-table-column min-width="150" prop="contactName" label="Имя HR" />

      <!--      Telegram HR-->
      <el-table-column min-width="150" prop="tgUsername" label="Telegram HR">
        <template #default="scope">
          <div class="flex items-center gap-2">
            <span class="text-blue-400 pi pi-telegram"></span>
            <a
              class="text-blue-400 underline w-full hover:text-blue-500"
              :href="`https://t.me/${scope.row.tgUsername}`"
              target="_blank"
            >
              {{ scope.row.tgUsername }}
            </a>
          </div>
        </template>
      </el-table-column>

      <!--      WA HR-->
      <el-table-column
        min-width="150"
        prop="waPhoneUsername"
        label="WhatApp HR"
      >
        <template #default="scope">
          <div class="flex items-center gap-2">
            <span class="text-green-400 pi pi-whatsapp"></span>
            <a
              class="text-blue-400 underline w-full hover:text-blue-500"
              :href="`https://wa.me/${scope.row.waPhoneUsername}`"
              target="_blank"
            >
              {{ scope.row.waPhoneUsername }}
            </a>
          </div>
        </template>
      </el-table-column>

      <!--      Телефон HR-->
      <el-table-column min-width="150" prop="phone" label="Телефон HR">
        <template #default="scope">
          <div class="flex items-center gap-2">
            <span class="text-green-400 pi pi-phone"></span>
            <a
              class="text-blue-400 underline w-full hover:text-blue-500"
              :href="`tel:${scope.row.phone}`"
              target="_blank"
            >
              {{ scope.row.phone }}
            </a>
          </div>
        </template>
      </el-table-column>

      <!--      Пройденные Этапы-->
      <el-table-column min-width="150" label="Пройденные этапы">
        <template #default="scope">
          <span v-if="!scope.row.stage">-</span>
          <span v-if="scope.row.stage && scope.row.stage.length < 1">-</span>
          <div v-else class="flex gap-2">
            <el-tooltip
              placement="top"
              v-for="(tag, index) in scope.row.stage"
              :key="tag.key"
            >
              <template #content>
                <p>Название: {{ tag.stageName }}</p>
                <p>Дата: {{ tag.stageDate.toLocaleDateString() }}</p>
                <p>Комментарий: {{ tag.stageComment }}</p>
              </template>
              <el-tag round type="success">
                {{ index + 1 }}
              </el-tag>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <!--      Зарплатная вилка-->
      <el-table-column min-width="150" label="Зарплатная вилка">
        <template #default="scope">
          <span v-if="!scope.row.salaryFrom && !scope.row.salaryTo">-</span>
          <span v-else
            >{{
              scope.row.salaryFrom
                ? scope.row.salaryFrom
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                : 'Не указано'
            }}
            -
            {{
              scope.row.salaryTo
                ? scope.row.salaryTo
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                : 'Не указано'
            }}</span
          >
        </template>
      </el-table-column>

      <!--      Результат-->
      <el-table-column min-width="150" label="Результат" prop="result">
        <template #default="scope">
          <el-tag v-if="scope.row.result" :type="tagSelector(scope.row.result)">
            {{ tagNameMap[scope.row.result] }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!--      Actions-->
      <el-table-column fixed="right" width="160" label="Действия">
        <template #default="scope">
          <div class="flex flex-col justify-start items-start gap-2">
            <el-button size="small" type="primary">
              <span class="pi pi-pencil mr-2"></span>
              <router-link :to="`/interview/${scope.row.id}`">
                Редактировать
              </router-link>
            </el-button>

            <el-popconfirm
              @confirm="confirmRemoveInterview(scope.row.id)"
              title="Вы уверены что хотите удалить?"
            >
              <template #reference>
                <el-button style="margin-left: 0" size="small" type="danger">
                  <span class="pi pi-trash mr-2"></span>
                  Удалить
                </el-button>
              </template>
              <template #actions="{ confirm, cancel }">
                <el-button @click="cancel" size="small"> Нет</el-button>
                <el-button type="danger" size="small" @click="confirm">
                  Да
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
