<template lang="pug">
  div.wrapper
    TheNavbar
    div.container.with-nav(class="mb-[50px]")
      TheBreadCrumbs.breadcrumbs(class="mt-[20px]" v-if="catLoaded")
      ErrorMessage(class="mt-[20px]" v-if="UiStore.getErrorMessage")
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
</script>
