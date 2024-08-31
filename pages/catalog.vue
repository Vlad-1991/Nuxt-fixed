<template lang="pug">
div
    ToggleSidebar(@toggleSideBar="UiStore.toggleSidebar()")
    CategorySide.category-side(:checkboxBestSeller="checkboxBestSeller"
      @showBestSellers="changeShowBestsellers" @showCategory="showProductsInCategory" @showSubCategory="showProductsInSubCategory"
      :categories="UiStore.getAllCategories"
      :style="{left: UiStore.sidebar}" class="mt-[20px]")
    main.main-side
      h2(class="ml-[20px]") Catalog
      SearchProducts(@changedSearch="activateSearch")
      SortingSelector(@sorting="loadProductsCatalog")
      product-list(:products="searchQueryProducts")
</template>

<script setup lang="ts">
import {load} from "~/services/api/requests";

definePageMeta({
  layout: 'default'
})
useHead({
  meta: [
    { name: "description", content: 'Catalog' },
    { property: "og:description", content: 'Catalog' },
    { name: "twitter:card", content: 'Catalog' },
  ],
})
const UiStore = useUiStore()

let route = useRoute()
let router = useRouter()

const products = ref()
const all_products = ref([])
let categories
const checkboxBestSeller = ref<boolean>(false) // show checkbox on left sidebar

const loading = ref(false)

const searchQuery = ref()
const searchQueryProducts = ref()

/* to load products from catalog, if query exists - filter products relative to category or subcategory, if sorting parameter exists -
also sort products by criteria */
const loadProductsCatalog = async (sorting?: string): Promise<void> => {

  loading.value = true

  try {
    //const {data} = await load('catalog', CATALOG_DATABASE)
    const {data} = await useAsyncData('catalog', () => load(CATALOG_DATABASE))
    all_products.value = data.value

    if (route.query.subcategory) {
      checkboxBestSeller.value = true
      let category_products = all_products.value.filter((val: productWithId) => val.category === route.query.category)
      let subcategory_products = category_products.filter((val: productWithId) => val.subcategory === route.query.subcategory)

      products.value = subcategory_products
      if (UiStore.getShowBestsellers) {
        checkboxBestSeller.value = true
        products.value = products.value.filter((val: productWithId) => val.saled >= BESTSELLER_COUNT)
      }

    } else if (route.query.category) {
      checkboxBestSeller.value = true
      let category_products = all_products.value.filter((val: productWithId) => val.category === route.query.category)
      products.value = category_products

      if (UiStore.getShowBestsellers) {
        checkboxBestSeller.value = true
        products.value = category_products.filter((val: productWithId) => val.saled >= BESTSELLER_COUNT)
      }

    } else {
      checkboxBestSeller.value = false
      products.value = all_products.value
    }

    if (sorting) {
      switch (sorting) {

        case 'sortAZ':
          products.value.sort((a: productWithId, b: productWithId) => {
            a.name.localeCompare(b.name)
          })
          loading.value = false
          searchQueryProducts.value = products.value
          filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
          break

        case 'sortBestsellers':
          products.value.sort((a: productWithId, b: productWithId) => b.saled - a.saled)
          loading.value = false
          searchQueryProducts.value = products.value
          filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
          break

        case 'sortPriceLowToHigh':
          products.value.sort((a: productWithId, b: productWithId) => parseFloat(a.price) - parseFloat(b.price))
          loading.value = false
          searchQueryProducts.value = products.value
          filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)
          break

        case 'sortPriceHighToLow':
          products.value.sort((a: productWithId, b: productWithId) => parseFloat(b.price) - parseFloat(a.price))
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

/* when component render first - to load products according to query */

loading.value = true

await loadProductsCatalog()

loading.value = false


/* if route changed to main Catalog (wihout query) - hide bestseller checkbox and show all products from catalog */
watch(route, (): void => {


  if (route.query.subcategory) {
    showProductsInSubCategory({cat: String(route.query.category), subcat: String(route.query.subcategory)})
  } else if (route.query.category) {
    showProductsInCategory({cat: String(route.query.category)})
  } else if (!route.query.category && route.name === 'catalog') {
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

  let category_products = all_products.value.filter((val: productWithId) => val.category === payload.cat)

  if (UiStore.getShowBestsellers) {
    checkboxBestSeller.value = true
    products.value = category_products.filter((val: productWithId) => val.saled >= BESTSELLER_COUNT)
  } else {
    checkboxBestSeller.value = true
    products.value = category_products
  }

  searchQueryProducts.value = products.value
  filterSearchedProducts(searchQuery.value, searchQuery, products, searchQueryProducts)

}

/* emited from Left Sidebar event to show products from selected subcategory with bestseller checkbox criteria */
const showProductsInSubCategory = (payload: subcatType): void => {

  let category_products = all_products.value.filter((val: productWithId) => val.category === payload.cat)

  let temp_products = category_products.filter((val: productWithId) => val.subcategory === payload.subcat)

  if (UiStore.getShowBestsellers) {
    checkboxBestSeller.value = true
    products.value = temp_products.filter((val: productWithId) => val.saled >= BESTSELLER_COUNT)

  } else {
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