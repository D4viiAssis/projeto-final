<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Spinner from '@/components/ui/Spinner.vue';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const serverErrors = ref({});

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const handleRegister = async () => {
  isLoading.value = true;
  serverErrors.value = {};
  try {
    // CORREÇÃO: Passando o objeto 'form' completo
    await authStore.register(form);
    router.push('/feed');
  } catch (err) {
    if (err.response?.data?.errors) {
      serverErrors.value = err.response.data.errors;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="card p-4 shadow-sm" style="width: 100%; max-width: 350px;">
      <h3 class="text-center mb-4 fw-bold">InstaClone</h3>
      <form @submit.prevent="handleRegister" class="text-start">
        <div class="mb-2">
          <input v-model="form.name" type="text" class="form-control" placeholder="Nome Completo" required>
          <small v-if="serverErrors.name" class="text-danger small">{{ serverErrors.name[0] }}</small>
        </div>
        
        <div class="mb-2">
          <input v-model="form.username" type="text" class="form-control" placeholder="Nome de usuário" required>
          <small v-if="serverErrors.username" class="text-danger small">{{ serverErrors.username[0] }}</small>
        </div>
        
        <div class="mb-2">
          <input v-model="form.email" type="email" class="form-control" placeholder="Email" required>
          <small v-if="serverErrors.email" class="text-danger small">{{ serverErrors.email[0] }}</small>
        </div>
        
        <div class="mb-2">
          <input v-model="form.password" type="password" class="form-control" placeholder="Senha" required>
          <small v-if="serverErrors.password" class="text-danger small">{{ serverErrors.password[0] }}</small>
        </div>
        
        <div class="mb-3">
          <input v-model="form.password_confirmation" type="password" class="form-control" placeholder="Confirmar Senha" required>
        </div>

        <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="isLoading">
          <Spinner v-if="isLoading" size="sm" />
          <span v-else>Cadastrar</span>
        </button>

        <p class="mt-3 text-center small">
          Já tem uma conta? <router-link to="/login" class="fw-bold text-decoration-none">Conecte-se</router-link>
        </p>
      </form>
    </div>
  </div>
</template>