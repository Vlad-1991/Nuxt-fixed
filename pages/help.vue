<template lang="pug">
  div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(:categories="UiStore.getAllCategories" :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20
    main.main-side
      h2(class="ml-[20px]") Help
</template>

<!-- Component Help - contains useful topics about Online Store handling (to add more details in future) -->
<script setup lang="ts">
const UiStore = useUiStore()

definePageMeta({
  layout: 'default',
  middleware: 'query-rules'
})

useHead({
  title: 'Help',
  meta: [
    { name: "description", content: 'Help' },
    { property: "og:description", content: 'Help' },
    { name: "twitter:card", content: 'Help' },
  ],
})

</script>