<template>
  <nav class="custom-navbar">
    <div class="nav-content d-flex flex-column h-100">
      <div class="logo d-none d-md-block mb-5 p-3">
        <h3 class="instagram-logo">InstaClone</h3>
      </div>
      
      <div class="nav-links flex-grow-1">
        <router-link to="/feed" class="nav-item">
          <i class="bi bi-house-door icon"></i> 
          <span class="label d-none d-md-inline">Home</span>
        </router-link>
        
        <router-link to="/descobrir" class="nav-item">
          <i class="bi bi-search icon"></i> 
          <span class="label d-none d-md-inline">Buscar</span>
        </router-link>
        
        <router-link to="/criar" class="nav-item">
          <i class="bi bi-plus-square icon"></i> 
          <span class="label d-none d-md-inline">Criar</span>
        </router-link>
        
        <router-link to="/perfil" class="nav-item">
          <i class="bi bi-person icon"></i> 
          <span class="label d-none d-md-inline">Perfil</span>
        </router-link>
      </div>

      <div class="nav-footer p-2 mb-md-3">
        <button @click="handleLogout" class="nav-item logout-btn w-100 border-0 bg-transparent">
          <i class="bi bi-box-arrow-right icon"></i>
          <span class="label d-none d-md-inline">Sair</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  if (confirm('Deseja realmente sair?')) {
    await authStore.logout();
    router.replace('/login');
  }
};
</script>

<style scoped>
.icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.custom-navbar {
  position: fixed;
  z-index: 100;
  background: white;
  border-right: 1px solid var(--color-border);
}

.instagram-logo {
  font-weight: bold;
  font-size: 1.5rem;
  background: linear-gradient(to right, var(--color-gradient-start), var(--color-gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (min-width: 768px) {
  .custom-navbar {
    left: 0;
    top: 0;
    width: 250px;
    height: 100vh;
  }
  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 10px;
  }
}

@media (max-width: 767px) {
  .custom-navbar {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    border-right: none;
    border-top: 1px solid var(--color-border);
  }
  .nav-content { flex-direction: row !important; }
  .nav-links {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }
  .nav-footer { display: none; } /* Esconde logout na barra de baixo pra não apertar sem querer */
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  text-decoration: none;
  color: var(--color-text);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-item:hover {
  background-color: #f2f2f2;
}

/* Estilo específico do Logout */
.logout-btn:hover {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.nav-item.router-link-active {
  font-weight: bold;
}
</style>