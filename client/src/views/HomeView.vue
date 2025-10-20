<template>
  <main>
    <h2>Shorten your URLs</h2>
    <UrlForm :urls="urls" @onSubmit="handleUrlSubmit" />
    <UrlsList :urls="urls" />
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
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 650px;
  margin: 0 auto;
  margin-top: 2rem;
  padding: 2rem 0;
}
</style>
