<template>
  <div class="max-w-md mx-auto p-4">
    <div v-if="today">
      <div class="text-center text-lg font-semibold text-green-600 mb-2">
        {{ totalCorrect }} bonne{{ totalCorrect > 1 ? 's' : '' }} réponse{{ totalCorrect > 1 ? 's' : '' }} aujourd'hui
      </div>

      <img :src="today.imageUrl" alt="Photo du jour" class="rounded shadow mb-4" />

      <div v-if="canSubmit" class="flex space-x-2 mb-2">
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
      <p v-if="remaining !== null" class="text-sm text-gray-500 text-center mt-1">
        {{ remaining }} essai{{ remaining > 1 ? 's' : '' }} restant{{ remaining > 1 ? 's' : '' }}
      </p>

      <Leaderboard class="mt-6" />
    </div>

    <p v-else>Chargement…</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '../composables/useApi'
import Leaderboard from './Leaderboard.vue'

// 🎯 Génère un userId du type "happy-otter-123"
function generateUserId(): string {
  const adjectives = ['happy', 'cool', 'tiny', 'fuzzy', 'silly', 'brave', 'sleepy', 'swift']
  const animals = ['panda', 'kiwi', 'lizard', 'cat', 'fox', 'octopus', 'otter', 'koala']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  const number = Math.floor(Math.random() * 1000)
  return `${adj}-${animal}-${number}`
}

// 🔐 getOrCreate userId
let userId = localStorage.getItem('dpguess_userId')
if (!userId) {
  userId = generateUserId()
  localStorage.setItem('dpguess_userId', userId)
}

// Réactifs
const today = ref<any>(null)
const guess = ref('')
const feedback = ref('')
const totalCorrect = ref(0)
const remaining = ref<number | null>(null)

const feedbackClass = computed(() =>
  feedback.value.startsWith('Bravo') ? 'text-green-600' : 'text-red-600'
)

// Chargement photo du jour
async function loadToday() {
  try {
    const { data } = await api.get('/photo/today')
    today.value = {
  ...data,
  imageUrl: `${import.meta.env.VITE_API_URL}${data.imageUrl}`
}

    const { data: correctCount } = await api.get<number>('/guess/today/correct-count')
    totalCorrect.value = correctCount
  } catch (err: any) {
    console.error('Erreur loadToday:', err)
    feedback.value = 'Impossible de charger la photo du jour'
  }
}

// Envoi du guess
async function submit() {
  if (!guess.value.trim()) return

  try {
    const { data } = await api.post('/guess', {
      userId,
      attempt: guess.value
    })

    if (data.status === 'correct') {
      feedback.value = 'Bravo 🎉 bonne réponse !'
      totalCorrect.value++
    } else if (data.status === 'wrong') {
      feedback.value = `Raté 😬 il te reste ${data.remainingAttempts} essai${data.remainingAttempts > 1 ? 's' : ''}`
    }

    remaining.value = data.remainingAttempts
    guess.value = ''
  } catch (err: any) {
    feedback.value = err.response?.data?.message || 'Erreur lors de la soumission'
  }
}

const canSubmit = computed(() =>
  remaining.value !== 0 && !feedback.value.startsWith('Bravo')
)


onMounted(loadToday)
</script>
