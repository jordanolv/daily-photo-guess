<template>
  <div class="mt-6">
    <h2 class="text-lg font-semibold">Classement</h2>
    <ol class="list-decimal list-inside">
      <li v-for="row in rows" :key="row.userId">
        {{ row.userId }} – {{ row.tries }} essais
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLeaderboard } from '@/composables/useLeaderboard';

const props = defineProps<{ date: string }>();
const rows = ref<Array<{ userId: string; tries: number }>>([]);

onMounted(() => {
  const socket = useLeaderboard(props.date);
  socket.emit('join', { date: props.date });
  socket.on('updateLeaderboard', top => {
    rows.value = top.map((r: any) => ({
      userId: r.userId,
      tries: Number(r.tries),
    }));
  });
});
</script>
