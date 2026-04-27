<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFeedStore } from '@/stores/feed';

const feedStore = useFeedStore();
const router = useRouter();

const fileInput = ref(null);
const imageFile = ref(null);
const imagePreview = ref(null);
const description = ref('');
const isSubmitting = ref(false);

// Limpeza de memória: revoga a URL do preview para não vazar memória
const clearPreview = () => {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value);
  imagePreview.value = null;
  imageFile.value = null;
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validação de Tamanho: 5MB (5 * 1024 * 1024 bytes)
  if (file.size > 5 * 1024 * 1024) {
    alert('A imagem é muito grande! O limite é 5MB.');
    e.target.value = ''; // Reseta o input
    return;
  }

  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const handleSubmit = async () => {
  if (!imageFile.value) return;

  isSubmitting.value = true;
  try {
    const formData = new FormData();
    // O Laravel costuma esperar 'image' ou 'file' conforme o seu Controller
    formData.append('image', imageFile.value); 
    formData.append('description', description.value);

    await feedStore.createPost(formData);
    
    // Sucesso: Limpa tudo e volta para o feed
    clearPreview();
    router.push('/feed');
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Erro ao criar postagem.';
    alert(errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};

// Se o usuário sair da tela, limpamos o preview da memória
onUnmounted(() => {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value);
});
</script>

<template>
  <div class="container py-5" style="max-width: 500px;">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white fw-bold text-center py-3 border-bottom">
        Nova Publicação
      </div>
      
      <div class="card-body p-0">
        <div v-if="imagePreview" class="position-relative">
          <img :src="imagePreview" class="img-fluid w-100" style="aspect-ratio: 1/1; object-fit: cover;" />
          <button 
            @click="clearPreview" 
            class="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 rounded-circle opacity-75"
            style="width: 30px; height: 30px; line-height: 1;"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div 
          v-else 
          class="py-5 text-center cursor-pointer bg-light" 
          @click="fileInput.click()"
          style="min-height: 300px; display: flex; flex-direction: column; justify-content: center;"
        >
          <i class="bi bi-images" style="font-size: 4rem; color: #dbdbdb;"></i>
          <p class="mt-2 text-dark">Arraste uma foto ou clique para selecionar</p>
          <button class="btn btn-primary btn-sm mx-auto mt-2">Selecionar do dispositivo</button>
        </div>

        <input 
          type="file" 
          ref="fileInput" 
          class="d-none" 
          accept="image/*" 
          @change="handleFileChange"
        />

        <div class="p-3 border-top">
          <textarea 
            v-model="description" 
            class="form-control border-0 shadow-none p-0" 
            placeholder="Escreva uma legenda..." 
            rows="3"
            maxlength="2200"
          ></textarea>
        </div>
      </div>

      <div class="card-footer bg-white border-top p-3">
        <button 
          @click="handleSubmit" 
          class="btn btn-primary w-100 fw-bold" 
          :disabled="isSubmitting || !imageFile"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ isSubmitting ? 'Publicando...' : 'Compartilhar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; transition: background 0.2s; }
.cursor-pointer:hover { background-color: #f8f9fa !important; }
textarea { resize: none; font-size: 14px; min-height: 80px; }
.card { border-radius: 12px; overflow: hidden; }
</style>