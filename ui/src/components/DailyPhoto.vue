<template>
  <div class="max-w-md mx-auto p-4">
    <div v-if="today" class="space-y-4">
      <div class="text-center">
        <div class="text-lg font-semibold text-green-600">
          {{ totalCorrect }} bonne{{ totalCorrect > 1 ? 's' : '' }} réponse{{ totalCorrect > 1 ? 's' : '' }} aujourd'hui
        </div>
        <div class="text-sm text-gray-600">
          Photo du {{ today.period === 'morning' ? 'matin' : 'midi' }}
        </div>
      </div>
      <img :src="today.imageUrl" alt="Photo du jour" class="rounded shadow" />
      <div class="flex space-x-2">
        <input
          v-model="guess"
          @keyup.enter="submit"
          class="flex-1 border rounded px-2 py-1"
          placeholder="Votre proposition"
        />
        <button
          @click="submit"
          class="bg-blue-500 text-white px-4 rounded"
        >OK</button>
      </div>
      <p v-if="feedback" :class="feedbackClass">{{ feedback }}</p>
      <Leaderboard :date="today.date" />
    </div>
    <p v-else>Chargement…</p>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { ref, onMounted, computed } from 'vue';
import { api } from '../composables/useApi';
import Leaderboard from './Leaderboard.vue';

interface Today { 
  date: string; 
  imageUrl: string; 
  maxTries: number;
  period: 'morning' | 'afternoon';
}

// 📌 Génération / récupération du userId
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = uuidv4();
  localStorage.setItem('userId', userId);
}

// états locaux
const today = ref<Today | null>(null);
const guess = ref('');
const feedback = ref('');
const totalCorrect = ref(0);
const feedbackClass = computed(() =>
  feedback.value.startsWith('Bravo') ? 'text-green-600' : 'text-red-600'
);

// chargement de la photo du jour
async function loadToday() {
  try {
    const { data } = await api.get<Today>('today');
    today.value = data;
    // Charger le nombre de bonnes réponses
    const { data: correctCount } = await api.get<number>(`/guess/total-correct/${data.date}`);
    totalCorrect.value = correctCount;
  } catch (err: any) {
    console.error('Erreur loadToday:', err);
    feedback.value = 'Impossible de charger la photo du jour';
  }
}

// soumission d'un guess avec userId unique
async function submit() {
  if (!today.value) return;
  try {
    const { data } = await api.post('guess', {
      userId,                   // ← ici on utilise notre uuid persistant
      date: today.value.date,
      guess: guess.value,
    });
    feedback.value = data.correct
      ? 'Bravo 🎉'
      : `Raté, il vous reste ${data.remainingTries} essais`;
    
    // Mettre à jour le nombre de bonnes réponses si la réponse est correcte
    if (data.correct) {
      totalCorrect.value++;
    }
  } catch (e: any) {
    feedback.value = e.response?.data?.message || 'Erreur';
  }
}

onMounted(loadToday);
</script>

