<template>
  <div class="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-['Press_Start_2P']">
    <div class="w-full max-w-[800px] bg-[#1a1a1a] border-4 border-[#ff00ff] shadow-[0_0_20px_#ff00ff,inset_0_0_10px_#ff00ff] p-4 relative">
      <!-- Login Button -->
      <div class="absolute top-4 right-4 z-10">
        <UserStatus />
      </div>

      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-[#ff00ff] text-2xl md:text-3xl shadow-[0_0_5px_#ff00ff] m-0">MYSTERY PIC</h1>
        <div class="text-[#00ffff] text-xs mt-2 shadow-[0_0_5px_#00ffff]">PHOTO DU JOUR</div>
      </div>

      <!-- Game Content -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
        <!-- Main Section -->
        <div class="flex flex-col gap-4">
          <!-- Photo Frame -->
          <div class="aspect-square bg-black border-4 border-[#ff00ff] shadow-[0_0_10px_#ff00ff,inset_0_0_5px_#ff00ff] p-2 flex items-center justify-center">
            <img 
              :src="today?.imageUrl" 
              alt="Photo du jour" 
              class="max-w-full max-h-full object-contain" 
            />
          </div>

          <!-- Input Section -->
          <div class="bg-black border-4 border-[#ff00ff] shadow-[0_0_10px_#ff00ff,inset_0_0_5px_#ff00ff] p-2">
            <div class="text-[#ff00ff] text-xs text-center mb-2">TA PROPOSITION</div>
            <div class="flex gap-2">
              <input 
                v-model="guess" 
                @keyup.enter="submit"
                type="text" 
                class="flex-1 bg-[#1a1a1a] border-2 border-[#00ffff] text-[#00ffff] p-2 text-xs font-['Press_Start_2P'] focus:outline-none focus:shadow-[0_0_5px_#00ffff]"
                placeholder="..."
              />
              <button 
                @click="submit" 
                class="bg-[#00ffff] text-black px-4 py-2 text-xs font-['Press_Start_2P'] hover:bg-[#66ffff] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>

        <!-- Score Section -->
        <div class="bg-black border-4 border-[#ff00ff] shadow-[0_0_10px_#ff00ff,inset_0_0_5px_#ff00ff]">
          <div class="text-[#ff00ff] text-xs text-center p-2 border-b-2 border-[#ff00ff]">
            CLASSEMENT
          </div>
          <div class="p-2">
            <div v-for="score in [350, 280, 210, 170]" :key="score" 
                 class="flex justify-between items-center p-2 border-b border-[#ff00ff] border-opacity-30 last:border-b-0">
              <div class="text-base">👾</div>
              <div class="text-[#ff00ff] text-xs">{{ score }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from '../composables/useApi'
import UserStatus from '../components/UserStatus.vue'
import Leaderboard from '../components/Leaderboard.vue'

console.log('API URL:', import.meta.env.VITE_API_URL);

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
      // imageUrl: `${import.meta.env.VITE_API_URL}${data.imageUrl}`
      imageUrl: 'https://cdn.discordapp.com/attachments/685655650923053122/1364960965405315132/ChatGPT_Image_24_avr._2025_15_47_22.png?ex=6814ccf5&is=68137b75&hm=75104d3f287723472d7d4008f0b7dd6f581b12fac63256a326c9e32f72f8576b&'
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
</style>
