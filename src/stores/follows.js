import { defineStore } from 'pinia';
import { ref } from 'vue';
import { followsService } from '@/services/follows.service';

export const useFollowsStore = defineStore('follows', () => {
  const followingIds = ref(new Set());
  const pendingIds = ref(new Set());
  const isFollowing = (userId) => followingIds.value.has(Number(userId));

  const fetchFollowingList = async (viewerId) => {
    try {
      const data = await followsService.getFollowing(viewerId);
      const ids = (data.data || data).map(u => Number(u.id));
      followingIds.value = new Set(ids);
    } catch (error) {
      console.error("Erro ao carregar lista de seguidos", error);
    }
  };

  const toggleFollow = async (userId) => {
    const id = Number(userId);
    const currentlyFollowing = followingIds.value.has(id);

    const newSet = new Set(followingIds.value);
    
    try {
      if (currentlyFollowing) {
        newSet.delete(id);
        followingIds.value = newSet;
        await followsService.unfollowUser(id);
      } else {
        newSet.add(id);
        followingIds.value = newSet;
        await followsService.followUser(id);
      }
    } catch (error) {
      const rollbackSet = new Set(followingIds.value);
      if (currentlyFollowing) rollbackSet.add(id);
      else rollbackSet.delete(id);
      followingIds.value = rollbackSet;
      alert("Erro ao processar solicitação de follow.");
    }
  };

  return {
    followingIds,
    isFollowing,
    fetchFollowingList,
    toggleFollow
  };
});