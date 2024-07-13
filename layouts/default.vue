<template lang="pug">
  div.wrapper
    TheNavbar
    div.container.with-nav.mb50
      TheBreadCrumbs.breadcrumbs.mt20(v-if="catLoaded")
      ErrorMessage.mt20(v-if="UiStore.getErrorMessage")
      AddToHomeScreen
      NuxtPage
      slot
    TheFooter
</template>

<script setup lang="ts">
const UiStore = useUiStore();
const CartStore = useCartStore();
const AuthStore = useAuthStore()

const catLoaded = ref(false)

onMounted(async () => {
  await cartInit();
  await AuthStore.prepareToken()
  if(AuthStore.isAuthentificated){
    await AuthStore.setUserInfo()
  }
  await loadCategoriesToStore()
  catLoaded.value = true
})

/* to get all products, putted by user to cart earlier, from local storage to Cart store */
async function cartInit() {
  await CartStore.getCart();
}


// loadCategoriesToStore()

</script>
