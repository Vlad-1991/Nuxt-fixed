<template lang="pug">
  div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(v-if="categories_info" :categories="categories_info" :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20
    main.main-side(v-if="dataLoaded")
      div(v-if="!showReviews")
        div.product(v-if="product")
          h1(class="ml-[20px]") {{ product.name }}
          div.font-bold Rating {{product.rating}} of {{MAX_RATING}}
            span.reviews(@click="showReviews = true") {{product.reviews.length}} Reviews
          div.image_card
            div
              SimpleGallery#gallery( galleryID="my-test-gallery-primary" :images="product.image" class="card-image"
                :name="product.name")
            div.flex-box
              h2 ${{product.price}}
              div
                button.btn_cart(@click="decrease" type="button") -
                input.btn_cart_input(type="number" min="1" max="100" step="1" pattern="[0-9]{3}" v-model="cart_qty" @input="onInput($event.target.value)")
                button.btn_cart(@click="increase" type="button") +
              span
                button.btn.danger.add_to_cart(@click="initAddCart" type="button" :disabled="product_added") Add to Cart
                h3.inline-block.price_sum(v-if="cart_qty > 1") Summary: ${{(cart_qty * parseFloat(product.price)).toFixed(2)}}
                h3.inline-block(v-if="message_overload") Max count of this position is 100
                h3.primary.inline-block(v-if="product_added") Product added to Cart
                button.btn.orange.add_to_cart(class="mt-[20px] block" @click="modal = true" type="button") Buy Now
          div(v-html="product.description")
        div(class="ml-[20px] text-center mx-auto")(v-else)
          h1 There are no this product
          nuxtLink.link(:to="{name: 'catalog'}") Back to Catalog
      div.reviews-block(v-else)
        Reviews(v-if="product" :is-authentificated="AuthStore.isAuthentificated" :reviews="product.reviews" :reviewSended="reviewSended"
        @sendReview="sendReview" @backToProduct="showReviews = false")

    teleport(to="body")
      modal-quick-order(v-if="modal" title="Quick Order" @close="modal = false" :product="product" :qty="cart_qty")
</template>

<script setup lang="ts">
import {load, updateInDatabase} from "~/services/api/requests";

definePageMeta({
  layout: 'default',
  middleware: 'query-rules'
})

const dataLoaded = ref(false)

const CartStore = useCartStore()
const route = useRoute()
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
const product = ref<productWithId>()
let categories = [{}]

const categories_info = ref()
categories_info.value = UiStore.getAllCategories

 onMounted(async () => {
   await defineReviewSended()
 })


const initAddCart = () => {
  let resp = CartStore.addToCart(product.value, cart_qty.value)
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

/* to collect user rating, add current date and time, optional review text and send this info to server */
const sendReview = async (ratingInfo: ratingInfoType): Promise<void> => {

  let currentUserName = AuthStore.getUserName
  let currentUserId = AuthStore.getUserId

  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let formattedDate = (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day  + '-' + year;

  if(product.value){
    let prod = product.value

    let newRating: number = (prod.rating * prod.rating_votes + parseInt(ratingInfo.ratingVote)) /
        (prod.rating_votes + 1)
    newRating = parseFloat(newRating.toFixed(2))

    let updatedProduct = prod
    updatedProduct.rating = newRating
    updatedProduct.rating_votes = prod.rating_votes + 1


      let reviewObj = {text: ratingInfo.reviewText ? ratingInfo.reviewText : '', username: currentUserName, date: formattedDate, userId: AuthStore.email}
      updatedProduct.reviews.push(reviewObj)


    /* there will be sending updated product to server (with new user review) */
    try {
      await updateInDatabase(CATALOG_DATABASE + route.params.id, updatedProduct)
    }catch (e) {
      UiStore.setErrorMessage(e.message)
    }
  }

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

  if(product.value && categories){
    let prod = product.value
    categoryInfo.catUrl = prod.category
    categoryInfo.subCatUrl = prod.subcategory


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

const defineReviewSended = async () => {
  await AuthStore.prepareToken()
  await AuthStore.setUserInfo()
  if(AuthStore.isAuthentificated){

    if(product.value){
      let reviewIndex = product.value.reviews.findIndex((el) => el.userId === AuthStore.getUserId)
      reviewSended.value = reviewIndex !== -1;
    }
  }

}

try {
  const {data, error} = await useAsyncData('categories', () => load(CATEGORIES_DATABASE))
  categories = data.value
}catch (e: string | unknown) {

  UiStore.setErrorMessage(e.message)
}

try {
  const {data, error} = await useAsyncData('single_product', () => load(CATALOG_DATABASE + route.params.id))
  product.value = data.value
  dataLoaded.value = true
  writeCategoryAndSubcategory()
}catch (e: string | unknown){
  UiStore.setErrorMessage(e.message)
}

if(product.value){
  useHead({
    title: product.value.name,
    meta: [
      { name: "description", content: product.value.description },
      { property: "og:description", content: product.value.description },
      { property: "og:image", content: product.value.image[0].thumbnailURL },
      { name: "twitter:card", content: product.value.name },
    ],
  })
}



</script>
