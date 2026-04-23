<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <h1 class="logo-text">InstaClone</h1>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--color-bg); }
.auth-container { background: var(--color-surface); padding: 40px; border: 1px solid var(--color-border); width: 100%; max-width: 350px; text-align: center; }
.logo-text { font-weight: bold; margin-bottom: 30px; background: linear-gradient(45deg, var(--color-gradient-start), var(--color-gradient-end)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
</style>