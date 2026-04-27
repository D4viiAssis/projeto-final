<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Avatar from '@/components/ui/Avatar.vue';

const authStore = useAuthStore();
const router = useRouter();

const name = ref('');
const bio = ref('');
const imageFile = ref(null);
const imagePreview = ref(null);
const isSubmitting = ref(false);

// Preenche os campos com os dados atuais
onMounted(() => {
  if (authStore.user) {
    name.value = authStore.user.name;
    bio.value = authStore.user.bio || '';
  }
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Truque do Laravel para aceitar arquivos em Update
    formData.append('name', name.value);
    formData.append('bio', bio.value);
    
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    await authStore.updateProfile(formData);
    alert('Perfil atualizado com sucesso!');
    router.push('/perfil');
  } catch (error) {
    alert('Erro ao atualizar perfil.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="container py-5" style="max-width: 600px;">
    <div class="card border shadow-sm">
      <div class="card-body p-4 p-md-5">
        <h4 class="mb-4 fw-bold text-dark text-start">Editar Perfil</h4>

        <div class="d-flex align-items-center mb-4">
          <Avatar 
            size="lg" 
            :src="imagePreview || authStore.user?.profile_photo_url" 
          />
          <div class="ms-3">
            <h6 class="mb-1 fw-bold text-dark">{{ authStore.user?.username }}</h6>
            <button 
              type="button" 
              class="btn btn-link p-0 text-primary fw-bold text-decoration-none"
              @click="$refs.fileInput.click()"
            >
              Alterar foto de perfil
            </button>
            <input 
              type="file" 
              ref="fileInput" 
              class="d-none" 
              accept="image/*" 
              @change="handleFileChange"
            />
          </div>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-3 text-start">
            <label class="form-label fw-bold small">Nome</label>
            <input v-model="name" type="text" class="form-control" placeholder="Seu nome">
          </div>

          <div class="mb-4 text-start">
            <label class="form-label fw-bold small">Bio</label>
            <textarea 
              v-model="bio" 
              class="form-control" 
              rows="3" 
              placeholder="Conte algo sobre você..."
            ></textarea>
          </div>

          <div class="d-flex justify-content-between align-items-center pt-3 border-top">
            <button 
              type="button" 
              @click="router.back()" 
              class="btn btn-link text-dark text-decoration-none fw-bold"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn btn-primary px-4 fw-bold" 
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-control:focus {
  border-color: #dbdbdb;
  box-shadow: none;
}
.text-start {
  text-align: left;
}
</style>