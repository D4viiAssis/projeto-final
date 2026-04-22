<script setup>
defineProps({
  src: String,
  alt: String,
  size: { type: String, default: 'md' } // sm (32px), md (44px), lg (80px)
});
</script>

<template>
  <div class="avatar-container" :class="`size-${size}`">
    <img v-if="src" :src="src" :alt="alt" @error="(e) => e.target.style.display='none'">
    <div v-else class="avatar-fallback">{{ alt?.charAt(0).toUpperCase() || 'U' }}</div>
  </div>
</template>

<style scoped>
.avatar-container {
  border-radius: var(--radius-full);
  overflow: hidden;
  background: #efefef;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.size-sm { width: 32px; height: 32px; }
.size-md { width: 44px; height: 44px; }
.size-lg { width: 80px; height: 80px; }
img { width: 100%; height: 100%; object-fit: cover; }
.avatar-fallback { font-weight: bold; color: var(--color-text-muted); }
</style>