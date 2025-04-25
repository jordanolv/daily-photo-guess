<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    
    <div class="dashboard-grid">
      <!-- Bloc de gestion de la photo du jour -->
      <div class="glass-card">
        <h2>Photo du jour</h2>
        <div class="card-content">
          <div v-if="todayPhoto" class="photo-info">
            <img :src="todayPhoto.imageUrl" alt="Photo du jour" class="preview-image" />
            <div class="info">
              <p>Date: {{ todayPhoto.date }}</p>
              <p>Solution: {{ todayPhoto.solution }}</p>
            </div>
          </div>
          <div class="actions">
            <button @click="regeneratePhoto" class="action-button">
              Régénérer la photo
            </button>
            <button @click="resetAllPhotos" class="action-button reset-button">
              Reset toutes les photos
            </button>
          </div>
        </div>
      </div>

      <!-- Bloc d'ajout de photo -->
      <div class="glass-card">
        <h2>Ajouter une photo</h2>
        <div class="card-content">
          <form @submit.prevent="addPhoto" class="add-photo-form">
            <div class="form-group">
              <label>URL de l'image</label>
              <input 
                v-model="newPhoto.imageUrl" 
                type="text" 
                placeholder="https://example.com/image.jpg"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Solution</label>
              <input 
                v-model="newPhoto.solution" 
                type="text" 
                placeholder="Ex: Titeuf"
                required
                class="form-input"
              />
            </div>
            <button type="submit" class="action-button">Ajouter la photo</button>
          </form>
        </div>
      </div>

      <!-- Bloc de statistiques -->
      <div class="glass-card">
        <h2>Statistiques</h2>
        <div class="card-content">
          <div class="stats">
            <div class="stat-item">
              <span class="stat-value">{{ stats.totalPhotos }}</span>
              <span class="stat-label">Photos totales</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats.unusedPhotos }}</span>
              <span class="stat-label">Photos non utilisées</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bloc de gestion des photos -->
      <div class="glass-card full-width">
        <h2>Gestion des photos</h2>
        <div class="card-content">
          <div class="tabs">
            <button 
              :class="['tab-button', { active: activeTab === 'unused' }]"
              @click="activeTab = 'unused'"
            >
              Photos non utilisées
            </button>
            <button 
              :class="['tab-button', { active: activeTab === 'all' }]"
              @click="activeTab = 'all'"
            >
              Toutes les photos
            </button>
          </div>
          <div class="photo-list">
            <div v-for="photo in displayedPhotos" :key="photo.id" class="photo-item">
              <img :src="photo.imageUrl" alt="Photo" class="preview-image" />
              <div class="photo-info">
                <p><strong>Solution:</strong> {{ photo.solution }}</p>
                <p v-if="photo.date"><strong>Date:</strong> {{ photo.date }}</p>
              </div>
              <div class="photo-actions">
                <button @click="deletePhoto(photo.id)" class="delete-button">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '../composables/useApi'

interface Photo {
  id: number
  date: string | null
  imageUrl: string
  solution: string
}

interface Stats {
  totalPhotos: number
  unusedPhotos: number
}

const todayPhoto = ref<Photo | null>(null)
const unusedPhotos = ref<Photo[]>([])
const allPhotos = ref<Photo[]>([])
const activeTab = ref<'unused' | 'all'>('unused')
const stats = ref<Stats>({
  totalPhotos: 0,
  unusedPhotos: 0
})

const newPhoto = ref({
  imageUrl: '',
  solution: ''
})

const displayedPhotos = computed(() => {
  return activeTab.value === 'unused' ? unusedPhotos.value : allPhotos.value
})

const fetchTodayPhoto = async () => {
  try {
    const { data } = await api.get('/admin/today')
    todayPhoto.value = data
  } catch (error) {
    console.error('Erreur lors de la récupération de la photo du jour:', error)
  }
}

const fetchUnusedPhotos = async () => {
  try {
    const { data } = await api.get('/admin/photos/unused')
    unusedPhotos.value = data
    stats.value.unusedPhotos = data.length
  } catch (error) {
    console.error('Erreur lors de la récupération des photos non utilisées:', error)
  }
}

const fetchAllPhotos = async () => {
  try {
    const { data } = await api.get('/admin/photos')
    allPhotos.value = data
    stats.value.totalPhotos = data.length
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les photos:', error)
  }
}

const refreshAll = async () => {
  await Promise.all([
    fetchTodayPhoto(),
    fetchUnusedPhotos(),
    fetchAllPhotos()
  ])
}

const regeneratePhoto = async () => {
  try {
    await api.post('/photo/regenerate')
    await refreshAll()
  } catch (error) {
    console.error('Erreur lors de la régénération de la photo:', error)
  }
}

const resetAllPhotos = async () => {
  if (!confirm('Êtes-vous sûr de vouloir reset toutes les photos ?')) return;
  
  try {
    await api.post('/admin/reset')
    await refreshAll()
  } catch (error) {
    console.error('Erreur lors du reset des photos:', error)
  }
}

const addPhoto = async () => {
  try {
    await api.post('/admin/photos', newPhoto.value)
    newPhoto.value = { imageUrl: '', solution: '' }
    await refreshAll()
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la photo:', error)
  }
}

const deletePhoto = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return;
  
  try {
    await api.delete(`/admin/photos/${id}`)
    await refreshAll()
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo:', error)
  }
}

onMounted(() => {
  refreshAll()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

h1 {
  color: white;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.full-width {
  grid-column: 1 / -1;
}

h2 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.card-content {
  color: white;
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.action-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.reset-button {
  background: rgba(255, 0, 0, 0.2);
}

.reset-button:hover {
  background: rgba(255, 0, 0, 0.3);
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tab-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  background: rgba(255, 255, 255, 0.3);
}

.photo-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.photo-item {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
}

.photo-info {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.photo-info p {
  margin: 0.25rem 0;
}

.photo-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.delete-button {
  background: rgba(255, 0, 0, 0.2);
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-button:hover {
  background: rgba(255, 0, 0, 0.3);
}

.add-photo-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.form-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
</style> 