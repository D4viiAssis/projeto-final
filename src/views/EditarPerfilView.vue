<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const name = ref('');
const bio = ref('');
const imageFile = ref(null);
const imagePreview = ref(null);
const isSubmitting = ref(false);
const fileInput = ref(null);

onMounted(() => {
  if (authStore.user) {
    name.value = authStore.user.name || '';
    bio.value = authStore.user.bio || '';
  }
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) return alert('Máximo 5MB');
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  if (!name.value) return alert('Nome é obrigatório');
  isSubmitting.value = true;

  try {
    // Orquestração: Dispara as duas rotas que o backend exige
    await authStore.updateProfile({
      name: name.value,
      bio: bio.value
    });

    if (imageFile.value) {
      await authStore.updateAvatar(imageFile.value);
    }
    
    alert('Perfil atualizado!');
    router.push('/perfil');
  } catch (error) {
    console.error(error);
    alert('Erro ao salvar alterações.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="container py-5" style="max-width: 600px;">
    <div class="card shadow-sm border">
      <div class="card-body p-4 p-md-5">
        <h4 class="mb-4 fw-bold text-start">Editar Perfil</h4>

        <div class="d-flex align-items-center mb-4">
          <img 
            :src="imagePreview || authStore.user?.avatar_url || 'https://ui-avatars.com/api/?name=' + name" 
            class="rounded-circle border"
            style="width: 80px; height: 80px; object-fit: cover;"
          />
          <div class="ms-3 text-start">
            <h6 class="mb-1 fw-bold">{{ authStore.user?.username }}</h6>
            <button type="button" class="btn btn-link p-0 text-primary fw-bold text-decoration-none small" @click="fileInput.click()">
              Alterar foto de perfil
            </button>
            <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileChange" />
          </div>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-3 text-start">
            <label class="form-label fw-bold small text-muted">Nome</label>
            <input v-model="name" type="text" class="form-control shadow-none">
          </div>
          <div class="mb-4 text-start">
            <label class="form-label fw-bold small text-muted">Bio</label>
            <textarea v-model="bio" class="form-control shadow-none" rows="3" maxlength="150"></textarea>
          </div>
          <div class="d-flex justify-content-between align-items-center pt-3 border-top">
            <button type="button" @click="router.back()" class="btn btn-link text-dark text-decoration-none fw-bold">Cancelar</button>
            <button type="submit" class="btn btn-primary px-4 fw-bold" :disabled="isSubmitting">
              {{ isSubmitting ? 'Salvando...' : 'Enviar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-control { border: 1px solid #dbdbdb; border-radius: 6px; }
textarea { resize: none; }
</style>