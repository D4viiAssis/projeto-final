<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <div class="app-container">
    <Navbar />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .main-content { margin-left: 245px; padding: 30px; }
}
@media (max-width: 767px) {
  .main-content { padding-bottom: 70px; }
}
</style>