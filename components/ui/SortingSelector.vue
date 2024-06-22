<template lang="pug">
  div.form-control.w20.mb20
    label(for="sorting") Sort By:
    select(id="sorting" @change="$emit('sorting', $event.target.value)")
      option(disabled selected value) -- select an option --
      option(value="sortAZ")  A-Z Name
      option(value="sortBestsellers") Bestsellers
      option(value="sortPriceLowToHigh") Price: Low to High
      option(value="sortPriceHighToLow") Price: High to Low
</template>

<!-- this component render selector to sort product by criterias: alphavite, bestseller rating, price from low to high and price from high to low,
emit event with sorting value -->
<script setup lang="ts">
const emit = defineEmits(['sorting'])
</script>