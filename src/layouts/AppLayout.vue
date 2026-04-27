<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content min-vh-100">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<style scoped>
.app-layout {
  display: flex;
}

.main-content {
  flex: 1;
  /* Garante que o conteúdo não fique embaixo da sidebar no Desktop */
  margin-left: 250px; 
  background-color: var(--color-bg);
}

/* Ajuste para Mobile */
@media (max-width: 767px) {
  .main-content {
    margin-left: 0;
    padding-bottom: 60px; /* Espaço para a barra inferior */
  }
}
</style>