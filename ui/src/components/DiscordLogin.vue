<template>
  <button @click="handleLogin" class="discord-login-btn">
    <img src="../assets/discord-logo.svg" alt="Discord" class="discord-logo" />
    <span class="login-text">Login</span>
  </button>
</template>

<script setup lang="ts">

const handleLogin = () => {
  const redirectUrl = `${import.meta.env.VITE_API_URL}/auth/discord`;
  window.location.href = redirectUrl;
};
</script>

<style scoped>
.discord-login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #5865F2;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  height: 40px;
}

.discord-login-btn:hover {
  background-color: #4752C4;
  transform: translateY(-1px);
}

.discord-login-btn:active {
  transform: translateY(0);
}

.discord-logo {
  width: 20px;
  height: 20px;
}

.login-text {
  display: inline;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .discord-login-btn {
    padding: 8px;
  }
  
  .login-text {
    display: none;
  }
}
</style> 