<template>
    <main>
        <h2>Login</h2>
        <form @submit="onSubmit">
            <label for="username">Username</label>
            <input type="text" v-model="username" v-bind="usernameAttrs">
            <div class="error-msg" v-if="isFieldTouched('username')">{{ errors.username }}</div>
            <label for="password">Password</label>
            <input type="password" v-model="password" v-bind="passwordAttrs">
            <div class="error-msg" v-if="isFieldTouched('password')">{{ errors.password }}</div>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span v-if="!isLoading">Login</span>
                <Spinner v-if="isLoading" />
            </button>
        </form>
        <p class="signup-text">New User? <RouterLink to="/signup" class="signup-link">Sign Up</RouterLink>
        </p>
        <div class="error-msg" v-if="resError">{{ resError }}</div>
    </main>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as Yup from 'yup';
import { useForm } from 'vee-validate';
import { userStore } from '@/userStore';
import Spinner from '@/components/Spinner.vue';

type Response = {
    id?: number;
    username?: string;
    error?: string
} | undefined;


const isLoading = ref(false);
const resError = ref<string | undefined>();
const router = useRouter();

const handleLogin = async (values: any) => {
    isLoading.value = true;
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/api/v1/users/login`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })

    const data: Response = await res.json();
    if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(data));
        userStore.user = {
            id: data?.id!,
            username: data?.username!
        };
        router.push('/');
    } else {
        resError.value = data?.error;
    }
    isLoading.value = false;
}

const schema = Yup.object().shape({
    username: Yup.string().required('Username is required').min(6, 'Username must be at least 6 characters'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const { errors, handleSubmit, defineField, isFieldTouched } = useForm({
    validationSchema: schema
});

const onSubmit = handleSubmit(values => {
    handleLogin(values);
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');

</script>


<style scoped>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 650px;
    margin: 0 auto;
    margin-top: 2rem;
    padding: 2rem;
}

h2 {
    margin-bottom: 1rem;
    font-size: 1.75rem;
    font-weight: 500;
}

form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
}

label {
    align-self: flex-start;
    margin-left: .25rem;
}

input {
    width: 100%;
    padding: 0.5rem;
    color: white;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    font-size: 1rem;
    transition: border 0.1s;
}

input:focus {
    outline: none;
    border: 1px solid white;
}

button {
    margin-top: 1rem;
}

.guest-btn {
    margin-bottom: .5rem;
}

.error-msg {
    color: red;
    font-size: .85rem;
    font-weight: 300;
}

.signup-text {
    margin-top: .5rem;
    font-size: .9rem;
    opacity: .75;
}

.signup-link {
    text-decoration: underline;
    transition: opacity 300ms;
}

.signup-link:hover {
    opacity: .75;
}
</style>