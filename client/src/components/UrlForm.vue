<template>
    <form @submit.prevent="onSubmit">
        <div class="input-wrapper">
            <input type="text" v-model="input" placeholder="Enter your long URL here..." />
            <button type="submit" class="btn btn-primary">
                Shorten URL
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { userStore } from '@/userStore';
import { useToast } from "vue-toastification";

const input = ref('');
const emit = defineEmits(['onSubmit'])

const router = useRouter();
const toast = useToast();

const onSubmit = async () => {
    const API_URL = import.meta.env.VITE_API_URL

    try {
        const res = await fetch(`${API_URL}/api/v1/shorten`, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: input.value
            })
        })

        const data = await res.json()

        if (res.ok) {
            toast.success('URL shortened successfully!')
            emit('onSubmit', data)
            input.value = ''
        } else if (res.status === 401) {
            router.push('/login')
            userStore.user = null
            localStorage.removeItem('user')
            toast.error('Session expired, please login again')
        } else {
            console.log(data)
            toast.error('Please enter a valid URL')
        }
    }
    catch (error) {
        console.log(error)
    }
}
</script>

<style scoped>
form {
    width: 100%;
    margin-bottom: 2rem;
    animation: slideUp 0.6s ease-out 0.2s backwards;
}

.input-wrapper {
    position: relative;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 0.5rem;
    display: flex;
    gap: 0.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

input {
    flex: 1;
    padding: 1rem 1.25rem;
    color: #2d3748;
    background: transparent;
    border: none;
    font-size: 1rem;
    font-weight: 500;
}

input::placeholder {
    color: #a0aec0;
}

input:focus {
    outline: none;
}

.btn {
    flex: .5;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.arrow-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
}

.btn:hover:not(:disabled) .arrow-icon {
    transform: translateX(4px);
}

@media (max-width: 768px) {
    .input-wrapper {
        flex-direction: column;
        padding: 0.75rem;
    }

    input {
        padding: 0.75rem 1rem;
        font-size: 0.95rem;
    }

    .btn {
        width: 100%;
    }
}
</style>