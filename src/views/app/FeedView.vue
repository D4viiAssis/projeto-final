<script setup>
import { onMounted } from 'vue';
import { useFeedStore } from '@/stores/feed';
import PostCard from '@/components/PostCard.vue';
import Spinner from '@/components/ui/Spinner.vue';

const feedStore = useFeedStore();

onMounted(async () => {
  
  await feedStore.fetchFeed();
});
</script>

<template>
  <div class="feed-container mx-auto py-4" style="max-width: 470px;">
    
    <div v-if="feedStore.isLoading && feedStore.feedPosts.length === 0" class="text-center mt-5">
      <Spinner size="lg" style="color: var(--color-primary)" />
    </div>

    <div v-else>
      <PostCard 
        v-for="post in feedStore.feedPosts" 
        :key="post.id" 
        :post="post" 
      />

      <div v-if="feedStore.nextCursor" class="text-center my-5">
        <button 
          @click="feedStore.loadMoreFeed()" 
          class="btn btn-sm btn-outline-secondary" 
          :disabled="feedStore.isLoading"
        >
          {{ feedStore.isLoading ? 'Carregando mais...' : 'Ver mais postagens' }}
        </button>
      </div>  

      <div v-if="feedStore.feedPosts.length === 0" class="text-center mt-5">
        <i class="bi bi-camera text-muted" style="font-size: 3rem;"></i>
        <p class="text-muted mt-2">Nenhuma postagem encontrada.<br>Seja o primeiro a postar!</p>
      </div>
    </div>
  </div>
</template>