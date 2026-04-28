<template>
  <div class="comments-list">
    <div v-for="comment in comments" :key="comment.id" class="mb-2">
      <PostCommentItem
        :comment="comment"
        @delete="$emit('deleteComment', $event)"
      />
    </div>
    <div v-if="hasMore" class="text-center mt-3">
      <button @click="$emit('loadMore')" class="btn btn-outline-primary btn-sm">
        Carregar mais comentários
      </button>
    </div>
  </div>
</template>

<script setup>
import PostCommentItem from './PostCommentItem.vue';

defineProps({
  comments: {
    type: Array,
    default: () => []
  },
  hasMore: {
    type: Boolean,
    default: false
  }
});
</script>