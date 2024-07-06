<template lang="pug">
  div.danger(v-if="serverError") {{serverError}}
  form(class="card" @submit.prevent)
    h1 Sign Up

    div(:class="['form-control', 'mb10', {invalid: auth[0].error}]")
      label(for="email") {{auth[0].label}}
      input(type="email" id="email" v-model.trim="auth[0].val" @input="validateFieldWithIndex(auth, 0)" maxlength="40")
      small(v-if="auth[0].error") {{auth[0].error}}

    div(:class="['form-control', 'mb10', {invalid: auth[1].error}]")
      label(for="fullname") {{auth[1].label}}
      input(type="text" id="fullname" v-model.trim="auth[1].val" @input="validateFieldWithIndex(auth, 1)" maxlength="40")
      small(v-if="auth[1].error") {{auth[1].error}}

    div.mt20(class="form-control")
      label(for="country") {{auth[2].label}}
      select(id="country" v-model="auth[2].val")
        option(value="usa")  United States
        option(value="mexico") Mexico
        option(value="canada") Canada

    div(class="form-control")
        label(for="address") {{auth[3].label}}
        input(type="text" id="address" placeholder="Boulevard str 8, fl. 321" v-model.trim="auth[3].val")

    div(class="form-control")
      label(for="zip") {{auth[4].label}}
      input(type="text" placeholder="90123" id="zip" v-model.trim="auth[4].val")

    div(class="form-control")
      label(for="phone")  {{auth[5].label}}
      input(type="tel" placeholder="123-456-7890" id="phone" v-model.trim="auth[5].val")

    div(:class="['form-control', 'mb10', {invalid: auth[6].error}]")
      label(for="password") {{auth[6].label}}
      input(type="password" id="password" v-model.trim="auth[6].val" @input="validateFieldWithIndex(auth, 6)" maxlength="10")
      small(v-if="auth[6].error") {{auth[6].error}}

    div(:class="['form-control', 'mb10', {invalid: auth[7].error}]")
      label(for="passwordRepeat") {{auth[7].label}}
      input(type="password" id="passwordRepeat" v-model.trim="auth[7].val" @input="validateMatchingPassword()" maxlength="10")
      small(v-if="auth[7].error") {{auth[7].error}}

    button(class="btn main mt10" type="sumbit" :disabled="!validatedAuth" @click="SignUp") Sign Up

    teleport(to="body")
      AppModal(v-if="modal" title="Activate your profile" @close="modal = false") You successfully created account with email {{auth[0].val}}
</template>

<script setup lang="ts">
import {signUp} from "~/services/api/auth";
import {createUser, updateUser} from "~/services/api/requests";

const router = useRouter()
const UiStore = useUiStore()
const modal = ref(false)
const AuthStore = useAuthStore()

const serverError = ref('')

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
    label: 'Country (Optional)',
    val: '',
    valid: true,
  },
  {
    label: 'Address (Optional)',
    val: '',
    valid: true,
  },
  {
    label: 'ZIP (Optional)',
    val: '',
    valid: true,
  },
  {
    label: 'Phone (Optional)',
    val: '',
    valid: true,
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

/* to check if all required fields is valid to return true to enable Sign In button */
let validatedAuth = computed(() => (checkAllFields(auth.value)))

/* to check if password in field 2 and password in filed 3 same - to set this field valid, in another case - show error under this field */
const validateMatchingPassword = (): void => {
  if(auth.value[6].val === auth.value[7].val){
    auth.value[7].error = ''
    auth.value[7].valid = true
  }else{
    auth.value[7].error = auth.value[7].errorText
    auth.value[7].valid = false
  }
}

/* to collect email, name and password to object and send to server */
const SignUp = async (): Promise<void> => {
  let authData = {
    email: auth.value[0].val,
    name: auth.value[1].val,
    country: auth.value[2].val ? COUNTRIES[auth.value[2].val] : '',
    address: auth.value[3].val,
    zip: auth.value[4].val,
    phone: auth.value[5].val,
    password: auth.value[6].val,
    promo: {"code": '', "discount": null, "value": ''}
  }

  try {
    const response = await signUp({email: authData.email, password: authData.password})
    AuthStore.setToken(response.idToken)
    const userCreated = await createUser(VUE_APP_FB_URL + `/users/${encode(authData.email)}.json?auth=${AuthStore.getToken}`, authData)
    modal.value = true
  }catch (e: string | unknown) {
     serverError.value = e.message
   }

}
</script>