<template lang="pug">
  div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(:categories="UiStore.getAllCategories" :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20
    main.main-side
      h1.ml20 Checkout
      div(v-if="firstStep")
        table(class="table")
          thead
          tr
            th  #
            th  Title
            th  Qty
            th Price
            th  Sum
          tbody
            tr(v-for="(product, index) in products" :key="product.id")
              td.td-left {{ ++index }}
              td.td-left {{ product.name }}
              td.td-left  {{ product.qty }}
              td.td-left  $ {{ product.price }}
              td.td-left  $ {{ (product.qty * parseFloat(product.price)).toFixed(2) }}
        h3(v-if="promoPrice") Summary: ${{promoPrice}}
        h3(v-else) Summary: ${{CartStore.getSummary.toFixed(2)}}
        h3 Use your Promo Code:
        div.form-control.promo.mb20
          input.promo-field(type="text" id="adress" placeholder="" v-model.trim="promo" @input="checkPromo")
          h3.red(v-if="promoMessage") {{promoMessage}}
        input.package.mr10(type="checkbox" v-model="sep_package")
        span.package Add separate package box for each product
        div.right
          button.btn.primary(@click="toSecondStep" type="button") Next

      div(v-else-if="secondStep")
        form.form-checkout(@submit.prevent)

          div(class="form-control")
            label(for="country") *{{adress[0].label}}
            select(id="country" v-model="adress[0].val" @change="validateChecked(adress, 0)")
              option(value="usa")  United States
              option(value="mexico") Mexico
              option(value="canada") Canada

          div(class="form-control" :class="{invalid: adress[1].error}")
            label(for="adress")  *{{adress[1].label}}
            input(type="text" id="adress" placeholder="Boulevard str 8, fl. 321" v-model.trim="adress[1].val" @input="validateFieldWithIndex(adress, 1)")
            small(v-if="adress[1].error")  {{adress[1].error}}

          div(class="form-control" :class="{invalid: adress[2].error}")
            label(for="zip") *ZIP Code
            input(type="text" placeholder="90123" id="zip" pattern="[0-9]{5}" v-model.trim="adress[2].val" @input="validateFieldWithIndex(adress, 2)")
            small(v-if="adress[2].error")  {{adress[2].error}}

          div(class="form-control" :class="{invalid: adress[3].error}")
            label(for="phone")  *Phone
            input(type="tel"
              placeholder="123-456-7890" id="phone" v-model.trim="adress[3].val" @input="validateFieldWithIndex(adress, 3)")
            small(v-if="adress[3].error")  {{adress[3].error}}

          div(class="form-control")
            label(for="postService") *Post Service
            select(id="postService" v-model="adress[4].val" @change="validateChecked(adress, 4)")
              option(value="ups")  UPS
              option(value="fedex") FedEx

          span.flex-buttons
            button.btn.warning.left(@click="toFirstStep" type="button") Back
            button.btn.primary.right(@click="toThirdStep" :disabled="!validatedSecondStep" type="button") Next

      div(v-else-if="thirdStep")
        form.form-checkout(@submit.prevent)

          fieldset
            legend Select payment method:
            div
              input(type="radio" id="creditCart" value="creditCard" v-model="payment[0].val" @change="validateChecked(payment, 0)")
              label(for="creditCart")  Credit Card
            div
              input(type="radio" id="paymentUponReceipt" value="paymentUponReceipt" v-model="payment[0].val" @change="validateChecked(payment, 0)")
              label(for="paymentUponReceipt")  Payment Upon Receipt

          div(class="form-control")
            label(for="comment") Comment for Order
            textarea(placeholder="Start fill comment..." id="comment" rows="5" cols="33" v-model.trim="payment[1].val")

          span.flex-buttons
            button.btn.warning.left(@click="toSecondStep" type="button") Back
            button.btn.primary.right(:disabled="!validatedThirdStep" @click="createOrder" type="button") Confirm Order

      teleport(to="body")
        app-modal(v-if="modal" title="Order created" @close="modal = false") Your Order # successfully created, please wait message about tracking number

</template>

<!-- this component contains with table of ordered products, form to collect information of customer by 3 steps
all fields has basic validation -->
<script setup lang="ts">
import {useCartStore} from "~/stores/CartStore";
import {computed, reactive, ref, watch} from "vue";
import type {Ref} from "vue"
import AppModal from "~/components/ui/AppModal.vue";
import CategorySide from "~/components/ui/CategorySide.vue";

const CartStore = useCartStore()
import {useUiStore} from "~/stores/UiStore";
import ToggleSidebar from "~/components/ui/ToggleSidebar.vue";
import type {arrInfoType, productInCartType} from "~/utils/types/requestTypes";
import {getKeyByValue, validateChecked, validateFieldWithIndex} from "~/utils/composables/validation";
import {useAuthStore} from "~/stores/AuthStore";
import {addOrder} from "~/services/api/requests";
import {ORDERS_DATABASE, COUNTRIES} from "~/utils/composables/constants";

const AuthStore = useAuthStore()

definePageMeta({
  layout: 'default',
  middleware: 'query-rules'
})

const UiStore = useUiStore()
let firstStep = ref(true)
let secondStep = ref(false)
let thirdStep = ref(false)

let sep_package = ref(false)
let products = CartStore.getCartProducts

const promo = ref('')
const promoMessage = ref('')
const promoPrice = ref<number>()

if (products) {
  products = Object.keys(products).map((id: string) => ({...products[id]}))
}

const modal = ref(false)

/* all adress fields with rules of validation */
const adress: Ref<arrInfoType[]> = ref([
  {
    label: 'Country',
    val: COUNTRIES[AuthStore.country] ? COUNTRIES[AuthStore.country] : '',
    valid: false,
  },
  {
    label: 'Adress',
    val: AuthStore.adress ? AuthStore.adress : '',
    pattern: /^[a-zA-Z .,0-9]{10,100}$/,
    valid: false,
    activated: false,
    error: '',
    errorText: 'Please enter correct adress, minimum 10 symbols'
  },
  {
    label: 'ZIP',
    val: AuthStore.zip ? AuthStore.zip : '',
    pattern: /^[0-9]{5}$/,
    valid: false,
    error: '',
    errorText: 'Please enter correct ZIP code, 5 symbols'
  },
  {
    label: 'Phone',
    val: AuthStore.phone ? AuthStore.phone : '',
    pattern: /^[0-9]{3}-{0,1}[0-9]{3}-{0,1}[0-9]{4}$/,
    valid: false,
    error: '',
    errorText: 'Please enter correct Phone number, format: 123-456-7890 or 1234567890'
  },
  {
    label: 'Post Service',
    val: '',
    valid: false,
  }])

const payment: Ref<arrInfoType[]> = ref([
  {
    label: 'Select payment method',
    val: '',
    valid: false
  },
  {
    label: 'Comment for Order',
    val: '',
    valid: true
  }
])
/* to validate form - collect all fields from form and count - if all valid - customer have access to click to next step */
let validatedSecondStep = computed((): boolean => {
  let validCount: number = 0
  adress.value.forEach((el) => {
    if (el.valid) {
      validCount++
    }
  })
  return validCount === adress.value.length;
})

/* to validate last step, if all fields valid - customer have access to confirm order (send to server) */
let validatedThirdStep = computed((): boolean => {
  let validCount: number = 0
  payment.value.forEach((el) => {
    if (el.valid) {
      validCount++
    }
  })
  return validCount === payment.value.length;
})

/* to select second step window, when user click button from first step */
function toSecondStep(): void {
  thirdStep.value = false
  firstStep.value = false
  secondStep.value = true
}

/* to select third step window, when user click button from second step */
function toThirdStep(): void {
  thirdStep.value = true
  secondStep.value = false
}

/* to select first step window, when user click back button from second step */
function toFirstStep(): void {
  firstStep.value = true
  secondStep.value = false
}

/* to empty form after order confirmed */
const resetForm = (): void => {
  if(!AuthStore.isAuthentificated){
    adress.value.forEach(el => {
      el.val = ''
      el.valid = false
    })
    payment.value.forEach(el => {
      el.val = ''
      if (el.label !== 'Comment for Order') {
        el.valid = false
      }
    })
    sep_package.value = false
  }
}

/* to collect all info from ordered products and filled input fields to object to send to server (must be added later with backend)
after it created modal window about order info */
const createOrder = async (): Promise<void> => {

  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let formattedDate = (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day  + '-' + year;

  let order: { [key: string]: (string | boolean | undefined | {}) } = {}
  order["country"] = getKeyByValue(adress.value[0].val)
  order["email"] = AuthStore.email ? AuthStore.email : ''
  order["adress"] = adress.value[1].val
  order["zip"] = adress.value[2].val
  order["phone"] = adress.value[3].val
  order["postService"] = adress.value[4].val
  order["payMethod"] = payment.value[0].val
  order["comment"] = payment.value[1].val
  order["separatePackage"] = sep_package.value
  order["status"] = 'New'
  order["date"] = formattedDate
  order["products"] = {
    total: promoPrice.value ? promoPrice.value : CartStore.getSummary.toFixed(2),
    products: products
  }

/* there must be sending order to server*/
console.log(order)
  
  try {
    await addOrder(ORDERS_DATABASE, order)
  }catch (e: string | unknown) {
    UiStore.setErrorMessage(e.message)
  }

resetForm()
localStorage.removeItem("cart")
CartStore.clearCart()
modal.value = true
}

const checkPromo = () => {
  if (AuthStore.isAuthentificated && promo.value === AuthStore.getPromoCode) {
    promoMessage.value = 'You will receive' + AuthStore.getPromoValue
    promoPrice.value = CartStore.getSummary.toFixed(2) - AuthStore.getPromoDiscount?.toFixed(2)
    console.log(promoPrice.value)
  } else {
    promoMessage.value = ''
    promoPrice.value = 0
  }
}

if(AuthStore.isAuthentificated){
  validateChecked(adress.value, 0)
  validateFieldWithIndex(adress.value, 1)
  validateFieldWithIndex(adress.value, 2)
  validateFieldWithIndex(adress.value, 3)
}

</script>