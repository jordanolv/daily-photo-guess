<template>
  <div class="user-status">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
    </div>
    <div v-else-if="user" class="user-info">
      <div class="user-profile" @click="showDropdown = !showDropdown">
        <img :src="user.avatar" alt="Avatar" class="avatar" v-if="user.avatar" />
        <span class="username">{{ user.username }}</span>
        <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
      <div v-if="showDropdown" class="dropdown-menu">
        <button @click="handleLogout" class="logout-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="logout-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
    <DiscordLogin v-else class="login-button" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DiscordLogin from './DiscordLogin.vue';

interface User {
  avatar: string;
  username: string;
}

const user = ref<User | null>(null);
const loading = ref(true);
const showDropdown = ref(false);

const fetchUserStatus = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/status`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      user.value = data.authenticated ? data.user : null;
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    user.value = null;
    showDropdown.value = false;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};

// Fermer le dropdown quand on clique ailleurs
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-profile')) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  fetchUserStatus();
  document.addEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.user-status {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #5865F2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.user-info {
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background-color: #f8f9fa;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: #e9ecef;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #666;
  transition: transform 0.2s;
}

.user-profile:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 160px;
  z-index: 1000;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  color: #dc3545;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #fff5f5;
}

.logout-icon {
  width: 16px;
  height: 16px;
}

.login-button {
  height: 40px;
}
</style> 