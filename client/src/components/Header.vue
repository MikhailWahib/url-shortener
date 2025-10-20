<template>
    <header>
        <div class="logo">
            <UrlIcon :size=32 />
            <h1>URL Shortener</h1>
        </div>
        <button v-if="userStore.user" @click="handleLogout">
            <span>logout</span>
        </button>
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
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

ul {
    display: flex;
    gap: 1.5rem;
}

button {
    font-size: 1rem;
}

@media (max-width: 768px) {
    .logo h1 {
        font-size: 1.25rem;
    }
}
</style>