<template>
  <form @submit.prevent="submitComment" class="d-flex mt-2">
    <input
      v-model="commentBody"
      type="text"
      class="form-control form-control-sm me-2"
      placeholder="Adicione um comentário..."
      :disabled="isSubmitting"
    />
    <button
      type="submit"
      class="btn btn-primary btn-sm"
      :disabled="!commentBody.trim() || isSubmitting"
    >
      <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"></span>
      <span v-else>Enviar</span>
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  postId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['commentAdded']);

const commentBody = ref('');
const isSubmitting = ref(false);

const submitComment = async () => {
  if (!commentBody.value.trim() || isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    emit('commentAdded', commentBody.value);
    commentBody.value = '';
  } catch (error) {
    console.error('Erro ao enviar comentário', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>