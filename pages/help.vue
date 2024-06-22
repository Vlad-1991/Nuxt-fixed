<template lang="pug">
  div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(:categories="UiStore.getAllCategories" :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20
    main.main-side
      h1.ml20 Help
</template>

<!-- Component Help - contains useful topics about Online Store handling (to add more details in future) -->
<script setup lang="ts">
import {useUiStore} from "~/stores/UiStore";
const UiStore = useUiStore()
import CategorySide from "~/components/ui/CategorySide.vue";
import ToggleSidebar from "~/components/ui/ToggleSidebar.vue";

definePageMeta({
  layout: 'default',
  middleware: 'query-rules'
})
</script>