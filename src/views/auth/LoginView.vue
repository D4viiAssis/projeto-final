<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; 
import Spinner from '@/components/ui/Spinner.vue'; 

const router = useRouter(); 
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false)
const errorMsg = ref('');

const handleLogin = async () => {
  isLoading.value = true; 
  errorMsg.value = '';

  try {
    await authStore.login(email.value, password.value);
    
    router.push('/feed');
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Erro ao entrar. Verifique suas credenciais.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleLogin" class="w-100">
    
    <input 
      v-model="email" 
      type="email" 
      class="form-control mb-2" 
      placeholder="Email" 
      required
    >
    
    <input 
      v-model="password" 
      type="password" 
      class="form-control mb-3" 
      placeholder="Senha" 
      required
    >
    
    <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
      <Spinner v-if="isLoading" />
      <span v-else>Entrar</span>
    </button>

    <div v-if="errorMsg" class="alert alert-danger mt-3 py-2 small">
      {{ errorMsg }}
    </div>
    
    <div class="mt-4 small">
      Não tem uma conta? 
      <router-link to="/cadastro" class="fw-bold text-decoration-none">
        Cadastre-se
      </router-link>
    </div>
  </form>
</template>