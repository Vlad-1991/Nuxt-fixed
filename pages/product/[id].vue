<template lang="pug">
  div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(v-if="categories_info" :categories="categories_info" :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20
    main.main-side
      div(v-if="!showReviews")
        div.product(v-if="product")
          h1.ml20 {{ product[Object.keys(product)].name }}
          div.rating Rating {{product[Object.keys(product)].rating}} of {{MAX_RATING}}
            span.reviews(@click="showReviews = true") {{product[Object.keys(product)].reviews.length}} Reviews
          div.image_card
            div
              //div(v-if="loading").loader
              SimpleGallery#gallery( galleryID="my-test-gallery-primary" :images="product[Object.keys(product)].image" class="card-image"
                :name="product[Object.keys(product)].name")
            div.flex-box
              h2.price ${{product[Object.keys(product)].price}}
              div
                button.btn_cart(@click="decrease" type="button") -
                input.btn_cart_input(type="number" min="1" max="100" step="1" pattern="[0-9]{3}" v-model="cart_qty" @input="onInput($event.target.value)")
                button.btn_cart(@click="increase" type="button") +
              span
                button.btn.danger.add_to_cart(@click="initAddCart" type="button") Add to Cart
                h3.inline-block.price_sum(v-if="cart_qty > 1") Summary: ${{(cart_qty * parseFloat(product[Object.keys(product)].price)).toFixed(2)}}
                h3.inline-block(v-if="message_overload") Max count of this position is 100
                h3.primary.inline-block(v-if="product_added") Product added to Cart
                button.btn.orange.add_to_cart.block.mt20(@click="modal = true" type="button") Buy Now
          div.description(v-html="product[Object.keys(product)].description")
        div.ml20(v-else)
          h1 There are no this product
          nuxt-link.link(:to="{name: 'catalog'}") Back to Catalog
      div.reviews-block(v-else)
        Reviews(:is-authentificated="AuthStore.isAuthentificated" :reviews="product[Object.keys(product)].reviews" :reviewSended="reviewSended"
        @sendReview="sendReview" @backToProduct="showReviews = false")

    teleport(to="body")
      modal-quick-order(v-if="modal" title="Quick Order" @close="modal = false" :product="product[Object.keys(product)]" :qty="cart_qty")
</template>

<script setup lang="ts">

import {useAuthStore} from "~/stores/AuthStore";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import SimpleGallery from '~/components/ui/SimpleGallery.vue';
import {useUiStore} from "~/stores/UiStore";
import CategorySide from "~/components/ui/CategorySide.vue";
import ModalQuickOrder from "~/components/ui/ModalQuickOrder.vue";
import Reviews from "~/components/ui/Reviews.vue";
import ToggleSidebar from "~/components/ui/ToggleSidebar.vue";
import type {productWithId, ratingInfoType, subcategoryType, productInCartType} from "~/utils/types/requestTypes";
import {useCartStore} from "~/stores/CartStore";
import {load} from "~/services/api/requests";


definePageMeta({
  layout: 'default',
  middleware: 'query-rules'
})




const CartStore = useCartStore()
const route = useRoute()
// console.log(route.params.id)
const AuthStore = useAuthStore()
const UiStore = useUiStore()
const loading = ref(true)
const modal = ref(false)

const cart_qty = ref<number>(1)
const product_added = ref<boolean>(false)
const message_overload = ref<boolean>(false)
const MAX_RATING = 5

const showReviews = ref<boolean>(false)
const reviewText = ref<string>()
const product = ref<productInCartType>()
let categories = [{}]

const categories_info = ref()
categories_info.value = UiStore.getAllCategories

// console.log(UiStore.getAllCategories)



const initAddCart = () => {
  // addCart(product, message_overload, cart_qty, product_added)
  let resp = CartStore.addToCart(product, cart_qty.value)
  if(resp === 'success'){
    cart_qty.value = 1
    product_added.value = true
    setTimeout(() => {
      product_added.value = false
    }, 3000)

  }else if(resp === 'overloaded'){
    message_overload.value = true
    cart_qty.value = 1
    setTimeout(() => {message_overload.value = false}, 3000)
  }

}

const reviewSended = ref<boolean>(false)

if(AuthStore.isAuthentificated){

  if(product){
    let reviewIndex = product[Object.keys(product)].reviews.findIndex(el => el.userId === AuthStore.getUserId)

    reviewSended.value = reviewIndex !== -1;
  }
}

/* to collect user rating, add current date and time, optional review text and send this info to server */
const sendReview = (ratingInfo: ratingInfoType): void => {

  let currentUserName = AuthStore.getUserName
  let currentUserId = AuthStore.getUserId

  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let formattedDate = (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day  + '-' + year;

  let newRating: number = (product[Object.keys(product)].rating * product[Object.keys(product)].rating_votes + parseInt(ratingInfo.ratingVote)) /
      (product[Object.keys(product)].rating_votes + 1)
  newRating = parseFloat(newRating.toFixed(2))

  let updatedProduct = product
  updatedProduct[Object.keys(updatedProduct)].rating = newRating
  updatedProduct[Object.keys(updatedProduct)].rating_votes = product[Object.keys(product)].rating_votes + 1

  if(reviewText){
    let reviewObj = {text: ratingInfo.reviewText, username: currentUserName, date: formattedDate}
    updatedProduct[Object.keys(updatedProduct)].reviews.push(reviewObj)
  }
  /* there will be sending updated product to server (with new user review) */
}

/* to decrase qty according to pushing "-" button by user*/
const decrease = (): void => {
  if(cart_qty.value <= 1){
    cart_qty.value = 1
  }else{
    cart_qty.value--
  }
}

/* to delete any symbols except numbers and save it to ref */
function onInput (e: string): void {
  cart_qty.value = parseInt(e.replace(/[^+\d]/g, ''));
  if(parseInt(e) < 1){
    cart_qty.value = 1
  }else if(parseInt(e) > 100){
    cart_qty.value = 100
  }
}

/* to increase qty according to pushing "+" button by user*/
const increase = (): void => {
  if(cart_qty.value >= 100){
    cart_qty.value = 100
  }else{
    cart_qty.value++
  }
}



/* to find current product category name and subcategory name and put them to UI Store to reuse in breadcrumbs */
const writeCategoryAndSubcategory = (): void => {
  let categoryInfo = {catUrl: '', subCatUrl: ''}



  if(product && categories){
      // categoryInfo.catUrl = product[Object.keys(product)].category
      // categoryInfo.subCatUrl = product[Object.keys(product)].subcategory
   // //
    let prod = product.value
    categoryInfo.catUrl = prod[Object.keys(prod)].category
    categoryInfo.subCatUrl = prod[Object.keys(prod)].subcategory


    let current_category
    let current_subcategory
    let subcategories_array = [{}]
    categories.forEach(cat => {
      if (Object.keys(cat)[0] === categoryInfo.catUrl) {
        current_category = cat[Object.keys(cat)[0]].text
        subcategories_array = cat[Object.keys(cat)[0]].subcategory
      }
    })

    subcategories_array.forEach((subcat: subcategoryType): void => {
      if (subcat.url === categoryInfo.subCatUrl) {
        current_subcategory = subcat.text
      }
    })
    UiStore.writeCategoryInfo({cat: current_category, subcat: current_subcategory})

  }
}



// /* when image loaded - remove loader from product page */
// const toChangeLoader = () : void => {
//   loading.value = false
// }

try {
  const {data, error} = await load('categories', '/categories.json')
  categories = data.value
}catch (e: string | unknown) {
  UiStore.setErrorMessage(e.message)
}

try {
  const {data, error} = await load('catalog', '/catalog.json')
  let products = data.value
  // console.log(products)
  products = products.filter((val: productWithId) => Object.keys(val)[0] === route.params.id)
  product.value = products[0]

  writeCategoryAndSubcategory()

}catch (e: string | unknown){
  UiStore.setErrorMessage(e.message)
}




</script>
