<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFeedStore } from '@/stores/feed';

const feedStore = useFeedStore();
const router = useRouter();

const imageFile = ref(null);
const imagePreview = ref(null);
const description = ref('');
const isSubmitting = ref(false);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // CORREÇÃO: Usar .value sempre para refs
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  if (!imageFile.value) return alert('Selecione uma imagem!');

  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('image', imageFile.value);
    formData.append('description', description.value);

    console.log("Enviando post...");
    await feedStore.createPost(formData);
    
    router.push('/feed');
  } catch (error) {
    console.error("Erro na criação:", error);
    alert('Erro ao criar postagem. Verifique o console.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="container py-5" style="max-width: 500px;">
    <div class="card shadow-sm">
      <div class="card-header bg-white fw-bold text-center py-3">
        Nova Publicação
      </div>
      
      <div class="card-body p-0">
        <div v-if="imagePreview" class="position-relative">
          <img :src="imagePreview" class="img-fluid w-100" style="aspect-ratio: 1/1; object-fit: cover;" />
          <button @click="imagePreview = null; imageFile = null" class="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 opacity-75">
            X
          </button>
        </div>

        <div v-else class="py-5 text-center cursor-pointer" @click="$refs.fileInput.click()">
          <i class="bi bi-cloud-upload" style="font-size: 4rem; color: #dbdbdb;"></i>
          <p class="mt-2 text-muted">Selecione uma foto do seu computador</p>
        </div>

        <input 
          type="file" 
          ref="fileInput" 
          class="d-none" 
          accept="image/*" 
          @change="handleFileChange"
        />

        <div class="p-3">
          <textarea 
            v-model="description" 
            class="form-control border-0 shadow-none p-0" 
            placeholder="Escreva uma legenda..." 
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="card-footer bg-white border-0 p-3">
        <button 
          @click="handleSubmit" 
          class="btn btn-primary w-100 fw-bold" 
          :disabled="isSubmitting || !imageFile"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          Compartilhar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
textarea { resize: none; font-size: 14px; }
</style>