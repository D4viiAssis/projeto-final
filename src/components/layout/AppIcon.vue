<template>
  <i :class="iconClass" @click="$emit('click')"></i>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  filled: {
    type: Boolean,
    default: false
  }
});

const iconClass = computed(() => {
  const base = `bi bi-${props.name}`;
  return props.filled ? `${base}-fill` : base;
});
</script>

<style scoped>
i {
  cursor: pointer;
}
</style>