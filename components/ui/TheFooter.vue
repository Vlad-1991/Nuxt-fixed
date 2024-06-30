<template lang="pug">
  footer.footer
    div.footer-social
      a(href="https://www.facebook.com/LaMotteCompany/" target="_blank")
        img(src="@/assets/social-facebook-gray.svg" alt="Facebook" width="22px" height="22px")
      a(href="https://t.me/joakimlamotte" target="_blank")
        img(src="@/assets/social-telegram-gray.svg" alt="Telegram" width="22px" height="22px")
    div &copy; 2004-{{year}} lamotte.com, all rights reserved

</template>

<script setup lang="ts">
const currentDate = new Date();
const year = currentDate.getFullYear();
</script>