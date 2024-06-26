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
import {loadCategoriesToStore} from "~/services/api/requests";

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

loadCategoriesToStore()

</script>
