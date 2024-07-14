<template lang="pug">
  footer.footer
    div.footer-social
      a(href="https://www.facebook.com/LaMotteCompany/" target="_blank")
        nuxt-img(src="social-facebook-gray.svg" alt="Facebook" width="22px" height="22px" format="webp" quality="80")
      a(href="https://t.me/joakimlamotte" target="_blank")
        nuxt-img(src="social-telegram-gray.svg" alt="Telegram" width="22px" height="22px" format="webp" quality="80")
    div &copy; 2004-{{year}} lamotte.com, all rights reserved

</template>

<script setup lang="ts">
const currentDate = new Date();
const year = currentDate.getFullYear();
</script>