<template>
    <div v-if="show" class="modal-bg">
        <div class="modal">
            <p>Note: Server may take some time to load for first time, please be patient</p>
            <button class="btn btn-primary" @click="close">Ok</button>
        </div>
    </div>
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
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
}

.modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 10rem;
    width: 30rem;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    background-color: black;

}

.modal p {
    color: white;
}

button {
    margin-top: 3rem;
}

@media (max-width: 768px) {
    .modal {
        width: 90%;
    }
}
</style>