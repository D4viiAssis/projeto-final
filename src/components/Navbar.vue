<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Avatar from '@/components/ui/Avatar.vue';

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user);

async function handleLogout() {
  try {
    await authStore.logout();
    router.replace('/login');
  } catch (error) {
    console.error('Erro ao sair:', error);
    // Mesmo se a API falhar, limpamos o local e mandamos pro login
    router.replace('/login');
  }
}
</script>

<template>
  <nav class="insta-nav">
    <div class="nav-content d-flex flex-column h-100">
      <div class="logo d-none d-md-block">InstaClone</div>
      
      <div class="nav-links flex-grow-1">
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

      <div class="nav-links mt-auto logout-section">
        <a href="#" @click.prevent="handleLogout" title="Sair" class="logout-btn">
          <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M5 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h7v2H6v16h6v2H5zm13-5l-1.41-1.41L18.17 13H10v-2h8.17l-1.58-1.59L18 8l4 4-4 4z"/></svg>
          <span class="d-none d-md-inline">Sair</span>
        </a>
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
  .nav-links { display: flex; flex-direction: column; gap: 10px; margin-top: 30px; }
  .nav-links a { 
    display: flex; 
    align-items: center; 
    gap: 15px; 
    text-decoration: none; 
    color: var(--color-text); 
    padding: 12px; 
    border-radius: var(--radius-md); 
    transition: background 0.2s;
  }
  .nav-links a:hover { background: #f2f2f2; }
  .logo { font-size: 1.5rem; font-weight: bold; margin-bottom: 20px; }
  .logout-section { margin-top: auto; border-top: 1px solid var(--color-border); padding-top: 10px; }
}

/* Mobile */
@media (max-width: 767px) {
  .insta-nav { position: fixed; bottom: 0; width: 100%; height: 60px; border-top: 1px solid var(--color-border); }
  .nav-content { height: 100%; }
  .nav-links { display: flex; justify-content: space-around; align-items: center; height: 100%; margin-top: 0 !important; }
  .nav-links a span { display: none; }
  .logout-section { display: none !important; } /* Esconde o sair no mobile para não poluir, ou deixe como mais um ícone */
}

.router-link-active svg { transform: scale(1.1); font-weight: bold; }
.logout-btn:hover { color: #ed4956 !important; }
</style>