<template lang="pug">
  div.card.alert.danger
    h3.center.red {{UiStore.getErrorMessage}}
</template>

<!-- Component to show error from server side if exist -->
<script setup lang="ts">
import {useUiStore} from "@/stores/UiStore";
const UiStore = useUiStore()

</script>