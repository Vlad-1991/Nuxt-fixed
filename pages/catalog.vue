<template lang="pug">
  div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(v-if="categories_info" :categories="categories_info" :checkboxBestSeller="checkboxBestSeller"
      @showBestSellers="changeShowBestsellers" @showCategory="showProductsInCategory" @showSubCategory="showProductsInSubCategory"
      :style="{left: UiStore.sidebar}").mt20
    main.main-side
      h1.ml20 Catalog
      SearchProducts(@changedSearch="activateSearch")
      SortingSelector(@sorting="loadProductsCatalog")
      div(v-if="loading").loader
      product-list(v-else :products="searchQueryProducts")
</template>

<script setup lang="ts">
import type {catType, productWithId, subcatType} from "~/utils/types/requestTypes";
import ProductList from "~/components/ProductList.vue";
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {useUiStore} from "~/stores/UiStore";

import CategorySide from "~/components/ui/CategorySide.vue";
import SortingSelector from "~/components/ui/SortingSelector.vue";
import SearchProducts from "~/components/ui/SearchProducts.vue";
import ToggleSidebar from "~/components/ui/ToggleSidebar.vue";
import {load} from "~/services/api/requests";
import {filterSearchedProducts} from "~/utils/composables/search";
import {BESTSELLER_COUNT} from "~/utils/composables/constants";


definePageMeta({
  layout: 'default'
})
const UiStore = useUiStore()

let route = useRoute()
let router = useRouter()

const products = ref()
const all_products = ref([])
let categories

const showBestseller = ref<boolean>(false) // value of checkbox bestseller
const checkboxBestSeller = ref<boolean>(false) // show checkbox on left sidebar

const loading = ref(false)

const searchQuery = ref()
const searchQueryProducts = ref()

const categories_info = ref()
categories_info.value = UiStore.getAllCategories
// console.log(categories_info.value)

  /* to load products from catalog, if query exists - filter products relative to category or subcategory, if sorting parametr exists -
  also sort products by criteria */
  const loadProductsCatalog = async (sorting?: string): Promise<void> => {

    loading.value = true

    try {
      const {data, error} = await load('catalog', '/catalog.json')
      all_products.value = data.value

      if(route.query.subcategory){
        checkboxBestSeller.value = true
        let category_products = all_products.value.filter(val => val[Object.keys(val)[0]].category === route.query.category)
        let subcategory_products = category_products.filter(val => val[Object.keys(val)[0]].subcategory === route.query.subcategory)

        products.value = subcategory_products
        if (UiStore.getShowBestsellers) {
          checkboxBestSeller.value = true
          products.value = products.value.filter(val => val[Object.keys(val)[0]].saled >= BESTSELLER_COUNT)
        }

      } else if(route.query.category){
        checkboxBestSeller.value = true
        let category_products = all_products.value.filter(val => val[Object.keys(val)[0]].category === route.query.category)
        products.value = category_products

        if (UiStore.getShowBestsellers) {
          checkboxBestSeller.value = true
          products.value = category_products.filter(val => val[Object.keys(val)[0]].saled >= BESTSELLER_COUNT)
        }

      }else {
        checkboxBestSeller.value = false
        products.value = all_products.value
      }

      if (sorting) {
        switch (sorting) {

          case 'sortAZ':
            products.value.sort((a: productWithId, b: productWithId) => {a[Object.keys(a)[0]].name.localeCompare(b[Object.keys(b)[0]].name)
            })
            loading.value = false
            searchQueryProducts.value = products.value
            filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
            break

          case 'sortBestsellers':
            products.value.sort((a: productWithId, b: productWithId) => b[Object.keys(b)[0]].saled - a[Object.keys(a)[0]].saled)
            loading.value = false
            searchQueryProducts.value = products.value
            filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
            break

          case 'sortPriceLowToHigh':
            products.value.sort((a: productWithId, b: productWithId) => parseFloat(a[Object.keys(a)[0]].price) - parseFloat(b[Object.keys(b)[0]].price))
            loading.value = false
            searchQueryProducts.value = products.value
            filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
            break

          case 'sortPriceHighToLow':
            products.value.sort((a: productWithId, b: productWithId) => parseFloat(b[Object.keys(b)[0]].price) - parseFloat(a[Object.keys(a)[0]].price))
            loading.value = false
            searchQueryProducts.value = products.value
            filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
            break

        }
      }else {
        loading.value = false
        searchQueryProducts.value = products.value
        filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
      }
    }catch (e: string | unknown){
      UiStore.setErrorMessage(e.message)
    }
  }

  /* when component render first - to load products according to query */

  loading.value = true

  await loadProductsCatalog()

  loading.value = false


/* if route changed to main Catalog (wihout query) - hide bestseller checkbox and show all products from catalog */
watch(route, (): void => {


if(route.query.subcategory){
  showProductsInSubCategory({cat: route.query.category, subcat: route.query.subcategory})
}else if(route.query.category){
  showProductsInCategory({cat: route.query.category})
}else if(!route.query.category && route.name === 'Catalog'){
  checkboxBestSeller.value = false
 loadProductsCatalog()
}


})

/* change and save state of bestseller checkbox in Store */
const changeShowBestsellers = (): void => {
  UiStore.changeShowBestsellers()
}

/* emited from Left Sidebar event to show products from selected category with bestseller checkbox criteria */
const showProductsInCategory = (payload: catType): void => {

  let category_products = all_products.value.filter(val => val[Object.keys(val)[0]].category === payload.cat)
  // .then(data => all_products = data.filter(val => val[Object.keys(val)[0]].category === route.query.category))

  if (UiStore.getShowBestsellers) {
    checkboxBestSeller.value = true
    products.value = category_products.filter(val => val[Object.keys(val)[0]].saled >= BESTSELLER_COUNT)
  } else {
    checkboxBestSeller.value = true
    products.value = category_products
  }

  searchQueryProducts.value = products.value
  filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)

}

/* emited from Left Sidebar event to show products from selected subcategory with bestseller checkbox criteria */
const showProductsInSubCategory = (payload: subcatType): void => {

  let category_products = all_products.value.filter(val => val[Object.keys(val)[0]].category === payload.cat)
  // .then(data => all_products = data.filter(val => val[Object.keys(val)[0]].category === route.query.category))
  let temp_products = category_products.filter(val => val[Object.keys(val)[0]].subcategory === payload.subcat)

  if (UiStore.getShowBestsellers) {
    checkboxBestSeller.value = true
    products.value = temp_products.filter(val => val[Object.keys(val)[0]].saled >= BESTSELLER_COUNT)

  }else{
    checkboxBestSeller.value = true
    products.value = temp_products

  }

  searchQueryProducts.value = products.value
  filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)

}

const activateSearch = (query: string) => {
  filterSearchedProducts(query, searchQuery, products, searchQueryProducts)
}

</script>