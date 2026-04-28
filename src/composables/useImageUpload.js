import { ref, onUnmounted } from 'vue';

export function useImageUpload(maxSizeMB = 5) {
  const imageFile = ref(null);
  const imagePreview = ref(null);

  const handleFileChange = (file) => {
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`A imagem é muito grande! O limite é ${maxSizeMB}MB.`);
      return false;
    }

    // Limpa preview anterior se existir
    cleanup();

    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
    return true;
  };

  const cleanup = () => {
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
    }
    imageFile.value = null;
    imagePreview.value = null;
  };

  onUnmounted(cleanup);

  return {
    imageFile,
    imagePreview,
    handleFileChange,
    cleanup
  };
}