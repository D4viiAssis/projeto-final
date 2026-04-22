<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import AppLayout from '@/layouts/AppLayout.vue';

const route = useRoute();
const layouts = { AuthLayout, AppLayout };

// Pega o layout definido na rota (ou um default se não existir)
const layout = computed(() => layouts[route.meta.layout] || 'div');
</script>

<template>
  <component :is="layout">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>