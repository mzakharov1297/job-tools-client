import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { authMessages } from '@/views/PageAuth/PageAuth.consts'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { computed, reactive, ref } from 'vue'
import type { RuleForm } from '@/views/PageAuth/PageAuth.type'

export const usePageAuth = () => {
  const router = useRouter()
  const isLogin = ref<boolean>(true)
  const isLoading = ref<boolean>(false)
  const ruleFormRef = ref<FormInstance>()
   const formModel = reactive<RuleForm>({
    email: '',
    password: '',
  })

   const rules  = reactive<FormRules<RuleForm>>({
    email: [
      { required: true, message: 'Email обязательно', trigger: 'change' },
      {
        pattern: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/,
        message: 'Введите корректный e-mail',
      },
    ],
    password: [
      {
        required: true,
        min: 2,
        max: 6,
        message: 'Не корректная длинна пароля',
      },
    ],
  })

  const signUp = async (): Promise<void> => {
    isLoading.value = true
    try {
      await createUserWithEmailAndPassword(
        getAuth(),
        formModel.email,
        formModel.password,
      )
      ElNotification({
        title: authMessages.registrationSuccessTitle,
        message: authMessages.registrationSuccessMessage,
        type: authMessages.registrationSuccessType,
      })
      await router.push('/')
    } catch (error: unknown) {
      if (error instanceof Error) {
        ElNotification({
          title: 'Ошибка',
          message: `Введены не верные данные - ${error.message}`,
          type: 'error',
        })
      }
    } finally {
      isLoading.value = false
    }
  }

  const signIn = async (): Promise<void> => {
    isLoading.value = true
    try {
      await signInWithEmailAndPassword(
        getAuth(),
        formModel.email,
        formModel.password,
      )
      ElNotification({
        title: 'Успешно',
        message: `Вход выполнен успешно`,
        type: 'success',
      })
      await router.push('/')
    } catch (error: unknown) {
      if (error instanceof Error) {
        ElNotification({
          title: 'Ошибка',
          message: `Введены не верные данные - ${error.message}`,
          type: 'error',
        })
      }
    } finally {
      isLoading.value = false
    }
  }

  const onSubmit = async (formEl: FormInstance | undefined, event: Event) => {
    if (!formEl) {
      return
    }
    await formEl.validate((isValid, invalidFields) => {
      if (isValid) {
        if (isLogin.value) {
          signIn()
        } else {
          signUp()
        }
      } else {
        console.log('error submit', invalidFields)
        ElNotification({
          title: 'Ошибка',
          message: `Ошибка валидации формы`,
          type: 'error',
        })
      }
    })
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  const toggleAuth = () => {
    isLogin.value = !isLogin.value
  }

  const subtitleText = computed<string>(() => {
    return isLogin.value ? 'Аккауна еще нет?' : 'Уже есть аккаунт?'
  })

  const linkAccountText = computed<string>(() => {
    return isLogin.value ? 'Создайте сейчас' : 'Войдите в него'
  })

  const submitButtonText = computed<string>(() => {
    return isLogin.value ? 'Вход' : 'Регистрация'
  })
  return {
    isLoading,
    isLogin,
    router,
    subtitleText,
    linkAccountText,
    submitButtonText,
    ruleFormRef,
    formModel,
    rules,
    signIn,
    signUp,
    onSubmit,
    toggleAuth,
    resetForm,
  }
}
