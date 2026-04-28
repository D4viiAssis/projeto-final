<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFeedStore } from '@/stores/feed';

const feedStore = useFeedStore();
const router = useRouter();

const fileInput = ref(null);
const imageFile = ref(null);
const imagePreview = ref(null);
const caption = ref(''); // Mudamos de description para caption
const isSubmitting = ref(false);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const captionMax = 2200;
const captionLength = computed(() => caption.value.length);

const handleSubmit = async () => {
  if (!imageFile.value) return;
  if (captionLength.value > captionMax) return alert(`Legenda deve ter no máximo ${captionMax} caracteres.`);
  isSubmitting.value = true;
  
  try {
    const formData = new FormData();
    formData.append('image', imageFile.value, imageFile.value.name);
    formData.append('caption', caption.value);

    await feedStore.createPost(formData);
    router.push('/feed');
  } catch (error) {
    console.error("Erro no upload:", error.response?.data || error);
    alert(error.response?.data?.message || 'Erro ao criar postagem.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="container py-5" style="max-width: 500px;">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white fw-bold text-center py-3 border-bottom">Nova Publicação</div>
      <div class="card-body p-0 text-center">
        <div v-if="imagePreview">
          <img :src="imagePreview" class="img-fluid w-100" style="aspect-ratio: 1/1; object-fit: cover;" />
        </div>
        <div v-else @click="fileInput.click()" class="py-5 bg-light cursor-pointer" style="min-height: 300px;">
          <i class="bi bi-images display-1 text-muted"></i>
          <p>Selecione uma foto</p>
        </div>
        <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileChange" />
        <div class="p-3 border-top">
          <textarea v-model="caption" class="form-control border-0 shadow-none" placeholder="Escreva uma legenda..." rows="3"></textarea>
          <div class="text-end text-muted small mt-2">
            {{ captionLength }} / 2200
          </div>
        </div>
      </div>
      <div class="card-footer bg-white p-3">
        <button @click="handleSubmit" class="btn btn-primary w-100 fw-bold" :disabled="isSubmitting || !imageFile">
          {{ isSubmitting ? 'Publicando...' : 'Compartilhar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>.cursor-pointer { cursor: pointer; }</style>