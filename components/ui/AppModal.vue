<template lang="pug">
  div
    div(class="modal-backdrop")
    div.modal
      h3(class="text-center mx-auto mb-[50px]" v-if="title") {{ title }}
      div(class="text-center mx-auto mb-[50px]")
        slot
      div(class="text-center mx-auto mt-[10px]")
        button.primary.btn(@click="returnToCatalog()" type="button") Ok
</template>

<script setup lang="ts">
const router = useRouter();
const emit = defineEmits(['close'])
const props = defineProps<{title: string}>()

/* to close modal window and redirect to Catalog route */
let returnToCatalog = (): void => {
  emit('close')
  router.push({name: 'catalog'})
}
</script>