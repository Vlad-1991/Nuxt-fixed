<template lang="pug">
  form(class="card" @submit.prevent)
    h1 Please enter email
    div.mb10 We will send your password to your email

    div(:class="['form-control', 'mb-[10px]', {invalid: auth[0].error}]")
      input(type="email" id="email" v-model.trim="auth[0].val" @input="validateFieldWithIndex(auth, 0)")
      small(v-if="auth[0].error") {{auth[0].error}}

    button(class="btn main mt10" type="sumbit" :disabled="!auth[0].valid" @click="SendEmail") Reset Password

    teleport(to="body")
      app-modal(v-if="modal" title="Your password was sent" @close="modal = false") Please check your inbox on email, then click on link to reset password
</template>

<!-- component renders form to collect email and send request to server (must be realized with back-end) -->
<script setup lang="ts">
import {resetPassword} from "~/services/api/auth";

const AuthStore = useAuthStore()
const router = useRouter()

definePageMeta({
  layout: 'auth',
  middleware: 'auth'
})

onMounted(() => {
  if(AuthStore.isAuthentificated){
    router.push({name: 'index'})
  }
})

const UiStore = useUiStore()

const auth: Ref<arrInfoType[]> = ref([
  {
    label: 'Email',
    val: '',
    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    valid: false,
    activated: false,
    error: '',
    errorText: 'Please enter correct email, example: john.carson@gmail.com'
  }
])

const modal = ref(false)

/*  Send email with password to user email */
const SendEmail = async (): void => {
  let authData = {
    email: auth.value[0].val,
    requestType: "PASSWORD_RESET"
  }

  try {
    await resetPassword(authData)
  }catch (e: string | unknown) {
    console.log(e.message)
  }

  modal.value = true

}
</script>
