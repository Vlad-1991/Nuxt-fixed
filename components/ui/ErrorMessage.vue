<template lang="pug">
  div.card.alert.danger
    h3(class="text-center mx-auto red") {{UiStore.getErrorMessage}}
</template>

<!-- Component to show error from server side if exist -->
<script setup lang="ts">
const UiStore = useUiStore()

</script>