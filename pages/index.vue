<template lang="pug">
div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side( :checkboxBestSeller="UiStore.getCheckboxBestSeller"
      :style="{left: UiStore.sidebar}").mt20
    main.main-side
      h1.ml20 Our Bestsellers
      SearchProducts(@changedSearch="activateSearch")
      SortingSelector(@sorting="loadProductsHome")
      div(v-if="loading").loader
      product-list(v-else :products="searchQueryProducts")
</template>


<!-- Home component - contains bestseller list of products and Left Sidebar -->
<script setup lang="ts">
import CategorySide from "~/components/ui/CategorySide.vue";
import ProductList from "~/components/ProductList.vue";
import type {Ref} from "vue"
import {onMounted, ref} from "vue";
import {useUiStore} from "~/stores/UiStore";

const UiStore = useUiStore()

import SortingSelector from "~/components/ui/SortingSelector.vue";
import SearchProducts from "~/components/ui/SearchProducts.vue";
import ToggleSidebar from "~/components/ui/ToggleSidebar.vue";
import {load} from "~/services/api/requests";
import type {productWithId} from "~/utils/types/requestTypes";
import {filterSearchedProducts} from "~/utils/composables/search";
import {BESTSELLER_COUNT, CATALOG_DATABASE} from "~/utils/composables/constants";

definePageMeta({
  layout: 'default',
  middleware: 'query-rules'
})


const products: Ref<productWithId[]> = ref([]);
const loading = ref(false)
const searchQuery = ref()
const searchQueryProducts: Ref<productWithId[]> = ref([]);

/* to load bestseller products from catalog, also sort products by criteria */
const loadProductsHome = async (sorting?: string): Promise<void> => {

  loading.value = true

  try {
    const {data, error} = await load('catalog', CATALOG_DATABASE)
    products.value = data.value
    products.value = products.value.filter((val: productWithId) => val.saled >= BESTSELLER_COUNT)

    if (sorting) {
      switch (sorting) {

        case 'sortAZ':
          products.value.sort((a: productWithId, b: productWithId) => a.name.localeCompare(b.name));
          loading.value = false
          searchQueryProducts.value = products.value
          filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
          break

        case 'sortBestsellers':
          products.value.sort((a: productWithId, b: productWithId) => b.saled - a.saled);
          loading.value = false
          searchQueryProducts.value = products.value
          filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
          break

        case 'sortPriceLowToHigh':
          products.value.sort((a: productWithId, b: productWithId) => parseFloat(a.price) - parseFloat(b.price));
          loading.value = false
          searchQueryProducts.value = products.value
          filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
          break

        case 'sortPriceHighToLow':
          products.value.sort((a: productWithId, b: productWithId) => parseFloat(b.price) - parseFloat(a.price));
          loading.value = false
          searchQueryProducts.value = products.value
          filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
          break

      }
    } else {
      loading.value = false
      searchQueryProducts.value = products.value
      filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
    }
  } catch (e: string | unknown) {
    UiStore.setErrorMessage(e.message)
  }
}

const activateSearch = (query: string) => {
  filterSearchedProducts(query, searchQuery, products, searchQueryProducts)
}

const categories_info = ref()
categories_info.value = UiStore.getAllCategories

/* before page loaded - load products from server */

  loading.value = true

  await loadProductsHome()

  loading.value = false



</script>