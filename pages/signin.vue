<template lang="pug">
  form(class="card" @submit.prevent="SignIn")
    h1 Sign In

    div(:class="['form-control', 'mb10', {invalid: auth[0].error}]")
      label(for="email") {{auth[0].label}}
      input(type="email" id="email" v-model.trim="auth[0].val" @input="validateFieldWithIndex(auth, 0)")
      small(v-if="auth[0].error") {{auth[0].error}}

    div(:class="['form-control', 'mb10', {invalid: auth[1].error}]")
      label(for="password") {{auth[1].label}}
      input(type="password" id="password" v-model.trim="auth[1].val" @input="validateFieldWithIndex(auth, 1)")
      small(v-if="auth[1].error") {{auth[1].error}}

    button(class="btn main mt10" type="sumbit" :disabled="!validatedAuth" @click="SignIn") Sign In
    div.mt10
      nuxt-link(:to="{path: '/forgotpassword'}" tag="div")
        small.link Forgot Password?
      //span &nbsp;or
      nuxt-link.block(:to="{path: '/signup'}" tag="div")
        small.link Create account
</template>

<script setup lang="ts">
import {onMounted, type Ref} from "vue"
import {computed, ref} from "vue";
const router = useRouter()
import {useUiStore} from "~/stores/UiStore";
import {VUE_APP_FB_URL} from "~/utils/composables/constants";
import type {arrInfoType} from "~/utils/types/requestTypes";
const UiStore = useUiStore()
import {validateFieldWithIndex} from "~/utils/composables/validation";
import {checkAllFields} from "~/utils/composables/validation";
import {useAuthStore} from "~/stores/AuthStore";
import {login} from "~/services/api/auth";
import {load} from "~/services/api/requests";
const AuthStore = useAuthStore()

definePageMeta({
  layout: 'auth',
  middleware: ['auth', 'main']
})

onMounted(async () => {
  if(AuthStore.isAuthentificated){
    router.push({name: 'index'})
  }
})

/* array with all info about fields - email and password, with validation rules */
const auth: Ref<arrInfoType[]> = ref([
  {
    label: 'Email',
    val: '',
    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    valid: false,
    activated: false,
    error: '',
    errorText: 'Please enter correct email, example: john.carson@gmail.com'
  },
  {
    label: 'Password',
    val: '',
    pattern: /^[0-9A-Za-z]{5,10}$/,
    valid: false,
    error: '',
    errorText: 'Please enter correct password, min 5 - max 10 symbols'
  }
])

/* to check if all fields is valid to return true to enable Sign In button */
let validatedAuth = computed(() => checkAllFields(auth.value))

/* to collect email, password to object and send to server */
const SignIn = async (): Promise<void> => {
  let authData = {
    email: auth.value[0].val,
    password: auth.value[1].val
  }

  /* there will be sending data to server, if response positive - redirect to catalog page */
  try {
    let data = await login(authData)
    AuthStore.setToken(data.idToken)
    let userData = await load('userData', VUE_APP_FB_URL + `/users/v_gmail_com.json?auth=${data.idToken}`)
    if(userData){
      AuthStore.setUserInfo(userData)
    }
    await router.push({name: 'index'})
  } catch (e: any | undefined) {
    UiStore.setErrorMessage(e.message);
  }

}

</script>
