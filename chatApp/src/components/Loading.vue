<script setup>
</script>

<template>
  <div class="loader">
    <div class="left"></div>
    <div class="right"></div>
  </div>
</template>

<style scoped>
.loader {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: #efefef;
}
@keyframes slide-left {
  0% {
    transform: translateX(125%) scale(1, 1);
  }
  100% {
    transform: translateX(-25%) scale(0.2, 1);
  }
}
@keyframes slide-right {
  0% {
    transform: translateX(-125%) scale(1, 1);
  }
  100% {
    transform: translateX(25%) scale(0.2, 1);
  }
}

.loader * {
  background: #2c3e50;
  width: 100%;
  height: 100%;
  animation: slide 1s ease-in-out infinite;
  position: absolute;
  top: 0;
  height: 2px;
}

.left {
  transform-origin: left;
  left: 0;
  animation-name: slide-left;
}

.right {
  transform-origin: right;
  right: 0;
  animation-name: slide-right;
}
</style>