<template lang="pug">
  div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(:categories="UiStore.getAllCategories" :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20
    main.main-side
      h2.ml20 About Us
</template>

<!-- Component About Us - contains general info about Online Store (to add more details in future) -->
<script setup lang="ts">
const route = useRoute()

const UiStore = useUiStore()
definePageMeta({
  layout: 'default',
  middleware: ['query-rules']
})

useHead({
  title: 'About us',
  meta: [
    { name: "description", content: 'About us' },
    { property: "og:description", content: 'About us' },
    { name: "twitter:card", content: 'About us' },
  ],
})

</script>