<template lang="pug">
  form(class="card" @submit.prevent)
    h1 Please enter email
    div.mb10 We will send your password to your email

    div(:class="['form-control', 'mb10', {invalid: auth[0].error}]")
      input(type="email" id="email" v-model.trim="auth[0].val" @input="validateFieldWithIndex(auth, 0)")
      small(v-if="auth[0].error") {{auth[0].error}}

    button(class="btn main mt10" type="sumbit" :disabled="!auth[0].valid" @click="SendEmail") Send Email

    teleport(to="body")
      app-modal(v-if="modal" title="Your password was sent" @close="modal = false") Please check your inbox on email
</template>

<!-- component renders form to collect email and send request to server (must be realized with back-end) -->
<script setup lang="ts">
import {ref} from "vue";
import type {Ref} from "vue"
import {useUiStore} from "~/stores/UiStore";
import AppModal from "~/components/ui/AppModal.vue";
import type {arrInfoType} from "~/utils/types/requestTypes";
import {validateFieldWithIndex} from "~/utils/composables/validation";

definePageMeta({
  layout: 'auth',
  middleware: 'auth'
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
const SendEmail = (): void => {
  let authData = {
    email: auth.value[0].val
  }
  /* must be realized with back-end */
  console.log(authData)

  modal.value = true

}
</script>
