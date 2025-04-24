<template>
  <div class="admin-login">
    <div class="glass-card">
      <h2>Admin Login</h2>
      <form @submit.prevent="login" class="login-form">
        <input 
          v-model="password" 
          type="password" 
          placeholder="Mot de passe"
          class="login-input"
        />
        <button type="submit" class="login-button">Connexion</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')

const login = () => {
  if (password.value === 'admin123') {
    localStorage.setItem('admin-authenticated', 'true')
    router.push('/admin')
  } else {
    alert('Mot de passe incorrect')
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
}

h2 {
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
}

.login-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.login-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style> 