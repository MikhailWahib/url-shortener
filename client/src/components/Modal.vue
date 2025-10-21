<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-bg" @click="close">
      <div class="modal" @click.stop>
        <div class="modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3>Please Note</h3>
        <p>Server may take some time to load for the first time. Please be patient while we wake it up.</p>
        <button class="btn btn-primary" @click="close">Got it!</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const show = ref(false)

onMounted(() => {
  const hasModalBeenShown = localStorage.getItem('modalShown');
  if (!hasModalBeenShown) {
    localStorage.setItem('modalShown', 'true');
    show.value = true
  }
})

const close = () => {
  show.value = false
}
</script>

<style scoped>
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  max-width: 460px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: modalSlideUp 0.4s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(251, 191, 36, 0.3);
}

.modal-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 1rem 0;
  letter-spacing: -0.3px;
}

.modal p {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

button {
  width: 100%;
  margin: 0;
}

/* Transition animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal,
.modal-fade-leave-active .modal {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
}

.modal-fade-leave-to .modal {
  transform: translateY(-30px) scale(0.95);
  opacity: 0;
}

@media (max-width: 768px) {
  .modal {
    padding: 2rem 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  .modal p {
    font-size: 0.9rem;
  }

  .modal-icon {
    width: 56px;
    height: 56px;
  }

  .modal-icon svg {
    width: 28px;
    height: 28px;
  }
}
</style>