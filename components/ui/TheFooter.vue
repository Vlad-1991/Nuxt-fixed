<template lang="pug">
  footer.footer
    div.footer-social
      a(href="https://www.facebook.com/LaMotteCompany/" target="_blank")
        img(src="@/assets/social-facebook-gray.svg" alt="Facebook")
      a(href="https://t.me/joakimlamotte" target="_blank")
        img(src="@/assets/social-telegram-gray.svg" alt="Telegram")
    div &copy; 2004-{{year}} lamotte.com, all rights reserved

</template>

<script setup lang="ts">
const currentDate = new Date();
const year = currentDate.getFullYear();
</script>