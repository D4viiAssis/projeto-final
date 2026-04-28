<script setup>

/*IMPORTAÇÕES: Trazendo as ferramentas necessárias */

import { ref } from 'vue'; // Para criar variáveis que o Vue observa (reativas)
import { useRouter } from 'vue-router'; // São as rotas que troca de página
import { useAuthStore } from '@/stores/auth'; // O "cofre" que guarda o login (Pinia)
import Spinner from '@/components/ui/Spinner.vue'; // Componente visual de carregamento

// Instanciando as ferramentas
const router = useRouter(); 
const authStore = useAuthStore();

/**
 * ESTADO (DATA): As variáveis que controlam o formulário e a interface
 */
const email = ref('');       // Guarda o e-mail digitado
const password = ref('');    // Guarda a senha digitada
const isLoading = ref(false); // Controla se o botão mostra "Entrar" ou o Spinner
const errorMsg = ref('');     // Guarda mensagens de erro vindas do servidor

/*FUNÇÃO PRINCIPAL: handleLogin
 * É disparada quando o usuário clica no botão ou dá Enter */
const handleLogin = async () => {
  isLoading.value = true; // Inicia o estado de carregamento (trava o botão)
  errorMsg.value = '';    // Limpa erros de tentativas anteriores

  try {
    // 1. Chama a action 'login' da Store de Autenticação
    // O 'await' faz o código esperar a resposta do servidor
    await authStore.login(email.value, password.value);
    
    // 2. Se o login funcionar, redireciona para a rota do Feed
    router.push('/feed');
  } catch (err) {
    // 3. Se der erro (ex: senha errada), captura a mensagem do Backend (Laravel)
    // Usamos o 'optional chaining' (?.) para evitar erros se a resposta estiver vazia
    errorMsg.value = err.response?.data?.message || 'Erro ao entrar. Verifique suas credenciais.';
  } finally {
    // 4. Independente de sucesso ou erro, desliga o carregamento no final
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