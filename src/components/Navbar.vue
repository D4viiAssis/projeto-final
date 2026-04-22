<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Avatar from '@/components/ui/Avatar.vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<template>
  <nav class="insta-nav">
    <div class="nav-content">
      <div class="logo d-none d-md-block">InstaClone</div>
      
      <div class="nav-links">
        <router-link to="/feed" title="Home">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2.099l.497.465 9.504 8.871-1.328 1.423L19 11.302V21a1 1 0 01-1 1H6a1 1 0 01-1-1v-9.698l-1.673 1.562-1.327-1.423 9.503-8.87zM7 20h10v-9.432l-5-4.667-5 4.667V20z"/></svg>
          <span class="d-none d-md-inline">Página Inicial</span>
        </router-link>

        <router-link to="/descobrir" title="Buscar">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10 18a7.952 7.952 0 01-4.897-1.688l-4.396 4.396-1.414-1.414 4.396-4.396A7.952 7.952 0 012 10c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm0-14c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6z"/></svg>
          <span class="d-none d-md-inline">Explorar</span>
        </router-link>

        <router-link to="/criar" title="Criar">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>
          <span class="d-none d-md-inline">Criar</span>
        </router-link>

        <router-link to="/perfil" title="Perfil">
          <Avatar size="sm" :src="user?.avatarUrl" :alt="user?.username" />
          <span class="d-none d-md-inline">Perfil</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.insta-nav {
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  z-index: 1000;
}

/* Desktop */
@media (min-width: 768px) {
  .insta-nav { position: fixed; left: 0; top: 0; height: 100vh; width: 245px; padding: 20px; }
  .nav-links { display: flex; flex-direction: column; gap: 20px; margin-top: 30px; }
  .nav-links a { display: flex; align-items: center; gap: 15px; text-decoration: none; color: var(--color-text); padding: 10px; border-radius: var(--radius-md); }
  .nav-links a:hover { background: #f2f2f2; }
  .logo { font-size: 1.5rem; font-weight: bold; margin-bottom: 20px; }
}

/* Mobile */
@media (max-width: 767px) {
  .insta-nav { position: fixed; bottom: 0; width: 100%; height: 60px; border-top: 1px solid var(--color-border); }
  .nav-content { height: 100%; }
  .nav-links { display: flex; justify-content: space-around; align-items: center; height: 100%; }
  .nav-links a span { display: none; }
}

.router-link-active svg { transform: scale(1.1); font-weight: bold; }
</style>