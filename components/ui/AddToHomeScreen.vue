<template lang="pug">
  div
    button.btn.main(v-if="deferredPrompt" @click="installApp") Add to Home Screen
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const deferredPrompt = ref(null)

onMounted(() => {

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event triggered')
    e.preventDefault()
    deferredPrompt.value = e
  })
})

const installApp = async (): Promise<void> => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const choiceResult = await deferredPrompt.value.userChoice
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    deferredPrompt.value = null
  }
}
</script>
