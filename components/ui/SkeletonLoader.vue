<template lang="pug">
  div.flex-row
    div.flex-col.skeleton-card(v-for="n in 10" :key="n")
      div.skeleton-text
      div.skeleton-thumbnail
      div.skeleton-text.short
      div.skeleton-button
</template>

<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f0f0f0;
  border-radius: 4px;
  padding: 3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-thumbnail {
  width: 100%;
  height: 150px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-text {
  width: 100%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-button {
  width: 50%;
  height: 30px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin: 0 auto;
}

.skeleton-text.short {
  width: 40%;
  margin: 0 auto;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
