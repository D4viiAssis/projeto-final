<script setup>
defineProps({
  src: String,
  alt: String,
  size: { type: String, default: 'md' }
});
</script>

<template>
  <div class="avatar-container" :class="`size-${size}`">
    <img 
      v-if="src" 
      :src="src" 
      :alt="alt" 
      class="avatar-img"
      @error="(e) => e.target.style.display='none'"
    >
    <div class="avatar-fallback">
      {{ alt?.charAt(0).toUpperCase() || 'U' }}
    </div>
  </div>
</template>

<style scoped>
.avatar-container {
  border-radius: 50%;
  overflow: hidden;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #dbdbdb;
  position: relative;
}

.size-sm { width: 32px; height: 32px; font-size: 0.8rem; }
.size-md { width: 44px; height: 44px; font-size: 1rem; }
.size-lg { width: 150px; height: 150px; font-size: 3rem; }

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #efefef;
  color: #8e8e8e;
  font-weight: bold;
  z-index: 1;
}
</style>