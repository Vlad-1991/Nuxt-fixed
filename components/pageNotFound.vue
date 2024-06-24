<!-- page of 404 error -->
<template lang="pug">
  div.breadcrumbs
    main.center
      h1 404
      h1 Ooops! There are no these page
      nuxt-link.link(:to="{name: 'Home'}") Back to home page
</template>
<script setup lang="ts">


definePageMeta({
  layout: 'default',
  middleware: 'query-rules'
})
</script>