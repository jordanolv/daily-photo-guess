<template>
  <DailyPhoto />
  <p>{{ poulet }}</p>
  <button @click="increment">Increment</button>
  {{ count }}
</template>

<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const poulet = computed(() => {
  if (count.value > 20) {
    return 'Moumou est un champion';
  } else if (count.value > 10) {
    return 'Moumou rate le ballon';
  } else {
    return 'Moumou rate pas le ballon';
  }
});

const increment = () => {
  count.value++;
};

import DailyPhoto from './components/DailyPhoto.vue';
</script>
