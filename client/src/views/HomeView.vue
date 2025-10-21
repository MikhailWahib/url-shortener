<template>
  <main>
    <div class="home-container">
      <div class="header-section">
        <div class="icon-wrapper">
          <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>
        <h2>Shorten Your URLs</h2>
        <p class="subtitle">Create short, memorable links in seconds</p>
      </div>
      <UrlForm :urls="urls" @onSubmit="handleUrlSubmit" />
      <UrlsList :urls="urls" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UrlForm from '@/components/UrlForm.vue'
import UrlsList from '@/components/UrlsList.vue'
import { userStore } from '@/userStore'
import type { UrlObj } from '@/types'

const urls = ref<UrlObj[]>([])
const router = useRouter()

const getUrls = async () => {
  const API_URL = import.meta.env.VITE_API_URL
  try {
    const res = await fetch(`${API_URL}/api/v1/users/urls`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const data = await res.json()

    if (res.status === 401) {
      router.push('/login')
      localStorage.removeItem('user')
      userStore.user = null

      return
    }

    urls.value = data.urls

  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getUrls()
})

const handleUrlSubmit = (url: UrlObj) => {
  if (!urls.value) {
    urls.value = [{ ...url }]
  } else {
    urls.value.unshift(url)
  }
}
</script>

<style scoped>
main {
  flex: 1;
  width: 100%;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

main::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  top: -250px;
  right: -250px;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

main::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  bottom: -200px;
  left: -200px;
  border-radius: 50%;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 30px); }
}

.home-container {
  position: relative;
  z-index: 1;
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.link-icon {
  width: 36px;
  height: 36px;
  color: #667eea;
}

h2 {
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  main {
    padding: 1.5rem;
  }

  .header-section {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .icon-wrapper {
    width: 70px;
    height: 70px;
  }

  .link-icon {
    width: 32px;
    height: 32px;
  }
}
</style>
