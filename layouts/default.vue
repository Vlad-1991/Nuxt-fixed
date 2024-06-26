<template lang="pug">
  div.wrapper
    TheNavbar
    div.container.with-nav.mb50
      TheBreadCrumbs.breadcrumbs.mt20
      ErrorMessage.mt20(v-if="UiStore.getErrorMessage")
      NuxtPage
      slot
    TheFooter
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/CartStore";
import { useUiStore } from "~/stores/UiStore";
import TheNavbar from "~/components/TheNavbar.vue";
import TheBreadCrumbs from "~/components/ui/TheBreadCrumbs.vue";
import ErrorMessage from "~/components/ui/ErrorMessage.vue";
import TheFooter from "~/components/ui/TheFooter.vue";
import {load} from "~/services/api/requests";
import type {categoriesType} from "~/utils/types/requestTypes";

const UiStore = useUiStore();
const CartStore = useCartStore();
const AuthStore = useAuthStore()

onMounted(async () => {
  await cartInit();
  await AuthStore.prepareToken()
  if(AuthStore.isAuthentificated){
    await AuthStore.setUserInfo()
  }
})

let response;

/* to get all products, putted by user to cart earlier, from local storage to Cart store */
async function cartInit() {
  CartStore.getCart();
}

/* loading categories from server and store them to UiStore to reuse in other child component with Left Sidebar */
try {
  const {data} = await load('categories', '/categories.json')

 response = data.value
  response.sort((a: categoriesType, b: categoriesType) => Object.keys(a)[0] > Object.keys(b)[0] ? 1 : -1);

  UiStore.pushCategories(response);

} catch (e: string | unknown) {
  UiStore.setErrorMessage(e.message);
}

//let categories = UiStore.getAllCategories;




</script>
