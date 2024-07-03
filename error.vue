<template lang="pug">
  NuxtLayout
    main(v-if="error & error.statusCode === 404").center
      h1 404!
      h1 Sorry, that page doesn't exist.
      NuxtLink.link(@click="handleError") Back to home page
    main.center(v-else)
      h1 Dang
      p
      <strong>{{ error.message }}</strong>
      p It looks like something broke.
      p Sorry about that.
      NuxtLink.link(@click="handleError") Back to home page
</template>

<script setup lang="ts">
const error = useError()

const handleError = () => {
  clearError({
    redirect:  {name: 'index'},
  })
}
</script>