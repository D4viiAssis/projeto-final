<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/layouts/AuthLayout.vue';
import AppLayout from '@/layouts/AppLayout.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.init();
});
</script>

<template>
  <component :is="$route.meta.layout === 'AuthLayout' ? AuthLayout : AppLayout">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>