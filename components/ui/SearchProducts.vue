<template lang="pug">
  div.mb20.form-control.searchquery
    label(for="search") Search products:
    input(type="text" id="search" v-model="searchQuery" @input="emit('changedSearch', searchQuery)")
</template>

<!-- component with 1 text input, emit event to upper component to filter products from server by searched value. -->
<script setup lang="ts">
import {ref} from "vue";
const searchQuery = ref()
const emit = defineEmits(['changedSearch'])
</script>