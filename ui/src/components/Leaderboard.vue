<template>
  <div class="mt-6">
    <h2 class="text-lg font-semibold">Classement</h2>
    <div class="mt-2">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>Joueur</span>
        <span>Mots devinés</span>
      </div>
      <ol class="space-y-2">
        <li v-for="row in rows" :key="row.userId" class="flex justify-between items-center bg-white/10 p-2 rounded">
          <span class="font-medium">Joueur {{ formatUserId(row.userId) }}</span>
          <span class="text-green-500">{{ row.totalCorrect }} mots</span>
        </li>
      </ol>
      <p v-if="rows.length === 0" class="text-gray-500 text-center mt-4">
        Aucun joueur n'a encore trouvé de mot
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../composables/useApi';

const props = defineProps<{ date: string }>();
const rows = ref<Array<{ userId: string; totalCorrect: number }>>([]);

const formatUserId = (userId: string) => {
  // Prendre les 4 premiers caractères de l'UUID
  return userId.slice(0, 4).toUpperCase();
};

const fetchLeaderboard = async () => {
  try {
    console.log('Fetching leaderboard for date:', props.date);
    const { data } = await api.get(`/guess/leaderboard/${props.date}`);
    console.log('Leaderboard data received:', data);
    rows.value = data;
  } catch (error) {
    console.error('Erreur lors de la récupération du leaderboard:', error);
  }
};

onMounted(fetchLeaderboard);
</script>
