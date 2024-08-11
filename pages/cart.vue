<template lang="pug">
  div(v-if="products")
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(:categories="UiStore.getAllCategories" :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20
    main.main-side
      h2(class="ml-[20px]") Cart
      h3(v-if="CartStore.getCartCount === 0") Cart is empty, please add some products first
      div(v-else)
        ul
          li.list-item(v-for="product in products" :key="product.id")
            span {{product.name}}
            span.cart_flex
              span
                button.btn_cart(@click="CartStore.updateCount({id: product.id, cnt: --product.qty})" type="button") -
                input.btn_cart_input(type="number" min="1" max="100" step="1" pattern="[0-9]{3}" :value="product.qty" @input="onInput({e: $event.target.value, id: product.id})")
                button.btn_cart(@click="CartStore.updateCount({id: product.id, cnt: ++product.qty})" type="button") +
              span#summary_row(class="min-w-[100px]") ${{(parseFloat(product.qty) * parseFloat(product.price)).toFixed(2)}}
              span
                fas(icon="trash-alt" size="lg" @click="CartStore.deleteProduct(product.id)")
          h2.text-right(class="my-[20px]") Summary: ${{parseFloat(CartStore.getSummary).toFixed(2)}}
          nuxt-link(:to="{name: 'checkout'}")
            button.btn.primary.btn_inline_block(type="button") Checkout
</template>

<!-- component of Cart, contains table with added products, names, qty, price, delete button and summary, also has button - go to checkout -->
<script setup lang="ts">
// import {loadCategoriesToStore} from "~/services/api/requests";



definePageMeta({
  layout: 'default',
  middleware: 'query-rules'
})

const products = ref<productInCartType | null[]>()
const CartStore = useCartStore()
const UiStore = useUiStore()

onMounted(async () => {
  await loadCategoriesToStore()
  await CartStore.getCart()
   products.value = CartStore.getCartProducts
})



/* to change qty of product in Cart, have a basic qty validation, valid qty 1 - 100 */
function onInput (payload: {e: string, id: string}): void {
  let cnt
  let e = payload.e
  e = e.replace(/[^+\d]/g, '');
  if(e === ''){
    e = '1'
  }
  if(parseInt(e) < 1){
    cnt = 1
  }else if(parseInt(e) > 100){
    cnt = 100
  }else{
    cnt = parseInt(e)
  }
  CartStore.updateCount({id: payload.id, cnt: cnt})
}

</script>