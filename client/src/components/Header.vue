<template>
  <header>
    <div class="header-container">
      <div class="logo">
        <div class="logo-icon">
          <UrlIcon :size="28" />
        </div>
        <h1>URL Shortener</h1>
      </div>
      <button v-if="userStore.user" @click="handleLogout" class="logout-btn">
        <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import UrlIcon from './icons/UrlIcon.vue'
import { userStore } from '@/userStore';

const router = useRouter()

const handleLogout = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_URL
    const res = await fetch(`${API_URL}/api/v1/users/logout`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    if (res.ok) {
      userStore.user = null
      localStorage.removeItem('user')
      router.push('/login')
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
header {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.header-container {
  width: 100%;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease;
}

.logo-icon:hover {
  transform: rotate(-5deg) scale(1.05);
}

.logo-icon :deep(svg) {
  color: white;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  letter-spacing: -0.5px;
  margin: 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: white;
  color: #e53e3e;
  border: 2px solid #feb2b2;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.1);
}

.logout-btn:hover {
  background: #fff5f5;
  border-color: #fc8181;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.2);
}

.logout-btn:active {
  transform: translateY(0);
}

.logout-icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .header-container {
    padding: 1rem 1.5rem;
  }

  .logo-icon {
    width: 42px;
    height: 42px;
  }

  h1 {
    font-size: 1.25rem;
  }

  .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .logout-btn span {
    display: none;
  }

  .logout-icon {
    width: 20px;
    height: 20px;
  }
}
</style>