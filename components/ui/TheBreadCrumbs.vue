<template lang="pug">
  div.breadcrumbs
    span(v-if="breadcrumbs" v-for="(str, index) in breadcrumbs" )
      nuxt-link.link.inline-block(:to="str.link" :class="(index === (breadcrumbs.length - 1)) ? 'active_category' : ''") {{str.text}}
      span(v-if="index < breadcrumbs.length - 1") &nbsp;>
</template>

<!-- simple component to render row of breadcrumbs from current route
, which contains links to all levels of route -->
<script setup lang="ts">
import {load} from "@/services/api/requests";
const UiStore = useUiStore()
const route = useRoute()

const cur_prod = ref({
  name: '',
  caturl: '',
  subcaturl: ''
})

/* it route selected by http query has params, information about this product store in variables to be shown in breadcrumbs  */
if (route.params.id) {
  await getProductDetails(route.params.id)
}

/* if go to product details must be gathered for breadcrumbs */
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await getProductDetails(newId)
  }
})

/* to get info from current route and put category and subcategory info to Ui Store */
const getCategoryAndSubcategory = (categories: [categoriesType], route: RouteLocationNormalized): void => {
  const UiStore= useUiStore()
  let current_category = ''
  let current_subcategory = ''
  let subcategories_array = [{}]
  categories.forEach((cat: categoriesType): void => {
    if (Object.keys(cat)[0] === route.query.category) {
      current_category = cat[Object.keys(cat)[0]].text
      subcategories_array = cat[Object.keys(cat)[0]].subcategory
    }
  })

  subcategories_array.forEach((subcat: any): void => {
    if (subcat.url === route.query.subcategory) {
      current_subcategory = subcat.text
    }
  })

  UiStore.writeCategoryInfo({cat: current_category, subcat: current_subcategory})
}

/* generate array of all breadcrumbs elements path */
function generateBreadcrumbs(route: RouteLocationNormalized, cur_prod: Ref<{ name: '', caturl: '', subcaturl: '' }>,
                                    categories: [categoriesType]): (breadcrumbsArrayType[] | undefined) {

  const UiStore = useUiStore()

  const categoriesInfo = ref({cat: '', subcat: ''})

  if (route.name !== 'index' && !route.query.category && route.name !== 'product-id') {
    UiStore.setBreadcrumbs([
      {text: 'Home', link: '/'},
      {text: capitalize(String(route.name)), link: String(route.path)}
    ])
    return UiStore.getBreadcrumbs
  } else if (route.name === 'catalog' && route.query.subcategory) {
    getCategoryAndSubcategory(categories, route);
    categoriesInfo.value.cat = UiStore.getCategory;
    categoriesInfo.value.subcat = UiStore.getSubcategory;


    UiStore.setBreadcrumbs([
      {text: 'Home', link: '/'},
      {text: capitalize(String(route.name)), link: String(route.path)},
      {text: capitalize(String(categoriesInfo.value.cat)), link: String(`/catalog?category=${route.query.category}`)},
      {text: capitalize(String(categoriesInfo.value.subcat)), link: String(`/catalog?category=${route.query.category}&subcategory=${route.query.subcategory}`)}
    ])

    return UiStore.getBreadcrumbs
  } else if (route.name === 'catalog' && route.query.category) {
    getCategoryAndSubcategory(categories, route);
    categoriesInfo.value.cat = UiStore.getCategory;
    categoriesInfo.value.subcat = UiStore.getSubcategory;

    UiStore.setBreadcrumbs([
      {text: 'Home', link: '/'},
      {text: capitalize(String(route.name)), link: String(route.path)},
      {text: capitalize(String(categoriesInfo.value.cat)), link: String(`/catalog?category=${route.query.category}`)}
    ])

    return UiStore.getBreadcrumbs
  } else if (route.name === 'product-id' && route.params.id) {

    categoriesInfo.value.cat = UiStore.getCategory;
    categoriesInfo.value.subcat = UiStore.getSubcategory;

    if (categoriesInfo.value.cat && categoriesInfo.value.subcat) {

      UiStore.setBreadcrumbs([
        {text: 'Home', link: '/'},
        {text: 'Catalog', link: '/catalog'},
        {text: capitalize(String(categoriesInfo.value.cat)), link: String(`/catalog?category=${cur_prod.value.caturl}`)},
        {text: capitalize(String(categoriesInfo.value.subcat)), link: String(`/catalog?category=${cur_prod.value.caturl}&subcategory=${cur_prod.value.subcaturl}`)},
        {text: cur_prod.value.name, link: String(`/product/${route.params.id}`)}
      ])

      return UiStore.getBreadcrumbs
    } else {
      UiStore.setBreadcrumbs([
        {text: 'Home', link: '/'},
        {text: 'Catalog', link: '/catalog'}
      ])
      return UiStore.getBreadcrumbs
    }
  }
}


/* gather info about current product from server side to use in breadcrumbs */
async function getProductDetails(id: string | string[]): Promise<void> {

  try {

    const {data, error} = await useFetch(CATALOG_DATABASE)

    const res = data.value.filter((val: productWithId) => val.id === id)
    let product = res[0]
    if (product) {
      cur_prod.value.name = product.name
      cur_prod.value.caturl = product.category
      cur_prod.value.subcaturl = product.subcategory
    }

  }catch (e: string | unknown){
    UiStore.setErrorMessage(e.message)
  }
}

let categories = UiStore.getAllCategories

getCategoryAndSubcategory(categories, route)

const capitalize = (string: string) => string[0].toUpperCase() + string.slice(1);

let breadcrumbs = computed((): breadcrumbsArrayType[] | undefined => generateBreadcrumbs(route, cur_prod, categories))

</script>