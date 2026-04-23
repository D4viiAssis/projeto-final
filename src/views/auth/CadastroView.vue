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
    await authStore.register(form.name, form.username, form.email, form.password, form.password_confirmation);
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
  <form @submit.prevent="handleRegister" class="text-start">
    <div class="mb-2">
      <input v-model="form.name" type="text" class="form-control" placeholder="Nome Completo" required>
    </div>
    <div class="mb-2">
      <input v-model="form.username" type="text" class="form-control" placeholder="Nome de usuário" required>
      <small v-if="serverErrors.username" class="text-danger">{{ serverErrors.username[0] }}</small>
    </div>
    <div class="mb-2">
      <input v-model="form.email" type="email" class="form-control" placeholder="Email" required>
      <small v-if="serverErrors.email" class="text-danger">{{ serverErrors.email[0] }}</small>
    </div>
    <div class="mb-2">
      <input v-model="form.password" type="password" class="form-control" placeholder="Senha" required>
    </div>
    <div class="mb-3">
      <input v-model="form.password_confirmation" type="password" class="form-control" placeholder="Confirmar Senha" required>
    </div>

    <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
      <Spinner v-if="isLoading" />
      <span v-else>Cadastrar</span>
    </button>

    <p class="mt-3 text-center small">
      Já tem uma conta? <router-link to="/login" class="fw-bold text-decoration-none">Conecte-se</router-link>
    </p>
  </form>
</template>