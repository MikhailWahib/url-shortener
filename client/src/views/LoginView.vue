<template>
    <main>
        <div class="login-container">
            <div class="header-section">
                <div class="icon-wrapper">
                    <svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <h2>Welcome Back</h2>
                <p class="subtitle">Sign in to continue your journey</p>
            </div>

            <form @submit="onSubmit">
                <div class="input-group">
                    <label for="username">Username</label>
                    <div class="input-wrapper" :class="{ 'error': errors.username && isFieldTouched('username'), 'success': !errors.username && isFieldTouched('username') }">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input 
                            type="text" 
                            v-model="username" 
                            v-bind="usernameAttrs" 
                            placeholder="Enter your username"
                        >
                        <div class="validation-icon" v-if="isFieldTouched('username')">
                            <svg v-if="errors.username" class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M15 9l-6 6M9 9l6 6"/>
                            </svg>
                            <svg v-else class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                        </div>
                    </div>
                    <div class="error-msg" v-if="isFieldTouched('username') && errors.username">{{ errors.username }}</div>
                </div>

                <div class="input-group">
                    <label for="password">Password</label>
                    <div class="input-wrapper" :class="{ 'error': errors.password && isFieldTouched('password'), 'success': !errors.password && isFieldTouched('password') }">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input 
                            type="password" 
                            v-model="password" 
                            v-bind="passwordAttrs" 
                            placeholder="Enter your password"
                        >
                        <div class="validation-icon" v-if="isFieldTouched('password')">
                            <svg v-if="errors.password" class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M15 9l-6 6M9 9l6 6"/>
                            </svg>
                            <svg v-else class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                        </div>
                    </div>
                    <div class="error-msg" v-if="isFieldTouched('password') && errors.password">{{ errors.password }}</div>
                </div>

                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                    <span v-if="!isLoading">Sign In</span>
                    <Spinner v-if="isLoading" />
                </button>

                <div class="error-msg response-error" v-if="resError">{{ resError }}</div>
            </form>

            <div class="divider">
                <span>New to our platform?</span>
            </div>

            <p class="signup-text">
                <RouterLink to="/signup" class="signup-link">
                    Create an account
                    <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </RouterLink>
            </p>
        </div>
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
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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

.login-container {
    width: 100%;
    max-width: 460px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 3rem 2.5rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 1;
    animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.header-section {
    text-align: center;
    margin-bottom: 2.5rem;
}

.icon-wrapper {
    width: 70px;
    height: 70px;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.lock-icon {
    width: 32px;
    height: 32px;
    color: white;
}

h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.5px;
}

.subtitle {
    color: #718096;
    font-size: 0.95rem;
    margin: 0;
    font-weight: 400;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #2d3748;
    margin-left: 0.25rem;
}

.input-wrapper {
    position: relative;
    transition: all 0.3s ease;
}

.input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #a0aec0;
    transition: color 0.3s ease;
}

.validation-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.error-icon {
    width: 18px;
    height: 18px;
    color: #e53e3e;
}

.success-icon {
    width: 18px;
    height: 18px;
    color: #48bb78;
}

input {
    width: 100%;
    padding: 0.875rem 1rem 0.875rem 3rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    color: #2d3748;
    transition: all 0.3s ease;
}

input:hover {
    border-color: #cbd5e0;
}

input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

/* Error state */
.input-wrapper.error .input-icon {
    color: #e53e3e;
}

.input-wrapper.error input {
    border-color: #e53e3e;
    background-color: #fff5f5;
    padding-right: 3rem;
}

.input-wrapper.error input:focus {
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.15);
}

/* Success state */
.input-wrapper.success .input-icon {
    color: #48bb78;
}

.input-wrapper.success input {
    border-color: #48bb78;
    background-color: #f0fff4;
    padding-right: 3rem;
}

.input-wrapper.success input:focus {
    box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.15);
}

.error-msg {
    color: #e53e3e;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.response-error {
    margin-top: -0.5rem;
    text-align: center;
    padding: 0.75rem;
    background: #fff5f5;
    border-radius: 8px;
    border-left: 3px solid #e53e3e;
}

.response-error::before {
    content: '✕';
}

button {
    margin-top: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 50px;
}

button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
}

button:active:not(:disabled) {
    transform: translateY(0);
}

button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.divider {
    margin: 2rem 0 1.5rem;
    text-align: center;
    position: relative;
}

.divider::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

.divider span {
    background: white;
    padding: 0 1rem;
    font-size: 0.85rem;
    color: #718096;
    position: relative;
    z-index: 1;
}

.signup-text {
    text-align: center;
    margin: 0;
}

.signup-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 8px;
}

.signup-link:hover {
    background: #f7fafc;
    gap: 0.75rem;
}

.arrow-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
}

.signup-link:hover .arrow-icon {
    transform: translateX(3px);
}

@media (max-width: 640px) {
    .login-container {
        padding: 2rem 1.5rem;
    }

    h2 {
        font-size: 1.75rem;
    }
}
</style>