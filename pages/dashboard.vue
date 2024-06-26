<template lang="pug">
  div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(:categories="UiStore.getAllCategories" :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20
    div.loader(v-if="loader")
    main.main-side.ml20(v-if="!settings && !loader")
      h1 Hello, {{AuthStore.userName}}!
      h4.link(@click="showSettings") My Settings
      h3 My Promo Codes:
      p <span class="red">{{AuthStore.promo.code}}</span> : {{AuthStore.promo.value}}
      h3 My Orders:
      table.table(v-if="orders" )
        thead
        tr.center
          th  #
          th  Order Date
          th  Products
          th Total
          th Status
          th Action
          th Comment
          th Post Service
        tbody
          tr(v-for="(order, index) in orders" :key="order.id")
            td {{ order.id }}
            td {{ order.date }}
            td
              ul(v-for="product in order.products.products")
                li.left  {{product.name}}, {{product.qty}} pcs
            td ${{order.products.total}}
            td
              span.badge(:class="classesMap[order.status]")  {{ order.status }}
            td
              button.btn.danger(v-if="order.status !=='Canceled'" type="button" @click="cancelOrder(order.id, order)") Cancel
            td {{order.comment}}
            td {{order.postService}}

    main.main-side.ml20(v-if="settings" )
      h3 My Settings
      h4.link(@click="settings = false") Back to Dashboard
      form.half-width
        div.mt20(class="form-control")
          label(for="country") Country
          select(id="country" v-model="adress[0].val" @change="validateChecked(adress, 0)")
            option(value="usa")  United States
            option(value="mexico") Mexico
            option(value="canada") Canada

        div(class="form-control" :class="{invalid: adress[1].error}")
          label(for="adress")  {{adress[1].label}}
          input(type="text" id="adress" placeholder="Boulevard str 8, fl. 321" v-model.trim="adress[1].val" @input="validateFieldWithIndex(adress, 1)")
          small(v-if="adress[1].error")  {{adress[1].error}}

        div(class="form-control" :class="{invalid: adress[2].error}")
          label(for="zip") ZIP Code
          input(type="text" placeholder="90123" id="zip" pattern="[0-9]{5}" v-model.trim="adress[2].val" @input="validateFieldWithIndex(adress, 2)")
          small(v-if="adress[2].error")  {{adress[2].error}}

        div(class="form-control" :class="{invalid: adress[3].error}")
          label(for="phone")  Phone
          input(type="tel"
             placeholder="123-456-7890" id="phone" v-model.trim="adress[3].val" @input="validateFieldWithIndex(adress, 3)")
          small(v-if="adress[3].error")  {{adress[3].error}}
      button.btn.main(:disabled="!validateSettings" @click="updateUserOnServer") Save
      p(v-if="updated") Your profile has been updated

</template>

<script setup lang="ts">

import {useUiStore} from "~/stores/UiStore"
import {useAuthStore} from "~/stores/AuthStore"
import ToggleSidebar from "~/components/ui/ToggleSidebar.vue"
import CategorySide from "~/components/ui/CategorySide.vue"
import {classesMap, COUNTRIES, ORDERS_DATABASE} from "../utils/composables/constants"
import {validateChecked} from "~/utils/composables/validation";
import {validateFieldWithIndex} from "~/utils/composables/validation";
import type {arrInfoType} from "~/utils/types/requestTypes";
import {loadOrdersById, updateInDatabase} from "~/services/api/requests";

definePageMeta({
  layout: 'default',
  middleware: 'query-rules'
})

const router = useRouter()
const orders = ref([])
const UiStore = useUiStore()
const AuthStore = useAuthStore()
const loader = ref(true)
/* all adress fields with rules of validation */

const settings = ref(false)
const updated = ref(false)

onMounted(async () => {
  try {
    orders.value = await getOrdersByEmailId()
    loader.value = false
  }catch (e: string | unknown) {
    UiStore.setErrorMessage(e.message)
  }

})

const adress: Ref<arrInfoType[]> = ref([
  {
    label: 'Country',
    val: '',
    valid: false,
  },
  {
    label: 'Adress',
    val: '',
    pattern: /^[a-zA-Z .,0-9]{10,100}$/,
    valid: false,
    activated: false,
    error: '',
    errorText: 'Please enter correct adress, minimum 10 symbols'
  },
  {
    label: 'ZIP',
    val: '',
    pattern: /^[0-9]{5}$/,
    valid: false,
    error: '',
    errorText: 'Please enter correct ZIP code, 5 symbols'
  },
  {
    label: 'Phone',
    val: '',
    pattern: /^[0-9]{3}-{0,1}[0-9]{3}-{0,1}[0-9]{4}$/,
    valid: false,
    error: '',
    errorText: 'Please enter correct Phone number, format: 123-456-7890 or 1234567890'
  }
])

const showSettings = () => {
  settings.value = true
  adress.value[0].val = COUNTRIES[AuthStore.country]
  adress.value[1].val = AuthStore.adress
  adress.value[2].val = AuthStore.zip
  adress.value[3].val = AuthStore.phone

  validateChecked(adress.value, 0)
  validateFieldWithIndex(adress.value, 1)
  validateFieldWithIndex(adress.value, 2)
  validateFieldWithIndex(adress.value, 3)
}

/* to validate form - collect all fields from form and count - if all valid - customer have access to click to next step */
let validateSettings = computed((): boolean => {
  let validCount: number = 0
  adress.value.forEach((el) => {
    if (el.valid) {
      validCount++
    }
  })
  return validCount === adress.value.length;
})

const updateUserOnServer = async () => {
  if(adress.value[0].val){
    await AuthStore.updateUserinfo(getKeyByValue(adress.value[0].val), adress.value[1].val, adress.value[2].val, adress.value[3].val)
    updated.value = true
    setTimeout(() => {
      updated.value = false
    }, 3000)
  }

}

function getKeyByValue(value: string) {
  return Object.entries(COUNTRIES).find(([key, val]) => val === value)?.[0];
}

const getOrdersByEmailId = async (): Promise<void> => {
    await AuthStore.prepareToken()
   await AuthStore.setUserInfo()
  const response = await loadOrdersById(AuthStore.email)

  let filteredOrders = response.filter((order: {}) => {
    console.log(order.email)
    console.log(AuthStore.email)
    return (order.email === AuthStore.email)
  })
  return filteredOrders
}

const cancelOrder = async (id: number, order: {}): Promise<void> => {
  let updatedOrder = order
  updatedOrder.status = "Canceled"
//   there will be PUT request to server to update order
  try {
    await updateInDatabase(ORDERS_DATABASE + id, updatedOrder)
  }catch (e: string | unknown) {
    UiStore.setErrorMessage(e.message)
  }
}


</script>