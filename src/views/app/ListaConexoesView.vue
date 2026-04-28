<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useFollowsStore } from '@/stores/follows';
import { usersService } from '@/services/users.service';
import AccountCard from '@/components/profile/AccountCard.vue';

const route = useRoute();
const authStore = useAuthStore();
const followsStore = useFollowsStore();
const type = computed(() => route.params.type);
const title = computed(() => type.value === 'followers' ? 'Seguidores' : 'Seguindo');
const items = ref([]);
const isLoading = ref(true);

const resolveProfileUserId = async () => {
  const queryUsername = route.query.user;
  if (!queryUsername) {
    return authStore.user?.id;
  }

  if (queryUsername === authStore.user?.username) {
    return authStore.user?.id;
  }

  const profile = await usersService.getProfile(queryUsername);
  return profile.id;
};

const fetchList = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const userId = await resolveProfileUserId();
    if (!userId) return;

    if (type.value === 'followers') {
      const response = await usersService.getFollowers(userId);
      items.value = response.data || response;
    } else {
      const response = await usersService.getFollowing(userId);
      items.value = response.data || response;
    }
  } catch (error) {
    console.error('Erro ao carregar conexões:', error);
    items.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(() => [route.params.type, route.query.user], fetchList, { immediate: true });
</script>

<template>
  <div class="container py-4" style="max-width: 600px;">
    <h4 class="mb-4">{{ title }}</h4>
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>
    <div v-else>
      <div v-if="items.length === 0" class="text-center text-muted py-5">
        Nenhum item disponível no momento.
      </div>
      <div v-else>
        <AccountCard
          v-for="user in items"
          :key="user.id"
          :user="user"
          @toggleFollow="() => followsStore.toggleFollow(user.id)"
        />
      </div>
    </div>
  </div>
</template>
