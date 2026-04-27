<template>
  <div class="auth-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="auth-card p-4 bg-white border rounded shadow-sm" style="width: 100%; max-width: 350px;">
      <div class="text-center mb-4">
        <h1 class="instagram-logo">InstaClone</h1>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.instagram-logo {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  background: linear-gradient(to right, var(--color-gradient-start), var(--color-gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
}
</style>