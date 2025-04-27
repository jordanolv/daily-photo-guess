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

      <p v-else class="text-center text-sm text-gray-600 mt-2">
        <span v-if="alreadyFound">🎉 Tu as déjà trouvé la bonne réponse ! Reviens demain !</span>
        <span v-else>😢 Tu as utilisé tes 3 essais pour aujourd'hui</span>
      </p>

      <p v-if="feedback" :class="feedbackClass">{{ feedback }}</p>
      <p v-if="remaining !== null && canSubmit" class="text-sm text-gray-500 text-center mt-1">
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
import Leaderboard from '../components/Leaderboard.vue'

// 🎯 Génère un userId unique
function generateUserId(): string {
  const adjectives = ['happy', 'cool', 'tiny', 'fuzzy', 'silly', 'brave', 'sleepy', 'swift']
  const animals = ['panda', 'kiwi', 'lizard', 'cat', 'fox', 'octopus', 'otter', 'koala']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  const number = Math.floor(Math.random() * 1000)
  return `${adj}-${animal}-${number}`
}

// 🔐 Récupère ou crée l'identifiant unique
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
const alreadyFound = ref(false)

const feedbackClass = computed(() =>
  feedback.value.startsWith('Bravo') ? 'text-green-600' : 'text-red-600'
)

const canSubmit = computed(() => remaining.value !== 0 && !alreadyFound.value)

// 🔁 Chargement des données du jour
async function loadToday() {
  try {
    const { data } = await api.get('/photo/today')
    today.value = {
      ...data,
      imageUrl: `${import.meta.env.VITE_API_URL}${data.imageUrl}`
    }

    const { data: correctCount } = await api.get<number>('/guess/today/correct-count')
    totalCorrect.value = correctCount

    const { data: status } = await api.get(`/guess/today/status/${userId}`)
    remaining.value = status.remainingAttempts
    alreadyFound.value = status.alreadyFound

    if (status.alreadyFound) {
      feedback.value = 'Bravo 🎉 bonne réponse !'
    }
  } catch (err: any) {
    console.error('Erreur loadToday:', err)
    feedback.value = 'Impossible de charger la photo du jour'
  }
}

// 📤 Soumission de la proposition
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
      alreadyFound.value = true
    } else if (data.status === 'wrong') {
      feedback.value = `Raté 😬 il te reste ${data.remainingAttempts} essai${data.remainingAttempts > 1 ? 's' : ''}`
    }

    remaining.value = data.remainingAttempts
    guess.value = ''
  } catch (err: any) {
    feedback.value = err.response?.data?.message || 'Erreur lors de la soumission'
  }
}

onMounted(loadToday)
</script>
