<template lang="pug">
  aside
    h1.mt50 Categories
    ul(class="list list-default" v-if="categories" )
      li(v-for="(category, index) in categories" :key="categories[index]" class="li-border")
        div.categories-flex
          nuxt-link.category.inline-block.w100.li-highlight(:to="{name: 'catalog', query: {category: Object.keys(category)[0]}}"
            :class="$route.query.category === Object.keys(category)[0] ? 'active_category' : ''"
            @click="$emit('showCategory', {cat: Object.keys(category)[0]})") {{category[Object.keys(category)[0]].text}}
          span.button-cat(:class="switched[index] ? 'opened' : 'closed'" @click="switchCatButton(index)") ^

        li.subcat.li-highlight(v-if="switched[index]" v-for="subcat in category[Object.keys(category)[0]].subcategory" :key="subcat.url")
          nuxt-link.category.block.w100.li-highlight(:to="{name: 'catalog', query: {category: Object.keys(category)[0], subcategory: subcat.url} }"
            :class="$route.query.subcategory === subcat.url ? 'active_category' : ''"
            @click="$emit('showSubCategory', {cat: Object.keys(category)[0], subcat: subcat.url})") {{subcat.text}}

      li.show-bestseller(v-if="checkboxBestSeller")
        input(type="checkbox" id="bestseller" @click="toShowBestSellers")
        label(for="bestseller") Bestseller
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {Ref} from  "vue"
import type {categoriesType} from "@/utils/types/requestTypes";
import {useRoute} from "vue-router";
import {useUiStore} from "~/stores/UiStore";
const UiStore = useUiStore()
let route = useRoute()

let categories = UiStore.getAllCategories


const emit = defineEmits(['showBestSellers', 'showCategory', 'showSubCategory'])

/* toggle show or not show bestseller products, and init event to show products in current category or subcategory */
const toShowBestSellers = (): void => {
  emit('showBestSellers')
  if(route.query.subcategory){
    emit('showSubCategory', {cat: route.query.category, subcat: route.query.subcategory})
  }else{
    emit('showCategory', {cat: route.query.category})
  }
}



const props = defineProps<{
  // categories: [categoriesType],
  checkboxBestSeller: boolean
}>()

/* initialization array with status of showing subcategory lists, not shown by default */
const switched: Ref<boolean[]> = ref([])
for(let i = 0; i < categories.length; i++){
  switched.value[i] = false
}

/* toggle show or no show pressed subcategory list */
const switchCatButton = (index: number): void => {
  switched.value[index] = !switched.value[index]
}

</script>