<template lang="pug">
  div
    div(class="modal-backdrop")
    div.modal
      div.float-right(@click="emit('close')") X
      div(v-if="!orderSended")
        h3(v-if="title") {{ title }}
        div.mb50
          div(class="form-control" :class="{invalid: phone.error}")
            label(for="phone")  *Phone
            input(type="tel"
              placeholder="123-456-7890" id="phone" v-model.trim="phone.val" @input="validateField(phone)")
            small(v-if="phone.error")  {{phone.error}}

          div(class="form-control" :class="{invalid: name.error}")
            label(for="name")  *Full Name
            input(type="text"
              placeholder="John Doe" id="name" v-model.trim="name.val" @input="validateField(name)")
            small(v-if="name.error")  {{name.error}}
        div.mt10
          button.primary.btn(@click="sendQuickOrder" :disabled="!(name.valid && phone.valid)" type="button") Order Now
      div.mt50(v-else)
        div.mb20 Customer Service Team will call you soon as possible, thanks for order
        button.primary.btn.block.center(@click="emit('close')") Ok
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {productType} from "@/utils/types/requestTypes";
import {validateField} from "@/utils/composables/validation"

const orderSended = ref(false)

const emit = defineEmits(['close'])
const props = defineProps<{
  title: string,
  product: productType,
  qty: number
}>()

const product = props.product

const qty = props.qty

/* initialization of name input field, by default it is empty and not activated. Pattern - any letters and space, from 3 to 50 symbols */
const name = ref({
  val: '',
  activated: false,
  valid: false,
  pattern: /^[a-zA-Z ]{3,50}$/,
  error: '',
  errorText: 'Please enter correct Name, minimum 3 symbols'
})

/* initialization of phone input field, by default it is empty and not activated. Pattern - 123-123-0234 or 1231230234 format will be valid */
const phone = ref({
  val: '',
  activated: false,
  valid: false,
  pattern: /^[0-9]{3}-{0,1}[0-9]{3}-{0,1}[0-9]{4}$/,
  error: '',
  errorText: 'Please enter correct Phone number, format: 123-456-7890 or 1234567890'
})

/* to put all fields and current product object to one object and can be sended to server,
 orderSended - ref, if true - will be called another window, that confirmed successfull quick order */
const sendQuickOrder = (): void => {
  let order: {[key: string]: (string | boolean | {})} = {}
  order["name"] = name.value.val
  order["phone"] = phone.value.val
  order["product"] = {
    productId: product.id,
    productQty: qty,
    productPrice: product.price,
    productSum: (parseFloat(product.price) * qty).toFixed(2)
  }
  orderSended.value = true
}

</script>