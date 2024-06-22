<template lang="pug">
  div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(:categories="UiStore.getAllCategories" :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20
    main.main-side
      h1.ml20 About Us
</template>

<!-- Component About Us - contains general info about Online Store (to add more details in future) -->
<script setup lang="ts">
import {useRoute} from "vue-router";
const route = useRoute()
import {useUiStore} from "~/stores/UiStore";
import CategorySide from "~/components/ui/CategorySide.vue";
import ToggleSidebar from "~/components/ui/ToggleSidebar.vue";


const UiStore = useUiStore()
definePageMeta({
  layout: 'default',
  middleware: 'query-rules'
})
</script>