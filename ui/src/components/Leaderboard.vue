<template>
  <div>
    <h2 class="text-center text-xl font-semibold mt-6 mb-2">🏆 Leaderboard</h2>
    <ul class="bg-white rounded shadow divide-y divide-gray-200">
      <li
        v-for="(entry, index) in leaderboard"
        :key="entry.userId"
        class="px-4 py-2 flex justify-between"
      >
        <span class="font-medium">
          #{{ index + 1 }} – {{ entry.userId }}
        </span>
        <span class="text-blue-600 font-semibold">
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
