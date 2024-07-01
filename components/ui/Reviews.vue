<template lang="pug">
  div
    h1 Reviews
    div.reviews-back.mb20(@click="emit('backToProduct')") Back to Product
    div.flex-reviews
      div.reviews-50
        div.card-flex.review-card(v-for="review in reviews")
          div.bold {{review.username}}
          h5 {{review.date}}
          div {{review.text}}
      div.reviews-50(v-if="isAuthentificated")
        div(v-if="reviewSended")
          h3 You have already left a review or rating on this product
        div(v-else)
          div.mb10.rating-star Push your rating
          span.rating-star
            input(type="radio" id="0stars" value="0" v-model="ratingVote")
            label(for="0stars")  0
          span.rating-star
            input(type="radio" id="1star" value="1" v-model="ratingVote")
            label(for="1star")  1
          span.rating-star
            input(type="radio" id="0stars" value="2" v-model="ratingVote")
            label(for="2stars")  2
          span.rating-star
            input(type="radio" id="1star" value="3" v-model="ratingVote")
            label(for="3star")  3
          span.rating-star
            input(type="radio" id="0stars" value="4" v-model="ratingVote")
            label(for="4stars")  4
          span.rating-star
            input(type="radio" id="0stars" value="5" v-model="ratingVote")
            label(for="5stars")  5
          div.mt10.rating-star
            label(for="review-area") Your review for this product (Optional)
            textarea.review-textarea.mt10(placeholder="Write review... 300 symbols max" id="review-area" v-model="reviewText" )
          button.btn.main.mt10(:disabled="!ratingVote" @click="emit('sendReview', {reviewText: reviewText, ratingVote: ratingVote})"
          type="button") Send review
      div(v-else)
        span.mr10 To send rating and review please
        nuxt-link(:to="{name: 'signin'}")
          button.btn.main(type="button") Sign In
</template>

<!-- this component is rendering all current reviews and rating of product, and also contains form of voting and review form.
if user isnt authorized, render message, that authorization needed to send rating and review.
if user already left review, render message "You have already left a review or rating on this product" -->
<script setup lang="ts">
const emit = defineEmits(['sendReview', 'backToProduct'])
const props = defineProps<{
  isAuthentificated: boolean,
  reviews: Array<reviewsType>,
  reviewSended: boolean,
}>()

const ratingVote = ref<number>()
const reviewText = ref<string>()

</script>