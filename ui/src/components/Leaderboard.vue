<template>
  <div>
    <h2 class="text-center text-2xl font-bold text-yellow-500 mt-6 mb-4">🏆 Leaderboard</h2>
    <ul class="bg-white/5 backdrop-blur-md rounded-xl shadow-md divide-y divide-white/10">
      <li
        v-for="(entry, index) in leaderboard"
        :key="entry.userId"
        class="px-5 py-3 flex justify-between items-center"
        :class="{
          'bg-yellow-400/10 text-yellow-300 font-bold': index === 0,
          'bg-gray-400/10 text-gray-200 font-semibold': index === 1,
          'bg-orange-400/10 text-orange-300 font-semibold': index === 2
        }"
      >
        <span>
          #{{ index + 1 }} – <span class="italic">{{ entry.userId.slice(0, -4) }}</span>
        </span>
        <span class="text-right">
          {{ entry.total }} réponse{{ entry.total > 1 ? 's' : '' }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../composables/useApi'

const leaderboard = ref<{ userId: string; total: number }[]>([])

onMounted(async () => {
  try {
    const { data } = await api.get('/guess/leaderboard')
    leaderboard.value = data
  } catch (err) {
    console.error('Erreur chargement leaderboard', err)
  }
})
</script>
