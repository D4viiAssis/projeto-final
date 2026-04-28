<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const destination = computed(() => authStore.isAuthenticated ? '/feed' : '/login');

const goHome = () => {
  router.push(destination.value);
};
</script>

<template>
  <div class="container py-5 text-center">
    <h1 class="display-6">404</h1>
    <p class="lead">Página não encontrada.</p>
    <button class="btn btn-primary" @click="goHome">Ir para o início</button>
  </div>
</template>
