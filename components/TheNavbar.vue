<template lang="pug">
  nav.navbar
    div(class="logo")
      nuxt-link(to="/")
        nuxt-img(src="lamotte.png" alt="Online Store" width="140px" height="54px" format="webp" quality="80")
      h3(class="inline") Online Store
    div.navbar-menu
      ul.navbar-menu
        li
          nuxt-link(:to="{name: 'index'}") Home
        li
          nuxt-link(:to="{name: 'catalog'}") Catalog
        li
          nuxt-link(:to="{name: 'help'}") Help
        li
          nuxt-link(:to="{name: 'about'}") About Us
      div(v-if="!AuthStore.isAuthentificated")
        nuxt-link(:to="{name: 'signin'}")
          button.btn.main.mr20(type="button") Sign In
        nuxt-link(:to="{name: 'signup'}")
          button.btn.white.mr20(type="button") Sign Up
        nuxt-link(:to="{name: 'cart'}" class="main")
          fas(icon="shopping-cart" size="lg")
          span(class="cart-count") {{CartStore.getCartCount}}
      div(v-else)
        nuxt-link(:to="{name: 'dashboard'}" class="main").mr20
          fas(icon="user" size="lg")
        //nuxt-link(:to="{name: 'index'}" @click="AuthStore.logout")
        button.btn.white.mr20(type="button" @click="AuthStore.logout") Logout
      //nuxt-link(:to="{name: 'cart'}" class="main")
      //  fas(icon="shopping-cart" size="lg")
      //  span(class="cart-count") {{CartStore.getCartCount}}
</template>

<!-- this is navbar - rendered once on main layout to navigate to all routes, except checkout and specific category query
 have also log in, sign in, log out buttons -->
<script setup lang="ts">
const AuthStore = useAuthStore()
const CartStore = useCartStore()
</script>