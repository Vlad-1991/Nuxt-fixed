<template lang="pug">
  div.toggle-button(@click="emit('toggleSideBar')")
    div.bar
    div.bar
    div.bar
</template>

<!-- this is toggle button - which is switching state of CategorySidebar (Left Sidebar) - to show and hide sidebar by click on this button -->
<script setup lang="ts">
const emit = defineEmits(['toggleSideBar'])
</script>