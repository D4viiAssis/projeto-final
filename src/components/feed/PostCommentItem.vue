<template>
  <div class="comment-item d-flex mb-2">
    <Avatar :src="comment.user.avatar_url" :alt="comment.user.username" size="sm" />
    <div class="ms-2 flex-grow-1">
      <p class="mb-0">
        <strong>{{ comment.user.username }}</strong> {{ comment.body }}
      </p>
      <small class="text-muted">{{ timeAgo(comment.created_at) }}</small>
      <button
        v-if="canDelete"
        @click="$emit('delete', comment.id)"
        class="btn btn-link btn-sm text-danger p-0 ms-2"
      >
        Excluir
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Avatar from '@/components/ui/Avatar.vue';
import { timeAgo } from '@/utils/date';

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});

const authStore = useAuthStore();

const canDelete = computed(() => {
  const currentUserId = authStore.user?.id;
  if (!currentUserId) return false;
  const commentUserId = props.comment.user?.id ?? props.comment.user_id;
  return Number(commentUserId) === Number(currentUserId);
});
</script>