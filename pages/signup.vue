<template lang="pug">
  form(class="card" @submit.prevent="SignUp")
    h1 Sign Up

    div(:class="['form-control', 'mb10', {invalid: auth[0].error}]")
      label(for="email") {{auth[0].label}}
      input(type="email" id="email" v-model.trim="auth[0].val" @input="validateFieldWithIndex(auth, 0)" maxlength="40")
      small(v-if="auth[0].error") {{auth[0].error}}

    div(:class="['form-control', 'mb10', {invalid: auth[1].error}]")
      label(for="fullname") {{auth[1].label}}
      input(type="text" id="fullname" v-model.trim="auth[1].val" @input="validateFieldWithIndex(auth, 1)" maxlength="40")
      small(v-if="auth[1].error") {{auth[1].error}}

    div(:class="['form-control', 'mb10', {invalid: auth[2].error}]")
      label(for="password") {{auth[2].label}}
      input(type="password" id="password" v-model.trim="auth[2].val" @input="validateFieldWithIndex(auth, 2)" maxlength="10")
      small(v-if="auth[2].error") {{auth[2].error}}

    div(:class="['form-control', 'mb10', {invalid: auth[3].error}]")
      label(for="passwordRepeat") {{auth[3].label}}
      input(type="password" id="passwordRepeat" v-model.trim="auth[3].val" @input="validateMatchingPassword()" maxlength="10")
      small(v-if="auth[3].error") {{auth[3].error}}

    button(class="btn main mt10" type="sumbit" :disabled="!validatedAuth" @click="SignUp") Sign Up

    teleport(to="body")
      AppModal(v-if="modal" title="Activate your profile" @close="modal = false") We just sent instruction how to activate your profile on your email {{auth[0].val}}
</template>

<script setup lang="ts">
import {onMounted, type Ref} from "vue"
import {computed, ref} from "vue";
const router = useRouter()
import {useUiStore} from "~/stores/UiStore";
import type {arrInfoType} from "~/utils/types/requestTypes";
const UiStore = useUiStore()
import {validateFieldWithIndex, checkAllFields} from "~/utils/composables/validation";
import AppModal from "~/components/ui/AppModal.vue";
import {useAuthStore} from "~/stores/AuthStore";
const modal = ref(false)
const AuthStore = useAuthStore()

definePageMeta({
  layout: 'auth',
  middleware: 'auth',
})

onMounted(() => {
  if(AuthStore.isAuthentificated){
    router.push({name: 'index'})
  }
})

/* array with all info about fields - email, name, password and repeated password with validation rules */
const auth: Ref<arrInfoType[]> = ref([
  {
    label: 'Please Enter Your Email',
    val: '',
    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    valid: false,
    activated: false,
    error: '',
    errorText: 'Please enter correct email, example: john.carson@gmail.com'
  },
  {
    label: 'Please Enter Your Full Name',
    val: '',
    pattern: /^[0-9A-Za-z ]{3,20}$/,
    valid: false,
    activated: false,
    error: '',
    errorText: 'Please enter correct name, example: John Carson'
  },
  {
    label: 'Please Enter Your Password',
    val: '',
    pattern: /^[0-9A-Za-z]{5,10}$/,
    valid: false,
    error: '',
    errorText: 'Please enter correct password, min 5 - max 10 symbols'
  },
  {
    label: 'Please Repeat Your Password',
    val: '',
    pattern: /^[*.]/,
    valid: false,
    error: '',
    errorText: 'Password isn\'t matching'
  }
])

/* to check if all fields is valid to return true to enable Sign In button */
let validatedAuth = computed(() => checkAllFields(auth.value))

/* to check if password in field 2 and password in filed 3 same - to set this field valid, in another case - show error under this field */
const validateMatchingPassword = (): void => {
  if(auth.value[2].val === auth.value[3].val){
    auth.value[3].error = ''
    auth.value[3].valid = true
  }else{
    auth.value[3].error = auth.value[3].errorText
    auth.value[3].valid = false
  }
}

/* to collect email, name and password to object and send to server */
const SignUp = (): void => {
  let authData = {
    email: auth.value[0].val,
    fullname: auth.value[1].val,
    password: auth.value[2].val
  }
  /* there will be sending data to server, if response positive - redirect to catalog page */
  console.log(authData)
  modal.value = true
  // router.push({name: 'catalog'})
}
</script>
