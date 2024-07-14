<template lang="pug">
  div.flex-row
    SkeletonLoader(v-if="loading")
    div(class="flex-col" v-for="product in products" :key="product.id")
      div.card-flex
        div.card-body-my
          nuxt-link(:to="{name: 'product-id', params: {id: product.id} }")
            h4 {{product.name}}
          div
          nuxt-img(:src="IMAGES_THUMB + product.image[0].thumbnailURL" class="card-image" width="150px" height="150px" :alt="product.name"
            format="webp" quality="80")
          h3 ${{product.price}}
          nuxt-link(:to="{name: 'product-id', params: {id: product.id} }")
            button.btn.danger(type="button") Read more
</template>

<!-- this component renders all products, selected in upper component (Catalog, Home), can be sorted and filtered in upper component
 products have a visual box with name of product, main thumb image, price and button to "read more" -->
<script setup lang="ts">
const loading = ref(true)

const props = defineProps<{products?: [productType]}>()

watch(() => props.products, (newProducts) => {
  if (newProducts && newProducts.length > 0) {
    loading.value = false;
  }
}, { immediate: true })
</script>
