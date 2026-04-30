<template>
  <nav class="custom-navbar">
    <div class="nav-content d-flex flex-column h-100">
      <div class="logo-container p-3 mb-4">
        <h3 class="instagram-logo">InstaClone</h3>
        <i class="bi bi-instagram logo-icon"></i>
      </div>
      
      <div class="nav-links flex-grow-1">
        <router-link to="/feed" class="nav-item">
          <div class="icon-wrapper"><i class="bi bi-house-door"></i></div>
          <span class="label">Home</span>
        </router-link>
        
        <router-link to="/descobrir" class="nav-item">
          <div class="icon-wrapper"><i class="bi bi-search"></i></div>
          <span class="label">Buscar</span>
        </router-link>
        
        <router-link to="/criar" class="nav-item">
          <div class="icon-wrapper"><i class="bi bi-plus-square"></i></div>
          <span class="label">Criar</span>
        </router-link>
        
        <router-link to="/perfil" class="nav-item">
          <div class="icon-wrapper"><i class="bi bi-person"></i></div>
          <span class="label">Perfil</span>
        </router-link>
      </div>

      <div class="nav-footer p-2 mb-md-3">
        <button @click="handleLogout" class="nav-item logout-btn w-100 border-0 bg-transparent">
          <div class="icon-wrapper"><i class="bi bi-box-arrow-right"></i></div>
          <span class="label">Sair</span>
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
/* Configurações Gerais */
.custom-navbar {
  position: fixed;
  z-index: 100;
  background: white;
  border-right: 1px solid #dbdbdb;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@media (min-width: 768px) {
  .custom-navbar {
    left: 0;
    top: 0;
    width: 75px; 
    height: 100vh;
  }
  .custom-navbar:hover {
    width: 250px; /* Largura aberta */
    box-shadow: 10px 0 20px rgba(0, 0, 0, 0.05);
  }
  .nav-links {
    padding: 0 12px;
  }
  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .instagram-logo {
    position: absolute;
    left: 20px;
    font-weight: bold;
    font-size: 1.4rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    white-space: nowrap;
    background: linear-gradient(to right, #833ab4, #fd1d1d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .logo-icon {
    font-size: 1.6rem;
    margin-left: 5px;
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  .custom-navbar:hover .instagram-logo { opacity: 1; }
  .custom-navbar:hover .logo-icon { opacity: 0; }

  .label {
    opacity: 0;
    white-space: nowrap;
    transition: opacity 0.2s ease;
    font-size: 1rem;
  }

  .custom-navbar:hover .label {
    opacity: 1;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  text-decoration: none;
  color: #262626;
  border-radius: 8px;
  transition: background 0.2s, transform 0.1s;
  margin-bottom: 5px;
}

.icon-wrapper {
  min-width: 28px;
  display: flex;
  justify-content: center;
  font-size: 1.5rem;
}

.nav-item:hover {
  background-color: #fafafa;
  transform: scale(1.05);
}

.nav-item.router-link-active {
  font-weight: bold;
}

.nav-item.router-link-active i {
  -webkit-text-stroke: 1px black;
}

@media (max-width: 767px) {
  .custom-navbar {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    border-top: 1px solid #dbdbdb;
  }
  .nav-content { flex-direction: row !important; }
  .nav-links {
    display: flex;
    flex-direction: row !important;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }
  .logo-container, .label, .nav-footer { display: none; }
}

.logout-btn:hover {
  background-color: #fff1f0 !important;
  color: #ff4d4f !important;
}
</style>