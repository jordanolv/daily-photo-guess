<template>
  <div class="callback">
    <p>Connexion en cours...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  const token = new URLSearchParams(window.location.search).get('token');
  if (token) {
    localStorage.setItem('token', token);
    router.push('/');
  } else {
    router.push('/');
  }
});
</script>

<style scoped>
.callback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #666;
}
</style> 