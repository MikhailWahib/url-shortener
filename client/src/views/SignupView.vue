<template>
    <main>
        <div class="signup-container">
            <div class="header-section">
                <div class="icon-wrapper">
                    <svg class="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <h2>Create Account</h2>
                <p class="subtitle">Join us to start shortening URLs</p>
            </div>

            <form @submit="onSubmit">
                <div class="input-group">
                    <label for="username">Username</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <input type="text" v-model="username" v-bind="usernameAttrs" placeholder="Choose a username">
                    </div>
                    <div class="error-msg" v-if="isFieldTouched('username')">{{ errors.username }}</div>
                </div>

                <div class="input-group">
                    <label for="password">Password</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input type="password" v-model="password" v-bind="passwordAttrs" placeholder="Create a password">
                    </div>
                    <div class="error-msg" v-if="isFieldTouched('password')">{{ errors.password }}</div>
                </div>

                <div class="input-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <div class="input-wrapper">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input type="password" v-model="confirmPassword" v-bind="confirmPasswordAttrs" placeholder="Confirm your password">
                    </div>
                    <div class="error-msg" v-if="isFieldTouched('confirmPassword')">{{ errors.confirmPassword }}</div>
                </div>

                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                    <span v-if="!isLoading">Create Account</span>
                    <Spinner v-if="isLoading" />
                </button>

                <div class="error-msg response-error" v-if="resError">{{ resError }}</div>
            </form>

            <div class="divider">
                <span>Already have an account?</span>
            </div>

            <p class="login-text">
                <RouterLink to="/login" class="login-link">
                    Sign in here
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
import { useToast } from 'vue-toastification';
import Spinner from '@/components/Spinner.vue';

type Response = {
    message: string
    error?: string
} | undefined;


const isLoading = ref(false);
const resError = ref<string | undefined>();
const router = useRouter();

const toast = useToast();
const handleSignup = async (values: any) => {
    isLoading.value = true;
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/api/v1/users`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })

    const data: Response = await res.json();
    if (res.status === 201) {
        toast.success('User created successfully');
        router.push('/login');
    } else {
        resError.value = data?.error;
    }
    isLoading.value = false;
}

const schema = Yup.object().shape({
    username: Yup.string().required('Username is required').min(6, 'Username must be at least 6 characters'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password')], 'Passwords must match'),
});

const { errors, handleSubmit, defineField, isFieldTouched } = useForm({
    validationSchema: schema
});

const onSubmit = handleSubmit(values => {
    handleSignup(values);
});

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

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

.signup-container {
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
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.user-icon {
    width: 32px;
    height: 32px;
    color: white;
}

h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
    letter-spacing: -0.5px;
}

.subtitle {
    color: #718096;
    font-size: 1rem;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #4a5568;
    margin-left: 0.25rem;
}

.input-wrapper {
    position: relative;
}

.input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #a0aec0;
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

.error-msg {
    color: #e53e3e;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.response-error {
    text-align: center;
    margin-top: 1rem;
}

.divider {
    margin: 2rem 0;
    display: flex;
    align-items: center;
    text-align: center;
    color: #a0aec0;
    font-size: 0.875rem;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
}

.divider span {
    margin: 0 1rem;
}

.login-text {
    text-align: center;
}

.login-link {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.login-link:hover {
    color: #5a67d8;
}

.arrow-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
}

.login-link:hover .arrow-icon {
    transform: translateX(4px);
}

@media (max-width: 768px) {
    main {
        padding: 1.5rem;
    }

    .signup-container {
        padding: 2rem 1.5rem;
    }

    h2 {
        font-size: 1.5rem;
    }

    .icon-wrapper {
        width: 60px;
        height: 60px;
    }

    .user-icon {
        width: 28px;
        height: 28px;
    }
}
</style>