<template lang="pug">
  div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(:categories="UiStore.getAllCategories" :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20

    main.main-side.ml20(v-if="!settings")
      h1 Hello, {{AuthStore.userName}}!
      h4.link(@click="showSettings") My Settings
      h3 My Promo Codes:
      h3(v-if="!AuthStore.promo.code") There are no any promocodes
      p(v-else) <span class="red">{{AuthStore.promo.code}}</span> : {{AuthStore.promo.value}}
      h3 My Orders:
      div.loader(v-if="loader")
      table.table(v-if="orders.length > 0 && !loader" )
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
          tr.order-item(v-for="(order, index) in orders" :key="order.id")
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
      div.vertical-table(v-if='orders.length > 0 && !loader')
        div.order-item(v-for='(order, index) in orders' :key='order.id')
          div.order-row
            div.order-cell
              strong #:
              |  {{ order.id }}
            div.order-cell
              strong Order Date:
              |  {{ order.date }}
            div.order-cell
              strong Products:
              ul.product-list
                li(v-for='product in order.products.products')
                  | {{ product.name }}, {{ product.qty }} pcs
            div.order-cell
              strong Total:
              |  ${{ order.products.total }}
            div.order-cell
              strong Status:
              span(:class='classesMap[order.status]') {{ order.status }}
            div.order-cell(v-if="order.status !== 'Canceled'")
              button.btn.danger(type='button' @click='cancelOrder(order.id, order)') Cancel
            div.order-cell
              strong Comment:
              |  {{ order.comment }}
            div.order-cell
              strong Post Service:
              |  {{ order.postService }}
      h3(v-else) There are no any orders yet
    main.main-side.ml20(v-if="settings" )
      h3 My Settings
      h4.link(@click="settings = false") Back to Dashboard
      div.cart_flex.dashboard-settings
        form.half-width

          div(class="form-control" :class="{invalid: adress[4].error}")
            label(for="full_name")  {{adress[4].label}}
            input(type="text" id="full_name" placeholder="John Doe" v-model.trim="adress[4].val" @input="validateFieldWithIndex(adress, 4)")
            small(v-if="adress[4].error")  {{adress[4].error}}

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

        form.half-width
          div(:class="['form-control', 'mb10', {invalid: password[0].error}]")
            label(for="newpassword") {{password[0].label}}
            input(type="password" id="newpassword" v-model.trim="password[0].val" @input="validateFieldWithIndex(password, 0)" maxlength="10")
            small(v-if="password[0].error") {{password[0].error}}
          button.btn.warning(type="button" :disabled="!password[0].valid" @click="initChangePassword()") Change Password
          h4.primary(v-if="pasChanged") Your password was successfully changed
</template>

<script setup lang="ts">
import {loadOrdersById, updateInDatabase} from "~/services/api/requests";
import {changePassword} from "~/services/api/auth";

definePageMeta({
  layout: 'default',
  middleware: ['query-rules', 'dashboard']
})

const router = useRouter()
const orders = ref([])
const UiStore = useUiStore()
const AuthStore = useAuthStore()
const loader = ref(true)
const pasChanged = ref(false)

/* all adress fields with rules of validation */

const settings = ref(false)
const updated = ref(false)

onMounted(async () => {
  try {
    orders.value = await getOrdersByEmailId()
    loader.value = false
  } catch (e: string | unknown) {
    UiStore.setErrorMessage(e.message)
  }

})

await AuthStore.prepareToken()
/* if user log out from dashboard page - redirect to Home */
const authorized = computed(() => AuthStore.getToken)

watch(authorized, async (newVal): Promise<void> => {
  if (!newVal) {
    await router.push({name: 'index'})
  }
},  { immediate: true })

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
  },
  {
    label: 'Full Name',
    val: '',
    pattern: /^[a-zA-Z .,0-9]{3,100}$/,
    valid: false,
    activated: false,
    error: '',
    errorText: 'Please enter correct full name, minimum 3 symbols'
  }
])

const password: Ref<[{}]> = ref([
  {
    label: 'Type new password',
    val: '',
    pattern: /^[0-9A-Za-z]{5,10}$/,
    valid: false,
    error: '',
    errorText: 'Please enter correct password, min 5 - max 10 symbols'
  }
])

const showSettings = () => {
  settings.value = true
  adress.value[0].val = COUNTRIES[AuthStore.country]
  adress.value[1].val = AuthStore.adress
  adress.value[2].val = AuthStore.zip
  adress.value[3].val = AuthStore.phone
  adress.value[4].val = AuthStore.getUserName

  validateChecked(adress.value, 0)
  validateFieldWithIndex(adress.value, 1)
  validateFieldWithIndex(adress.value, 2)
  validateFieldWithIndex(adress.value, 3)
  validateFieldWithIndex(adress.value, 4)
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
  if (adress.value[0].val) {
    await AuthStore.updateUserinfo(getKeyByValue(adress.value[0].val), adress.value[1].val, adress.value[2].val, adress.value[3].val, adress.value[4].val)
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
  const data = await loadOrdersById()

  let filteredOrders = data.filter((order: {}) => {
    return (order.email === AuthStore.email)
  })

  filteredOrders.sort((a: {}, b: {}) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })

  return filteredOrders
}

const cancelOrder = async (id: number, order: {}): Promise<void> => {
  let updatedOrder = order
  updatedOrder.status = "Canceled"
//   there will be PUT request to server to update order
  try {
    await updateInDatabase(ORDERS_DATABASE + id, updatedOrder)
  } catch (e: string | unknown) {
    UiStore.setErrorMessage(e.message)
  }
}

const initChangePassword = async () => {
  try {
    await changePassword(password.value[0].val, AuthStore.getToken)
    password.value[0].val = ''
    pasChanged.value = true
  }catch (e) {
    UiStore.setErrorMessage(e.message)
  }

}
</script>