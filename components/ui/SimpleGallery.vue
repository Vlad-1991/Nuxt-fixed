<template lang="pug">
  div
    div(:id="galleryID")
      div(v-if="loading").loader
      a(
          v-for="(image, key) in imagesData"
          :key="key"
          :href="IMAGES_BIG + image.largeURL"
          :data-pswp-width="image.width"
          :data-pswp-height="image.height"
          target="_blank"
          rel="noreferrer")
        nuxt-img#first_image(v-show="!loading" :src="IMAGES_BIG + imagesData[0].largeURL" v-if="key === 0"
          :alt="name" width="500px" height="500px" @error="imgError" @load="loadImg" format="webp" quality="80")
</template>

<!-- this component render beautiful gallery with one or many product images
 with UI to show next or previous image, to close image by mouse click or press escape -->
<script setup lang="ts">
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import {onMounted, onUnmounted, ref} from "vue";

const props = defineProps<{
  galleryID: string,
  name: string,
  images: [imageType]
}>()

const loading = ref(true)
const loaded = ref(false)

let lightbox: (PhotoSwipeLightbox | null)

const imagesData = props.images

onMounted((): void => {
  if (!lightbox) {
    lightbox = new PhotoSwipeLightbox({
      gallery: '#' + props.galleryID,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();
  }
  const image = document.getElementById('first_image') as HTMLImageElement | null;
  if (image) {
    if(image.complete){
      loadImg();
    }else{
      image.addEventListener('load', loadImg);
      image.addEventListener('error', imgError);
    }

  }
})

onUnmounted((): void => {
    if (lightbox) {
      lightbox.destroy();
      lightbox = null;
    }
  })

const loadImg = () => {
  loading.value = false
}

const imgError = () => {
  console.log('Error loading image')
}

</script>

<style scoped>
.img_size{
  width: 500px;
  height: 500px;
}
</style>