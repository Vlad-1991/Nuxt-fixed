<template lang="pug">
  div.flex-row
    div(class="flex-col" v-for="product in products" :key="product.id")
      div.card-flex
        div.card-body-my
          nuxt-link(:to="{name: 'product-id', params: {id: product.id} }")
            h4 {{product.name}}
          div
            img(:src="product.image[0].thumbnailURL" class="card-image" width="150px" height="150px" :alt="product.name")
          h3 ${{product.price}}
          nuxt-link(:to="{name: 'product-id', params: {id: product.id} }")
            button.btn.danger(type="button") Read more
</template>

<!-- this component renders all products, selected in upper component (Catalog, Home), can be sorted and filtered in upper component
 products have a visual box with name of product, main thumb image, price and button to "read more" -->
<script setup lang="ts">
import type {productType} from "@/utils/types/requestTypes";
const props = defineProps<{products?: [productType]}>()
</script>
